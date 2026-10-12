import { Router } from 'express';
import { projectController } from './project.controller.js';

export const projectRoutes = Router();
projectRoutes.get('/', projectController.list);
projectRoutes.get('/:slug', projectController.getBySlug);
