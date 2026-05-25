import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Single-tenant (Fase A): workspace fixo do Leandro. Não é segredo — vai no bundle.
export const WORKSPACE_ID = import.meta.env.VITE_DORINDA_WORKSPACE_ID;

// persistSession:false — visitante anônimo, sem login. Identidade via visitor_id no localStorage.
export const supabase = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
});
