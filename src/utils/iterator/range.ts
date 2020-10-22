export default function* range(from: number, to: number, diff: number = 1) {

  diff = Math.abs(diff)

  if (diff === 0) {
    throw new Error(`inc param should be different than 0`)
  }

  if (from <= to) {
    for (let current = from; current < to; current = current + diff) {
      yield current
    }
  } else {
    for (let current = from; current > to; current = current - diff) {
      yield current
    }
  }
}