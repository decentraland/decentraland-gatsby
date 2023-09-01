// TODO(#323): remove on v6, use radash random instead https://radash-docs.vercel.app/docs/random-random
/** @deprecated use radash random instead https://radash-docs.vercel.app/docs/random-random */
function random(to: number): number
function random(from: number, to: number): number
function random(from = 0, to?: number): number {
  if (to === undefined) {
    to = from
    from = 0
  }

  const innerFrom = from < to ? from : to
  const innerTo = from < to ? to : from
  const order = from < to ? 1 : -1
  const value =
    Math.random() * Math.abs(Math.abs(innerTo) - Math.abs(innerFrom)) * order
  return from + (value > 0 ? Math.floor(value) : Math.ceil(value))
}

export default random
