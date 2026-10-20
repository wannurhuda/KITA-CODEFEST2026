import { getDict } from '@/lib/i18n/server';
import { getStats } from '@/lib/stats';

export const dynamic = 'force-dynamic';

export default async function Impact() {
  const d = getDict();
  const s = await getStats();
  const rate = s && s.verified_requests > 0 ? Math.round((s.fulfilled_requests / s.verified_requests) * 100) : 0;
  const kpis = [
    [d.impact.k1, s?.verified_requests ?? 0], [d.impact.k2, s?.fulfilled_requests ?? 0], [d.impact.k3, `${rate}%`],
    [d.impact.k4, s?.items_redistributed ?? 0], [d.impact.k5, s?.deliveries_completed ?? 0], [d.impact.k6, s?.active_volunteers ?? 0],
    [d.impact.k7, s?.avg_hours_to_match ?? '-']
  ];
  const max = Math.max(1, ...(s?.by_category ?? []).map((c) => Number(c.items)));
  return (
    <div className="wrap py-8">
      <h1 className="h1">{d.impact.title}</h1>
      <p className="muted">{d.impact.sub}</p>
      <div className="my-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(([l, v]) => (
          <div key={String(l)} className="card"><b className="block text-3xl">{v}</b><span className="muted text-sm">{l}</span></div>
        ))}
      </div>
      <section className="card">
        <h2 className="h2 mb-3">{d.impact.byCat}</h2>
        {!s || s.by_category.length === 0 ? (
          <p className="muted">{d.impact.noData}</p>
        ) : (
          s.by_category.map((c) => (
            <div key={c.category} className="mb-3">
              <div className="mb-1 flex justify-between text-sm"><span>{d.cat[c.category as keyof typeof d.cat]}</span><b>{c.items}</b></div>
              <div className="h-2.5 overflow-hidden rounded bg-brand-100"><div className="h-full bg-brand-600" style={{ width: `${(Number(c.items) / max) * 100}%` }} /></div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
