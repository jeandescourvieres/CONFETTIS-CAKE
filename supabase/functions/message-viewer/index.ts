import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const id  = url.searchParams.get('id') ?? '';

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID manquant' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: msg } = await (supabase.from('messages') as any)
    .select('content, contact_name, bg_theme, font_style, font_size, is_italic, format')
    .eq('id', id)
    .single();

  if (!msg?.content) {
    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const recipient = msg.contact_name ? displayName(msg.contact_name) : null;

  return new Response(JSON.stringify({
    content:    msg.content,
    recipient,
    bg_theme:   msg.bg_theme   ?? 'none',
    font_style: msg.font_style ?? 'standard',
    font_size:  msg.font_size  ?? 'md',
    is_italic:  msg.is_italic  ?? false,
    format:     msg.format     ?? 'message',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
});

function displayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const firstNames = parts.filter((p) => !(p === p.toUpperCase() && /[A-Z]/.test(p)));
  return firstNames.join(' ') || parts[0] || name;
}
