import 'dotenv/config';

const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigins: origins,
  // Accept Next-style names for setups that share a public Supabase project
  // URL/key across app env files. These values are still read only by Node here.
  supabaseUrl:
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabasePublishableKey:
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  get cloudinaryConfigured() {
    return Boolean(
      this.cloudinaryCloudName &&
      this.cloudinaryApiKey &&
      this.cloudinaryApiSecret,
    );
  },
  get supabaseConfigured() {
    return Boolean(this.supabaseUrl && this.supabasePublishableKey);
  },
};
