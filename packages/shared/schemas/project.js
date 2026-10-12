import { z } from 'zod';
import { PROJECT_STATUSES } from '../constants/project.js';

export const projectSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  summary: z.string().max(500).optional(),
  status: z.enum(PROJECT_STATUSES),
});
