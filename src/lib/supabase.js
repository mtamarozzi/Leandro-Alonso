import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Single-tenant (Fase A): workspace fixo do Leandro. Não é segredo — vai no bundle.
export const WORKSPACE_ID = import.meta.env.VITE_DORINDA_WORKSPACE_ID;

// Se as env vars não estiverem setadas (ex.: Vercel sem config), exporta null em vez de
// deixar o createClient lançar — assim o widget se auto-desativa sem derrubar o site.
export const supabase =
  url && anon
    ? createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
