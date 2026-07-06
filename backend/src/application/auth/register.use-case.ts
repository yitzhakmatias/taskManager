const bcrypt = require("bcrypt");

import { IUserRepository } from "../../domain/user.repository.port";
import { User } from "../../domain/user.entity";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<Omit<User, "password">> {
    const { name, email, password } = input;

    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Default roleId = 1 (admin role created by seed)
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      roleId: 1,
    });

    const { password: _pw, ...safeUser } = user as any;
    return safeUser;
  }
}
