# Typescript Style Guide

> This guide is intended to be apply on `.ts` files, for react files (`.tsx`) read [./react.md](./react.md)

## Target ES6/ES2015

Modern browsers support all [ES6 features](https://caniuse.com/es6), so `es6/es2015` is the preferred choice. You might choose to set a lower target if your code is deployed to older environments, or a higher target if your code is guaranteed to run in newer environments.

## Filenames

Use dash on filenames, not `underscores`, not `camelCase`.

Example: Use `file-server.ts` instead of `file_server.ts` or `fileServer.ts`

## Tests

### Unit Testing

In unit testing each piece of your software is tested separately. Because of this each test file need to be moved/updated/remove accordingly, to easily do any change o see if a pice of code is missing those test save your files next to your tested file using the `.test.ts` extension. Example: for `src/module/create-campaign.ts` use `src/module/create-campaign.test.ts`

### Integration Testing

In integration testing all code of your software is tested combined. Because you are testing business logic it may not match your files, so save your files in the `test` directory and using `.spec.ts` extension. Example: for test the entire flow of a campaign use `test/campaigns.spec.ts` (or similar)

## Formatting

All eslint related formatting application, its rules and the imports sort we use the [gatsby](https://github.com/decentraland/eslint-config/blob/main/gatsby.js) configuration inside the [dcl/eslint-config](https://github.com/decentraland/eslint-config) plugin.
Regarding the prettier related configuration we use [/.prettierrc](../../.prettierrc)

## Imports

Avoid imports from the root of any big library like `lodash` or `semantic-ui-react`

```ts
// GOOD
import unique 'lodash/unique'
```

```ts
// BAD
import { unique } 'lodash'
```

## Exports: Types, Classes and Interfaces

- Use `PascalCase` for type names.
- Do not use `I` as a prefix for interface names.
- Do not use `T` as a prefix for type names.
- Use `PascalCase` for enum values.
- Use `camelCase` for function names.
- Use `camelCase` for property names and local variables.
- Do not use `_` as a prefix for private properties.
- Use whole words in names when possible.

Use `interface` for all things that should be a `classes` but don't have an implementations.

```ts
interface Storage<T> {
  get(name: string): T | null
  set(name: string, T)
}

class LocalStorage<T> implements Storage<T> {
  get(name: string): T | null {
    /* ... */
  }
  set(name: string, T) {
    /* ... */
  }
}

class RemoteStorage<T> implements Storage<T> {
  get(name: string): T | null {
    /* ... */
  }
  set(name: string, T) {
    /* ... */
  }
}
```

Remember, you can `extends` and `implements` from any class (`Map` and `Set` are examples)

```ts
class Box {
  volume: 0
}

class EmptyBox extends Box {}

class BigBox implements Box {
  volume: 10
}

const box: Box = new BigBox()
```

Any other definition is preferred as `type`

## Exports: Named vs default export

Exports are communicating intensions, use `export default` only if the code inside a file has only one main objective export any other related export as named.

> Hint: if your file has the same name that your named export that should probably exported as default

Example:

```ts
// GOOD
import env, {
  stringEnv,
  numberEnv,
  EnvOptionsType,
  CONSTANT_VARIABLE,
} from 'utils/env'
```

```ts
// PROBABLY NOT
import { env } from 'utils/env'
```

### Functions: max 2 args, put the rest into an options object

When designing function interfaces, stick to the following rules.

1. A function that is part of the public API takes 0-2 required arguments, plus (if necessary) an options object (so max 3 total).

2. Optional parameters should generally go into the options object. An optional parameter that's not in an options object might be acceptable if there is only one, and it seems inconceivable that we would add more optional parameters in the future.

3. The `options` argument is the only argument that is a regular `Object`. Other arguments can be objects, but they must be distinguishable from a 'plain' Object runtime, by having either:

- a distinguishing prototype (e.g. `Array`, `Map`, `Date`, `class MyThing`).
- a well-known symbol property (e.g. an iterable with `Symbol.iterator`).

This allows the API to evolve in a backwards compatible way, even when the position of the options object changes.

```ts
// BAD: optional parameters not part of options object. (#2)
export function resolve(
  hostname: string,
  family?: 'ipv4' | 'ipv6',
  timeout?: number
): IPAddress[] {}
```

```ts
// GOOD.
export interface ResolveOptions {
  family?: 'ipv4' | 'ipv6'
  timeout?: number
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {}
): IPAddress[] {}
```

```ts
export interface Environment {
  [key: string]: string
}

// BAD: `env` could be a regular Object and is therefore indistinguishable
// from an options object. (#3)
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// GOOD.
export interface RunShellOptions {
  env: Environment
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions
): string {}
```

```ts
// BAD: more than 3 arguments (#1), multiple optional parameters (#2).
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean
) {}
```

```ts
// GOOD.
interface RenameOptions {
  replaceExisting?: boolean
  followLinks?: boolean
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {}
) {}
```

```ts
// BAD: too many arguments. (#1)
export function pwrite(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
  position: number
) {}
```

```ts
// BETTER.
export interface PWrite {
  fd: number
  buffer: ArrayBuffer
  offset: number
  length: number
  position: number
}
export function pwrite(options: PWrite) {}
```

## Top-level functions should not use arrow syntax

Top-level functions should use the `function` keyword. Arrow syntax should be limited to closures.

```ts
//GOOD
export function foo(): string {
  return 'bar'
}
```

```ts
// BAD
export const foo = (): string => {
  return 'bar'
}
```

## Use JSDoc for exported symbols

We strive for complete documentation. Every exported symbol ideally should have a documentation line.

If possible, use a single line for the JSDoc. Example:

```ts
/** foo does bar. */
export function foo() {
  // ...
}
```

It is important that documentation is easily human-readable, but there is also a need to provide additional styling information to ensure generated documentation is more rich text. Therefore JSDoc should generally follow markdown markup to enrich the text.

While markdown supports HTML tags, it is forbidden in JSDoc blocks.

Code string literals should be braced with the back-tick (\`) instead of quotes. For example:

```ts
/** Import something from the `deno` module. */
```

Do not document function arguments unless they are non-obvious of their intent (though if they are non-obvious intent, the API should be considered anyways). Therefore `@param` should generally not be used. If `@param` is used, it should not include the type as TypeScript is already strongly-typed.

```ts
/**
 * Function with non-obvious param.
 * @param foo Description of non-obvious parameter.
 */
```

Vertical spacing should be minimized whenever possible. Therefore, single-line comments should be written as:

```ts
// GOOD.
/** This is a good single-line JSDoc. */
```

And not:

```ts
// BAD.
/**
 * This is a bad single-line JSDoc.
 */
```

Code examples should utilize markdown format and the `@example` tag, like so:

````ts
/**
 * @example: A straightforward comment and an example:
 *
 * ```ts
 * import { foo } from "deno";
 * foo("bar");
 * ```
 */
````

Code examples should not contain additional comments and must not be indented. It is already inside a comment. If it needs further comments, it is not a good example.

[reference](https://deno.land/manual/contributing/style_guide#use-jsdoc-for-exported-symbols)

## TODO Comments

TODO comments should usually include an issue or the author's github username in parentheses. Example:

```ts
// TODO(ry): Add tests.
// TODO(#123): Support Windows.
// FIXME(#349): Sometimes panics.
```

[reference](https://deno.land/manual/contributing/style_guide#todo-comments)

> Note: if you need to change code to normalized across the project please an issue for that and add a comment whenever you need to change

## Prefer `#` over `private`

We prefer the private fields (`#`) syntax over `private` keyword of TypeScript in the standard modules codebase. The private fields make the properties and methods private even at runtime. On the other hand, `private` keyword of TypeScript guarantee it private only at compile time and the fields are publicly accessible at runtime ([Reference](https://deno.land/manual/contributing/style_guide#prefer--over-private)).

```ts
// GOOD.
class MyClass {
  #foo = 1
  #bar() {}
}
```

```ts
// BAD
class MyClass {
  private foo = 1
  private bar() {}
}
```

If you have `es5` as target `#` props are not supported, in that case use `private` and `_` to conform with other javascript guidelines.

```ts
// GOOD (ONLY ON ES5 OR BELLOW)
class MyClass {
  private _foo = 1
  private _bar() {}
}
```
