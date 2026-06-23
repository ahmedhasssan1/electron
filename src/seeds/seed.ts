import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import { Project, ProjectStatus } from '../models/Project';
import { Task, TaskStatus, TaskPriority } from '../models/Task';
import bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected for seeding...');

  // Clear existing data
  await AppDataSource.getRepository(Task).delete({});
  await AppDataSource.getRepository(Project).delete({});
  await AppDataSource.getRepository(User).delete({});

  // Seed Users
  const userRepo = AppDataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = userRepo.create({
    name: 'Ahmed',
    email: 'ahmed@example.com',
    password: hashedPassword,
  });
  const user2 = userRepo.create({
    name: 'Sara',
    email: 'sara@example.com',
    password: hashedPassword,
  });
  await userRepo.save([user1, user2]);
  console.log('Users seeded');

  // Seed Projects
  const projectRepo = AppDataSource.getRepository(Project);
  const project1 = projectRepo.create({
    title: 'Website Redesign',
    description: 'Redesign the company website',
    status: ProjectStatus.IN_PROGRESS,
  });
  const project2 = projectRepo.create({
    title: 'Mobile App',
    description: 'Build a cross-platform mobile app',
    status: ProjectStatus.TODO,
  });
  const project3 = projectRepo.create({
    title: 'API Documentation',
    description: 'Write API docs for v2',
    status: ProjectStatus.DONE,
  });
  await projectRepo.save([project1, project2, project3]);
  console.log('Projects seeded');

  // Seed Tasks
  const taskRepo = AppDataSource.getRepository(Task);
  const tasks = [
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
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      project: project1,
    }),
    taskRepo.create({
      title: 'User authentication',
      description: 'Login and registration flow',
      status: TaskStatus.TODO,
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
  ];
  await taskRepo.save(tasks);
  console.log('Tasks seeded');

  console.log('Seed completed!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
