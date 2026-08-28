const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

let supabase = null;

const keyToUse = env.SUPABASE_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;

if (env.SUPABASE_URL && keyToUse) {
  try {
    supabase = createClient(env.SUPABASE_URL, keyToUse);
    console.log('[Supabase] Initialized Supabase PostgreSQL Client successfully at:', env.SUPABASE_URL);
  } catch (err) {
    console.warn('[Supabase] Warning: Supabase client initialization failed:', err.message);
  }
} else {
  console.log('[Supabase] Running without live Supabase keys. Fallback memory/mock mode active for local dev.');
}

module.exports = supabase;
