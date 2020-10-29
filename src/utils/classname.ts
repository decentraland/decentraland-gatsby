// TODO v3: Move react directory
export type Name = false | undefined | null | 0 | string

export default function classname(names: Name[]) {
  return names.filter(Boolean).join(' ')
}