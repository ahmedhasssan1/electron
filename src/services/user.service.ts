import { AppDataSource } from '../config/database';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { User } from '../models/User';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);
const SALT_ROUNDS = 10;

export const userService = {
  async findAll(params: PaginationParams): Promise<PaginatedResult<User>> {
    const [data, total] = await userRepository.findAndCount({
      order: { [params.sortBy]: params.sortOrder },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    });

    const totalPages = Math.ceil(total / params.limit);

    return {
      data,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
      },
    };
  },

  async findById(id: number): Promise<User | null> {
    return userRepository.findOneBy({ id });
  },

  async findByEmail(email: string): Promise<User | null> {
    return userRepository.findOneBy({ email });
  },

  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return userRepository.save(user);
  },

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const user = await userRepository.findOneBy({ id });
    if (!user) return null;

    userRepository.merge(user, data);
    return userRepository.save(user);
  },

  async delete(id: number): Promise<boolean> {
    const result = await userRepository.delete(id);
    return result.affected !== 0;
  },
};
