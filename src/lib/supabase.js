// B&L Motorcycles Ltd - Supabase Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kenaardqwnpeqtwukdnb.supabase.co'
const supabaseAnonKey = 'sb_publishable_mb0qosHmAj-bugknMGWp0w_HdYFJhTr'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

export default supabase

