export default function toObject (err?: Error | null) {
  if (!err) {
    return err
  }

  const { message, stack, ...extra } = err
  return { message, stack, ...extra }
}