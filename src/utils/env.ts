import * as UILocation from '@dcl/ui-env/dist/location'

export enum Env {
  LOCAL = 'local',
  DEVELOPMENT = 'dev',
  STAGING = 'stg',
  PRODUCTION = 'prod',
}

export function isEnv(value: any) {
  switch (value) {
    case Env.LOCAL:
    case Env.DEVELOPMENT:
    case Env.STAGING:
    case Env.PRODUCTION:
      return true
    default:
      return false
  }
}

const getEnvFromTLD = UILocation.getEnvFromTLD
const getEnvFromQueryParam = UILocation.getEnvFromQueryParam

export type EnvRecord = Record<string, string | undefined>
export type EnvMap = Partial<Record<Env, EnvRecord>>

const ENVS: Map<Env, EnvRecord> = new Map()

function createEnvs(data: EnvRecord = {}) {
  const result: EnvRecord = {}

  if (typeof process !== 'undefined' && process.env) {
    Object.assign(result, process.env)
  }

  Object.assign(result, data)

  return result
}

function getEnv(): Env {
  if (typeof window !== 'undefined') {
    const envFromQueryParam = getEnvFromQueryParam(window.location)
    if (envFromQueryParam) {
      return envFromQueryParam
    }

    const envFromTLD = getEnvFromTLD(window.location)
    if (envFromTLD) {
      return envFromTLD
    }

    if (
      window.location.host.match(/^localhost:\d{4,4}$/) ||
      window.location.host.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{4,4}$/)
    ) {
      return Env.LOCAL
    }
  }

  if (isEnv(process.env.DCL_DEFAULT_ENV || '')) {
    return process.env.DCL_DEFAULT_ENV as Env
  }

  if (isEnv(process.env.GATSBY_DCL_DEFAULT_ENV || '')) {
    return process.env.GATSBY_DCL_DEFAULT_ENV as Env
  }

  if (process.env.NODE_ENV === 'production') {
    return Env.PRODUCTION
  }

  return Env.LOCAL
}

function getEnvs() {
  const env = getEnv()
  if (!ENVS.has(env)) {
    ENVS.set(env, createEnvs())
  }

  return ENVS.get(env)!
}

function env(name: string): string | undefined
function env(name: string, defaultValue: string): string
function env(name: string, defaultValue?: string): string | undefined {
  const envs = getEnvs()
  return (
    envs[name] ||
    envs['GATSBY_' + name] ||
    envs['REACT_APP_' + name] ||
    envs['STORYBOOK_' + name] ||
    defaultValue
  )
}

export default env

export function requiredEnv(name: string): string {
  const value = env(name, '')

  if (!value) {
    throw new Error(
      `Missing "${name}" environment variable. Check your .env.example file`
    )
  }

  return value
}

export function setupEnv(envs: EnvMap = {}) {
  for (const env of Object.keys(envs)) {
    if (isEnv(env)) {
      ENVS.set(env as Env, createEnvs(envs[env]))
    }
  }
}
