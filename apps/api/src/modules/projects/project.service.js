import { projectRepository } from './project.repository.js';

export const projectService = {
  async list() {
    return projectRepository.findPublished();
  },
  async getBySlug(slug) {
    return projectRepository.findPublishedBySlug(slug);
  },
};
