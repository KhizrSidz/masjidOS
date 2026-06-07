// src/lib/supabase.js
//
// If VITE_SUPABASE_URL is set in .env, we connect to a real Supabase project.
// If not, DEMO_MODE is true and the app uses mock data — no Supabase needed.
// This lets the project run immediately out of the box for portfolio demos.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const DEMO_MODE = !supabaseUrl || supabaseUrl.includes('your-project')

export const supabase = DEMO_MODE
  ? null
  : createClient(supabaseUrl, supabaseKey)
