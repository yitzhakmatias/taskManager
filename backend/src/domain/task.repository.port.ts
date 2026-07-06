import { Task, CreateTaskInput, UpdateTaskInput } from "./task.entity";

export interface ITaskRepository {
  findAll(userId: number): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: number, input: UpdateTaskInput): Promise<Task>;
  delete(id: number): Promise<void>;
}
