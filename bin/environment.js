const { allConfig, setAllConfig } = require('@pulumi/pulumi/runtime/config')
const { readFileSync, writeFileSync, statSync } = require('fs')
const { execSync } = require('child_process')
const { parse } = require('yaml')
const { resolve, relative, dirname } = require('path')
const { red, grey, green, cyan } = require('colors/safe')
const [ _bin, _file, cwd, target ] = process.argv

let output = [
  '#!/usr/bin/env bash',
  'set -a'
]

function toName(name) {
  return name.replace(/\W/gi, '_').toUpperCase()
}

function toValue(value) {
  switch(typeof value) {
    case 'number':
    case 'bigint':
    case 'string':
      return value.toString()
    case 'boolean':
      return String(value ? 1 : 0)
    case 'object':
      return JSON.stringify(value)
    case 'undefined':
      return ""
    default:
      return `[${value}]`
  }
}

function environment(name, value) {
  if (name && value !== null && value !== undefined) {
    name = toName(name)
    value = toValue(value)
    output.push(`export ${name}=${JSON.stringify(value)}`)
    console.log(grey(`export  ${cyan(name)}=${green(JSON.stringify(value))}`), )
  }
}

function stats(file) {
  try {
    return statSync(file)
  } catch (e) {
    return null
  }
}

function ensureFile(file) {
  const relative_path = relative(cwd, file)
  console.log(grey(`opening`), green(relative_path))

  const stat = stats(file)
  if (!stat) {
    throw new Error(`File "./${relative_path}" not found `)
  }

  if (stat.isDirectory()) {
    throw new Error(`File "./${relative_path}" is a directory`)
  }
}

if (!target) {
  process.exit()
}

const output_file = resolve(dirname(dirname(__filename)), target)

let pulumi_dir = cwd
if (!pulumi_dir.endsWith('/.ci')) {
  pulumi_dir = resolve(pulumi_dir, './.ci')
}

function getPulumi() {
  const pulumi_file = resolve(pulumi_dir, `./Pulumi.yaml`)
  ensureFile(pulumi_file)

  const content = readFileSync(pulumi_file, 'utf-8')
  // return parse(content)
  try {
    return parse(content);
  } catch (e) {
    throw new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`);
  }
}


function getPulumiConfig() {
  try {
    const stack_output = execSync(`pulumi stack --cwd ${pulumi_dir} -i -v=0`, {  })
      .toString()

    const stack_line = stack_output
      .split('\n')
      .find(line => line.startsWith('Current stack is '))

    if (!stack_line) {
      throw new Error(`stack could not be detected, use stack`)
    }

    const stack = stack_line.trim().slice('Current stack is '.length, -1)
    const pulumi_stack_file = resolve(pulumi_dir, `./Pulumi.${stack}.yaml`)
    ensureFile(pulumi_stack_file)

    const content = readFileSync(pulumi_stack_file, 'utf-8')
    try {
      setAllConfig(parse(content).config);
      return allConfig()
    } catch (e) {
      throw new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`);
    }
  } catch (error) {
    // console.log('getPulumiStack', e)
    const lines = error.message.split('\n')
    let message = lines.find(line => line.startsWith('error: '))
    if (message) {
      message = message.slice('error: '.length)
    } else {
      message = lines[0]
    }

    throw new Error(message)
  }
}


Promise.resolve()
  .then(() => {
    const pulumi = getPulumi()
    const config = getPulumiConfig()
    const project = pulumi.name
    const prefix = project + ':'

    environment('PULUMI_PROJECT', pulumi['name']);

    for (const key of Object.keys(pulumi)) {
      environment(`pulumi_${key}`, pulumi[key])
    }

    for (const key of Object.keys(config)) {
      if (key.startsWith(prefix)) {
        environment(key.slice(prefix.length), config[key])
      } else {
        environment(key, config[key])
      }
    }
  })
  .then(() => {
    // readFileSync
  })
  .then(() => {
    output.push(`rm "${output_file}"`)
    writeFileSync(output_file, output.join('\n'))
    process.exit(0)
  })
  .catch((err) => {
    const newLinePosition = err.stack.indexOf(`\n`)
    console.log()
    console.log(red(err.stack.slice(0, newLinePosition)))
    console.log(grey(err.stack.slice(newLinePosition + 1)))
    console.log()
    process.exit(1)
  })