export type ServiceStopHandler = () => Promise<any>
export type ServiceStartHandler = () => Promise<ServiceStopHandler>
