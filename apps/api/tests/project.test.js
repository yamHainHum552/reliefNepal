import test from 'node:test';
import assert from 'node:assert/strict';
import { projectService } from '../src/modules/projects/project.service.js';

test('sample project endpoint service exposes only published projects', () => {
  assert.deepEqual(projectService.list().map((project) => project.slug), ['sample-community-project']);
});
