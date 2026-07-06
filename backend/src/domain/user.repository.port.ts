import { User } from "./user.entity";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
}
