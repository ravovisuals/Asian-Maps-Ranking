// Trage hier deine echten Werte aus Supabase ein:
// Project Settings -> API -> Project URL / anon public key
const SUPABASE_URL = "https://ucejclktjhbtjjrsgkno.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZWpjbGt0amhidGpqcnNna25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDUwNDUsImV4cCI6MjEwMDQ4MTA0NX0.jZWVB2sIStX1DqKhJvB92MQVEKDkuv-5pmietPfMaS4";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
