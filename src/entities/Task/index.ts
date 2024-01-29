import TaskManager from './TaskManager'
import './metrics'

export { taskInitializer } from './utils'
export { default as Task } from './Task'
export { TaskManager }

export default function manager() {
  return new TaskManager()
}
