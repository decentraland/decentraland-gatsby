export default function pad(
  value: number,
  prefixLength: number = 0,
  decimalLength: number = 0
) {
  let n = Number(value)
  if (Number.isNaN(n)) {
    return 'NaN'
  }

  let fixed = n.toFixed(decimalLength)
  if (fixed === '-0') {
    fixed = '0'
  }

  const [, sig, num, decimals] = fixed.match(/^(\-)?(\d+)(\.\d+)?$/)!
  const padLength = Math.max(prefixLength - num.length, 0)
  const pad = '0'.repeat(padLength)
  return [sig || '', pad, num, decimals].join('')
}
