import test from 'node:test';
import assert from 'node:assert/strict';
import { contactInquirySchema, newsletterSubscriptionSchema } from '@relief-nepal/shared/schemas/project';

test('contact inquiries require valid contact details', () => {
  assert.equal(contactInquirySchema.safeParse({ name: 'A Person', email: 'person@example.org', message: 'Please contact me.' }).success, true);
  assert.equal(contactInquirySchema.safeParse({ name: 'A', email: 'not-an-email', message: 'short' }).success, false);
});

test('newsletter subscriptions require explicit consent', () => {
  assert.equal(newsletterSubscriptionSchema.safeParse({ email: 'person@example.org', consent: true }).success, true);
  assert.equal(newsletterSubscriptionSchema.safeParse({ email: 'person@example.org', consent: false }).success, false);
});
