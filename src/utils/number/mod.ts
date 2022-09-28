export default function mod(dividend: number, divisor: number): number {
  const result = dividend % divisor
  if (result < 0) {
    return divisor + result
  }
  return result
}
