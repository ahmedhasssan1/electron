import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

export { AppDataSource };

export const connectDatabase = async (): Promise<DataSource> => {
  try {
    await AppDataSource.initialize();
    return AppDataSource;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
