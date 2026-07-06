import { ITaskRepository } from "../../domain/task.repository.port";
import { Task, UpdateTaskInput } from "../../domain/task.entity";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number, input: UpdateTaskInput): Promise<Task> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new Error("Task not found");
    }
    return this.taskRepository.update(id, input);
  }
}
