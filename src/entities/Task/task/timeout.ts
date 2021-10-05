import TaskModel from '../model'
import { Task } from '../Task'

export default new Task({
  name: 'task_release_timeout',
  repeat: Task.Repeat.Each10Minutes,
  task: async () => {
    await TaskModel.releaseTimeout()
  },
})
