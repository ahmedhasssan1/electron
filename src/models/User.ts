import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './Project';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  //since its memeber and admin only we can user this appreach
  // if it will be scalable it we will be many to many thow a junction table
  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];
}
