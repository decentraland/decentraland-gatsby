// TODO(#323): remove on v6 move it to ./entities/Development
export default function env(name: string, defaultValue: string): string {
  return (
    process.env[name] ||
    process.env['GATSBY_' + name] ||
    process.env['REACT_APP_' + name] ||
    process.env['STORYBOOK_' + name] ||
    defaultValue
  )
}

export function requiredEnv(name: string): string {
  const value = env(name, '')

  if (!value) {
    throw new Error(
      `Missing "${name}" environment variable. Check your .env.example file`
    )
  }

  return value
}
