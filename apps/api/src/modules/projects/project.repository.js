import { supabase } from '../../config/supabase.js';
import { projectColumns } from './project.constants.js';

function requireSupabase() {
  if (!supabase) {
    const error = new Error('Project data is temporarily unavailable');
    error.status = 503;
    error.code = 'DATA_SOURCE_UNAVAILABLE';
    throw error;
  }
}

function unavailableError() {
  const error = new Error('Project data is temporarily unavailable');
  error.status = 503;
  error.code = 'DATA_SOURCE_UNAVAILABLE';
  return error;
}

export const projectRepository = {
  async findPublished() {
    requireSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select(projectColumns)
      .eq('publication_status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase project query failed', {
        code: error.code,
        status: error.status,
        message: error.message,
      });
      throw unavailableError();
    }
    return data || [];
  },
  async findPublishedBySlug(slug) {
    requireSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select(projectColumns)
      .eq('publication_status', 'published')
      .eq('slug', slug)
      .maybeSingle();
    if (error) {
      console.warn('Supabase project query failed', {
        code: error.code,
        status: error.status,
        message: error.message,
      });
      throw unavailableError();
    }
    return data || null;
  },
};
