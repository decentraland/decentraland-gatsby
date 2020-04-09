
export type Token = string | undefined | null | false

export default class TokenList {

  static join(tokens: Token[]) {
    return new TokenList().add(...tokens).value
  }

  private tokens: Set<string> = new Set()

  constructor(initialValue?: Token) {
    if (initialValue) {
      this.add(initialValue)
    }
  }

  get length() {
    return this.tokens.size
  }

  get value() {
    return Array.from(this.tokens.values()).join(' ')
  }

  contains(token: Token) {
    if (!token) {
      return false
    }

    return this.tokens.has(token)
  }

  add(...tokens: Token[]) {
    for (const token of tokens) {
      if (token) {
        for (const each of token.split(/\s+/)) {
          if (Boolean(each)) {
            this.tokens.add(each)
          }
        }
      }
    }

    return this
  }

  remove(...tokens: Token[]) {
    for (const token of tokens) {
      if (token) {
        for (const each of token.split(' ')) {
          if (Boolean(each)) {
            this.tokens.delete(each)
          }
        }
      }
    }

    return this
  }

  replace(oldToken: Token, newToken: Token) {
    if (!oldToken || !newToken) {
      return false
    }

    if (/s+/.test(newToken)) {
      return false
    }

    if (!this.tokens.has(oldToken)) {
      return false
    }

    this.tokens.delete(oldToken)
    this.tokens.add(newToken)

    return true
  }

  toggle(token: Token, force?: boolean) {
    if (!token) {
      return false
    }

    if (/s+/.test(token)) {
      return false
    }

    switch (force) {
      case true:
        this.tokens.add(token)
        return true

      case false:
        this.tokens.delete(token)
        return false

      default:
        if (this.tokens.has(token)) {
          this.tokens.delete(token)
          return false

        } else {
          this.tokens.add(token)
          return true
        }
    }
  }

  values() {
    return this.tokens.values()
  }

  [Symbol.iterator]() {
    return this.values()
  }
}