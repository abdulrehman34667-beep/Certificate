const supabaseUrl = 'https://levjcxfmvvtcservhngh.supabase.co';
const supabaseKey = 'sb_publishable_6tc6HSB51vDM4hJc2CLEhA_RMsjHtWt';

const { createClient } = window.supabase;
window.supabaseClient = createClient(supabaseUrl, supabaseKey);
