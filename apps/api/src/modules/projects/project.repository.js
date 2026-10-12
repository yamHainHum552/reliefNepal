import { sampleProjects } from './project.constants.js';

export const projectRepository = {
  findPublished() {
    return sampleProjects.filter((project) => project.publicationStatus === 'published');
  },
  findPublishedBySlug(slug) {
    return this.findPublished().find((project) => project.slug === slug) || null;
  },
};
