const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

import { IUserRepository } from "../../domain/user.repository.port";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  message: string;
  token: string;
}

export class LoginUseCase {
  private readonly jwtSecret: string;

  constructor(private readonly userRepository: IUserRepository) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined in environment");
    this.jwtSecret = secret;
  }

  async execute(input: LoginInput): Promise<LoginResult> {
    const { email, password } = input;

    // Query real user from DB
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // bcrypt: compare the plain password against the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Sign JWT with userId only
    const token = jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: "1h" }
    );

    return { message: "Login successful", token };
  }
}
