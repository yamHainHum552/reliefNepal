import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { projectRoutes } from './modules/projects/project.routes.js';
import { inquiryRoutes } from './modules/inquiries/inquiry.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';
import { contentRoutes } from './modules/content/content.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.frontendOrigins, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/api/v1', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false }));
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Please wait before submitting again.' } }),
});

app.get('/api/v1/health', (_req, res) => res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } }));
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1', contentRoutes);
app.use('/api/v1/inquiries', submissionLimiter, inquiryRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
