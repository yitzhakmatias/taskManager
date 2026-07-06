import { ITaskRepository } from "../../domain/task.repository.port";
import { Task, CreateTaskInput, UpdateTaskInput } from "../../domain/task.entity";

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: any) {}

  async findAll(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async create(input: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({
      data: { text: input.text, userId: input.userId },
    });
  }

  async update(id: number, input: UpdateTaskInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(input.text !== undefined && { text: input.text }),
        ...(input.completed !== undefined && { completed: input.completed }),
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
