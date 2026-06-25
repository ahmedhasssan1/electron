import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRoutes from './src/routes/user.routes';
import authRoutes from './src/routes/auth.routes';
import projectRoutes from './src/routes/project.routes';
import taskRoutes from './src/routes/task.routes';
import { authMiddleware } from './src/middleware/auth.middleware';
import { errorHandler } from './src/middleware/errorHandler';

const app = express();

// Security headers
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000'];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/auth', authLimiter);
app.use('/auth', authRoutes);
app.use(authMiddleware);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'api is running ' });
});

app.use(errorHandler);

export default app;
