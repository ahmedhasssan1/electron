import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/user.routes';
import authRoutes from './src/routes/auth.routes';
import projectRoutes from './src/routes/project.routes';
import taskRoutes from './src/routes/task.routes';
import { authMiddleware } from './src/middleware/auth.middleware';
import { errorHandler } from './src/middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use(authMiddleware);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'api is running ' });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
