import { supabase } from '../../config/supabase.js';

function requireSupabase() {
  if (!supabase) {
    const error = new Error('Submission service is not configured');
    error.status = 503;
    error.code = 'SUBMISSION_SERVICE_UNAVAILABLE';
    throw error;
  }
}

function unavailableError() {
  const error = new Error('Submission service is temporarily unavailable');
  error.status = 503;
  error.code = 'SUBMISSION_SERVICE_UNAVAILABLE';
  return error;
}

export const inquiryRepository = {
  async createNewsletterSubscription(subscription) {
    requireSupabase();
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .upsert(
        { email: subscription.email, consented_at: new Date().toISOString() },
        { onConflict: 'email', ignoreDuplicates: true },
      );
    if (error) {
      console.warn('Supabase newsletter insert failed', {
        code: error.code,
        status: error.status,
        message: error.message,
      });
      throw unavailableError();
    }
  },
};
