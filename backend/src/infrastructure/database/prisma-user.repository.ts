import { IUserRepository, CreateUserInput } from "../../domain/user.repository.port";
import { User } from "../../domain/user.entity";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: any) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      },
    });
  }
}
