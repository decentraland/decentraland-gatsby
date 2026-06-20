// Node 18+ provides Request and the related fetch types natively, so these are
// re-exported from the global scope instead of from node-fetch.
export type RequestInit = globalThis.RequestInit
export type RequestInfo = globalThis.RequestInfo
export type Request = globalThis.Request
export const Request = globalThis.Request
