import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aslcgawrrbolhpfvkzqb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbGNnYXdycmJvbGhwZnZrenFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDU4MzYsImV4cCI6MjA5MzI4MTgzNn0.IzmRB7I2RKCb130DTPUTMDmr-8PqmdrDrq-8zPANa2A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
