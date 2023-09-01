// TODO(#323): remove on v6, use radash range instead https://radash-docs.vercel.app/docs/curry-range
/** @deprecated use radash range instead https://radash-docs.vercel.app/docs/curry-range */
export default function* range(from: number, to: number, diff = 1) {
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
