import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    isProduction
      ? path.join(__dirname, '../models/**/*.js')
      : 'src/models/**/*.ts',
  ],
  migrations: [
    isProduction
      ? path.join(__dirname, '../migrations/**/*.js')
      : 'src/migrations/**/*.ts',
  ],
  subscribers: [],
});
