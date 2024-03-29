import { InvalidCharacterError } from '../errors/InvalidCharacterError'

export type Token = string | undefined | null | false

/**
 * Represents a set of space-separated tokens. It is indexed
 * beginning with 0 as with JavaScript Array objects. TokenList
 * is always case-sensitive.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
 */
export default class TokenList implements DOMTokenList {
  static parse(value: Token): string[] {
    if (!value) {
      return []
    }

    const set = new Set()
    const list = String(value).split(/\s+/)
    return list.filter((value) => {
      if (Boolean(value) && !set.has(value)) {
        set.add(value)
        return true
      }

      return false
    })
  }

  static from(...tokens: Token[]) {
    const list = new TokenList()
    for (const token of tokens) {
      list.add(...this.parse(token))
    }

    return list
  }

  static join(tokens: Token[]): string {
    return this.from(...tokens).value
  }

  static isToken(token: string) {
    return !token || !/\s+/.test(token)
  }

  [index: number]: string
  #tokens: string[] = []

  #validate(method: string, token: string) {
    if (!token) {
      throw new SyntaxError(
        `Failed to execute '${method}' on 'TokenList': The token provided must not be empty.`
      )
    }

    if (!TokenList.isToken(token)) {
      throw new InvalidCharacterError(
        `Failed to execute '${token}' on 'TokenList': The token provided ('${token}') contains HTML space characters, which are not valid in tokens.`
      )
    }

    return true
  }

  /** Returns the number of tokens. */
  get length() {
    return this.#tokens.length
  }

  /**
   * Returns the associated set as string.
   *
   * Can be set, to change the associated attribute.
   */
  get value() {
    return this.#tokens.join(' ')
  }

  /**
   * Returns the associated set as string.
   *
   * Can be set, to change the associated attribute.
   */
  set value(value: string) {
    this.#tokens = TokenList.parse(value)
  }

  item(index: number): string | null {
    return this.#tokens[index] ?? null
  }

  contains(token: string) {
    return this.#tokens.includes(token)
  }

  add(...tokens: string[]): void {
    if (tokens.length === 0) {
      return
    }

    const set = new Set(this.#tokens)
    for (const token of tokens) {
      this.#validate('add', token)
      if (!set.has(token)) {
        this.#tokens.push(token)
      }
    }
  }

  remove(...tokens: string[]): void {
    if (tokens.length === 0) {
      return
    }

    const set = new Set<string>()
    for (const token of tokens) {
      this.#validate('remove', token)
      set.add(token)
    }

    this.#tokens = this.#tokens.filter((currentToken) => !set.has(currentToken))
  }

  replace(oldToken: string, newToken: string): boolean {
    this.#validate('replace', oldToken)
    this.#validate('replace', newToken)

    if (!this.#tokens.includes(oldToken)) {
      return false
    }

    if (this.#tokens.includes(newToken)) {
      this.#tokens = this.#tokens.filter((token) => token !== oldToken)
    } else {
      this.#tokens = this.#tokens.map((token) =>
        token === oldToken ? newToken : token
      )
    }

    return true
  }

  supports(): boolean {
    throw new TypeError(
      `Failed to execute 'supports' on 'TokenList': TokenList has no supported tokens.`
    )
  }

  toggle(token: string, force?: boolean): boolean {
    this.#validate('toggle', token)
    switch (force) {
      case true:
        this.add(token)
        return true

      case false:
        this.remove(token)
        return false

      default:
        if (!this.#tokens.includes(token)) {
          this.add(token)
          return true
        } else {
          this.remove(token)
          return false
        }
    }
  }

  entries() {
    return this.#tokens.entries()
  }

  forEach(
    callbackfn: (value: string, key: number, parent: DOMTokenList) => void,
    thisArg?: any
  ): void {
    this.#tokens.forEach(
      (value, key) => callbackfn.call(thisArg ?? this, value, key, this),
      thisArg
    )
  }

  keys() {
    return this.#tokens.keys()
  }

  values() {
    return this.#tokens.values()
  }

  toString(): string {
    return this.value
  }

  [Symbol.iterator]() {
    return this.values()
  }
}
