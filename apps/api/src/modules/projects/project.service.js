import { projectRepository } from './project.repository.js';

export const projectService = {
  list() {
    return projectRepository.findPublished();
  },
  getBySlug(slug) {
    return projectRepository.findPublishedBySlug(slug);
  },
};
