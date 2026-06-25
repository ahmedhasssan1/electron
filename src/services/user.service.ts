import { IUserRepository } from '../repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user';
import { User } from '../models/User';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<User>> {
    return this.userRepo.findAll({}, params);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    return this.userRepo.create({
      ...data,
      password: hashedPassword,
    } as Partial<User>);
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    return this.userRepo.update(id, data as Partial<User>);
  }

  async delete(id: number): Promise<boolean> {
    return this.userRepo.delete(id);
  }

  async updateRefreshToken(
    userId: number,
    token: string | null,
  ): Promise<void> {
    await this.userRepo.updateRefreshToken(userId, token);
  }
}
