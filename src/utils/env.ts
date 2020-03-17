export default function env(name: string, defaultValue: string): string {
  return process.env[name] || process.env['GATSBY_' + name] || process.env['REACT_APP_' + name] || process.env['STORYBOOK_' + name] || defaultValue
}