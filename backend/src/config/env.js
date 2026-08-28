const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://arombcgsuazmiqjuxlsf.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable__0YMrHM9rb0MF3YttjogGQ_l971pYuy';

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  SUPABASE_URL: supabaseUrl,
  SUPABASE_KEY: supabaseKey,
  SUPABASE_ANON_KEY: supabaseKey,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || supabaseKey,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || '',
  SUPABASE_JWKS_URL: process.env.SUPABASE_JWKS_URL || `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
  JWT_SECRET: process.env.JWT_SECRET || 'skillbridge_dev_secret_key_123',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
