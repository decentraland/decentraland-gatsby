# React Style Guide

> This guide is intended to be apply on `.tsx` files, for typescript files (`.ts`) read [./typescript.md](./typescript.md)

## Filenames

Use `PascalCase` for filenames. Example: Use `MyComponent.tsx`

## Tests

// TODO(2fd)

## Formatting

All formatting enforce are defined on [`/.eslintrc.js`](../../.eslintrc.js) and [/.prettierrc](../../.prettierrc), but as summary:

### Use `camelCase` for prop names, or `PascalCase` if the prop value is a React component

```ts
// GOOD
<Foo userName="hello" phoneNumber={12345678} Component={SomeComponent} />
```

```ts
// BAD
<Foo UserName="hello" phone_number={12345678} />
```

### Omit the value of the prop when it is explicitly true

```ts
// VERY GOOD
<Foo hidden />
```

```ts
// GOOD
<Foo hidden />
```

```ts
// BAD
<Foo hidden={true} />
```

## Exports

Keep all your definitions that can't be detached in the same file and keep all the internal definition private it makes it ease to manage. Example: a `Button` component and its `ButtonProps`.

```tsx
type ButtonState = {
  /* ... */
} // private
export type ButtonProps = {
  /* ... */
}
export default function Button(props: ButtonProps) {
  const [state, setState] = useState<ButtonState>({})
  // ...
}
```

Keep name uniques and predictable, that way you don't need to remember the state of your project the autocompletion will handle all the work. Example: `ButtonProps` is preferred over `Props` and `ButtonState` is preferred over `State` even if your state is private

```ts
// GOOD
type ButtonState = {
  /* ... */
}
export type ButtonProps = {
  /* ... */
}
```

```ts
// BAD
type State = {
  /* ... */
}
export type Props = {
  /* ... */
}
```

Exports are communicating intensions, use `export default` only if your component is clearly the main object on that path.

```txt
components/
  |--->Button
  |      |--->index.ts      <--- Button is the main component can be exported as default
  |      |--->Button
  |      |--->ButtonGroup
  |
  |--->Table
  |      |--->index.ts      <--- Table is the main component can be exported as default
  |      |--->Table
  |      |--->TableCell
  |      |--->TableRow
  |
  |--->Grid
         |--->index.ts      <--- Grid is the main component can be exported as default
         |--->Grid
         |--->GridRow
         |--->GridColumn
```

Use `namespace` export to denote that the Design or/and behaviour are not guaranteed if it render outside the parent component

```tsx
import GridRow from './GridRow'
import GridColumn from './GridColumn'

export default function Grid(){ /* ... */ }
export default namespace Grid {
  export const Row = GridRow;
  export const Column = GridColumn;
}
```

```tsx
import Grid from '~/Grid'

/** This way user should expect a correct behaviour */
<Grid>
  <Grid.Row>
  </Grid.Row>
</Grid>

/** Grid.Row behavior may not be the expected outside the Gird component */
<Grid.Row></Grid.Row>
```

Usually you will need one component per file but breaking some components into multiples can help you to organize your code, if this is your case and it doesn't make sense to have multiples files just keep them together

```tsx
import { Label } from '...'

export default UserLabels(props: { user: User }) {
  switch (props.user.type) {
    case UserType.ADMIN:
      return <UserAdminLabels />
    case UserType.MANAGER:
      return <UserManagerLabels />
    default:
      return <UserRegularLabels />
  }
}

function UserAdminLabels(props: { user: User }) {
  return <>
    <Label color="red">ADMIN</Label>
    {/* ... */}
  </>
}

function UserManagerLabels(props: { user: User }) {
  return <>
    <Label color="blue">MANAGER</Label>
    {/* ... */}
  </>
}

function UserRegularLabels(props: { user: User }) {
  return <>
    <Label color="grey">USER</Label>
    {/* ... */}
  </>
}
```
