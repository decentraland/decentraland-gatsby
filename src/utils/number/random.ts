
export default function random(to: number): number;
export default function random(from: number, to: number): number;
export default function random(from: number = 0, to?: number): number {
  if (to === undefined) {
    to = from
    from = 0
  }

  const innerFrom = from < to ? from : to
  const innerTo = from < to ? to : from
  const order = from < to ? 1 : -1
  const value = Math.random() * Math.abs(Math.abs(innerTo) - Math.abs(innerFrom)) * order
  return from + (value > 0 ? Math.floor(value) : Math.ceil(value))
}