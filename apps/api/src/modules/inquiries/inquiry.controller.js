import { inquiryRepository } from './inquiry.repository.js';

export const inquiryController = {
  async subscribeNewsletter(req, res, next) {
    try {
      const subscription = req.validatedBody;
      if (!subscription.website)
        await inquiryRepository.createNewsletterSubscription(subscription);
      return res.status(201).json({ data: { accepted: true } });
    } catch (error) {
      return next(error);
    }
  },
};
