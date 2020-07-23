import { useState } from 'react';

export default function useTimestamp() {
  const [state, setState] = useState(Date.now())
  return [state, () => setState(Date.now())] as const
}