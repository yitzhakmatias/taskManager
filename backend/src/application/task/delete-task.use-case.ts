import { ITaskRepository } from "../../domain/task.repository.port";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new Error("Task not found");
    }
    return this.taskRepository.delete(id);
  }
}
