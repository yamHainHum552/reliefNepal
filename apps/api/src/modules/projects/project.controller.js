import { projectService } from './project.service.js';

export const projectController = {
  list(_req, res) {
    res.json({ data: projectService.list() });
  },
  getBySlug(req, res) {
    const project = projectService.getBySlug(req.params.slug);
    if (!project) return res.status(404).json({ error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' } });
    return res.json({ data: project });
  },
};
