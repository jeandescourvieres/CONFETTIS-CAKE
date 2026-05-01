// ═══════════════════════════════════════════════════════════════════
//  insee-prenoms — Courbe de popularité INSEE pour un prénom
//  Retourne [{year, count}] pour un prénom donné depuis 1900
// ═══════════════════════════════════════════════════════════════════

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function normalize(s: string): string {
  return s.toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z\s-]/g, '')
    .trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name } = body;
    if (!name || typeof name !== 'string') {
      return new Response(JSON.stringify({ error: 'name requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const normalized = normalize(name);
    if (!normalized) {
      return new Response(JSON.stringify({ error: 'prénom invalide' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // API opendatasoft INSEE des prénoms
    const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/liste_des_prenoms/records?where=preusuel%3D%22${encodeURIComponent(normalized)}%22&group_by=annais&select=annais%2Cnombre&order_by=annais&limit=200&offset=0`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'ConfettiCake/1.0' },
    });

    if (!res.ok) {
      throw new Error(`INSEE API error: ${res.status}`);
    }

    const raw = await res.json();
    const records: Array<{ annais: string; nombre: number }> = raw.results ?? [];

    // Filtrer les années valides (numériques, >= 1900)
    const data = records
      .filter((r) => /^\d{4}$/.test(r.annais) && parseInt(r.annais) >= 1900)
      .map((r) => ({ year: parseInt(r.annais), count: r.nombre ?? 0 }))
      .sort((a, b) => a.year - b.year);

    // Si aucune donnée, essayons avec une variante (ex: prénom composé : JEAN-PIERRE → JEAN)
    if (data.length === 0) {
      return new Response(JSON.stringify({ data: [], total: 0, not_found: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const total = data.reduce((sum, d) => sum + d.count, 0);
    const peakYear = data.reduce((best, d) => (d.count > best.count ? d : best), data[0]);

    return new Response(JSON.stringify({ data, total, peak_year: peakYear.year, peak_count: peakYear.count }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('insee-prenoms error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
