export type Name = false | undefined | null | string

export default function classname(names: Name[]) {
  return names.filter(Boolean).join(' ')
}