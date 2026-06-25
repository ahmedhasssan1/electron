
import { ProjectRepository } from '../repositories/project.repository';
import { TaskRepository } from '../repositories/task.repository';
import { UserRepository } from '../repositories/user.repository';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

const projectRepo = new ProjectRepository();
const taskRepo = new TaskRepository();
const userRepo = new UserRepository();

export const projectService = new ProjectService(projectRepo);
export const taskService = new TaskService(taskRepo);
export const userService = new UserService(userRepo);
export const authService = new AuthService(userService);
