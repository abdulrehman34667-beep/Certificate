const supabaseUrl = 'PASTE_YOUR_PROJECT_URL';
const supabaseKey = 'PASTE_YOUR_ANON_PUBLIC_KEY';

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);