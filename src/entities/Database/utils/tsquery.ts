import tsquery from 'pg-tsquery'

type Node = {
  type?: string
  negated: false
  value: string
  left?: Node
  right?: Node
  prefix: string
  quoted: false
}

function prefixNode(node?: Node): Node | undefined {
  if (node && !node.type && !node.prefix && !node.quoted && !node.negated) {
    node.prefix = ':*'
  }

  return node
}

function prefixChildNodes(node?: Node): Node | undefined {
  if (node && node.type !== '<->') {
    node.left = prefixNode(node.left)
    node.right = prefixNode(node.right)
  }

  return node
}

export class TSQuery extends (tsquery as any).Tsquery {
  parseOr(str: string) {
    return prefixChildNodes(super.parseOr(str))
  }

  parseAnd(str: string) {
    return prefixChildNodes(super.parseAnd(str))
  }

  parseFollowedBy(str: string) {
    return prefixChildNodes(super.parseFollowedBy(str))
  }

  // parseWord(str: string) {
  //   return prefixNode(super.parseWord(str))
  // }

  parse(str: string): Node {
    return super.parse(str)
    // const node = super.parse(str)
    // console.log(node)
    // return node
  }
}

function createParser() {
  const parser = new TSQuery()
  return (str: string) => String(parser.parse(str) || '')
}

export default createParser()
