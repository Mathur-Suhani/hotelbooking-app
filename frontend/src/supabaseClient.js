import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "https://vcriyjwbtkubjamzgdht.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcml5andidGt1YmphbXpnZGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDE1NDEsImV4cCI6MjA4NjI3NzU0MX0.H4sXlRZ0qesqtHSp9k-CL_8OBgYZQexTU4-IvZFc0Xo"
);