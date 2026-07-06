export interface Task {
  id: number;
  text: string;
  completed: boolean;
  userId?: number | null;
  createdAt: Date;
}

export interface CreateTaskInput {
  text: string;
  userId: number;
}

export interface UpdateTaskInput {
  text?: string;
  completed?: boolean;
}
