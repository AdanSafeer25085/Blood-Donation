// Single shared Supabase client for the whole app.
//
// Credentials come from environment variables so no keys are committed.
// Create a file `my-app/.env` (copy `.env.example`) with:
//   REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
//   REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
// then restart `npm start` (CRA only reads env vars at startup).
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in dev so a missing .env is obvious.
  // eslint-disable-next-line no-console
  console.error(
    'Missing Supabase env vars. Add REACT_APP_SUPABASE_URL and ' +
      'REACT_APP_SUPABASE_ANON_KEY to my-app/.env and restart the dev server.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default supabase;
