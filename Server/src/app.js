import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';
import { NotFoundError } from './utils/errors.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logger
app.use(logger);

// Parse JSON request bodies
app.use(express.json());

// Main API Router
app.use('/api', apiRouter);

// Fallback Route for non-existent endpoints
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot find ${req.method} ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);

export default app;
