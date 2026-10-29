import { Router } from 'express';
import { newsletterSubscriptionSchema } from '@relief-nepal/shared/schemas/project';
import { validateBody } from '../../middleware/validate.js';
import { inquiryController } from './inquiry.controller.js';

export const inquiryRoutes = Router();
inquiryRoutes.post(
  '/newsletter',
  validateBody(newsletterSubscriptionSchema),
  inquiryController.subscribeNewsletter,
);
