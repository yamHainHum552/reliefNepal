import { z } from 'zod';
import { PROJECT_STATUSES } from '../constants/project.js';

export const projectSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  summary: z.string().max(500).optional(),
  status: z.enum(PROJECT_STATUSES),
});

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  subject: z.string().trim().max(180).optional().default(''),
  message: z.string().trim().min(10).max(5000),
  type: z.enum(['contact', 'partnership']).default('contact'),
  website: z.string().max(200).optional().default(''),
});

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(''),
});
