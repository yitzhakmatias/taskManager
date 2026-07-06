import { ITaskRepository } from "../../domain/task.repository.port";
import { Task } from "../../domain/task.entity";

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: number): Promise<Task[]> {
    return this.taskRepository.findAll(userId);
  }
}
