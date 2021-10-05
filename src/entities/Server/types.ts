export type ServiceStopHandler = () => Promise<any>
export type ServiceStartHandler = () => Promise<ServiceStopHandler>

export function emptyServiceInitializer(): ServiceStartHandler {
  return async () => {
    return async () => {}
  }
}
