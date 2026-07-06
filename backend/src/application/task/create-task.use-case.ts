import { ITaskRepository } from "../../domain/task.repository.port";
import { Task } from "../../domain/task.entity";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(text: string, userId: number): Promise<Task> {
    if (!text || text.trim() === "") {
      throw new Error("Text is required");
    }
    return this.taskRepository.create({ text: text.trim(), userId });
  }
}
