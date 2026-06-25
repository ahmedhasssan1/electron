import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../models/User';
import { Project, ProjectStatus } from '../models/Project';
import { Task, TaskStatus, TaskPriority } from '../models/Task';
import bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected for seeding...');

  await AppDataSource.query('TRUNCATE TABLE "tasks" RESTART IDENTITY CASCADE');
  await AppDataSource.query(
    'TRUNCATE TABLE "projects" RESTART IDENTITY CASCADE',
  );
  await AppDataSource.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
  console.log('Tables cleared');

  const userRepo = AppDataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('password123', 10);

  const [user1, user2] = await userRepo.save([
    userRepo.create({
      name: 'Ahmed',
      email: 'ahmed@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    }),
    userRepo.create({
      name: 'Sara',
      email: 'sara@example.com',
      password: hashedPassword,
    }),
  ]);
  console.log('Users seeded');

  const projectRepo = AppDataSource.getRepository(Project);

  const [project1, project2, project3] = await projectRepo.save([
    projectRepo.create({
      title: 'Website Redesign',
      description: 'Redesign the company website',
      status: ProjectStatus.IN_PROGRESS,
      user: user1,
    }),
    projectRepo.create({
      title: 'Mobile App',
      description: 'Build a cross-platform mobile app',
      status: ProjectStatus.TODO,
      user: user1,
    }),
    projectRepo.create({
      title: 'API Documentation',
      description: 'Write API docs for v2',
      status: ProjectStatus.DONE,
      user: user2,
    }),
  ]);
  console.log('Projects seeded');

  const taskRepo = AppDataSource.getRepository(Task);

  await taskRepo.save([
    taskRepo.create({
      title: 'Design homepage mockup',
      description: 'Figma mockup for new homepage',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      project: project1,
      dueDate: '2026-07-01',
    }),
    taskRepo.create({
      title: 'Implement navigation',
      description: 'Build responsive nav bar',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      project: project1,
      dueDate: '2026-07-05',
    }),
    taskRepo.create({
      title: 'Setup CI/CD',
      description: 'Configure GitHub Actions',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      project: project1,
    }),
    taskRepo.create({
      title: 'User authentication',
      description: 'Login and registration flow',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      project: project2,
      dueDate: '2026-07-15',
    }),
    taskRepo.create({
      title: 'Push notifications',
      description: 'Firebase push notifications',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      project: project2,
    }),
    taskRepo.create({
      title: 'Review API docs',
      description: 'Proofread all endpoints',
      status: TaskStatus.DONE,
      priority: TaskPriority.LOW,
      project: project3,
      dueDate: '2026-06-20',
    }),
  ]);
  console.log('Tasks seeded');

  console.log(' Seed completed!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
