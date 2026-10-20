import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getDict, getLocale } from '@/lib/i18n/server';
import { fmt } from '@/lib/i18n/dict';
import { approveMatch } from '@/actions/admin';
import { suggestMatch, type MatchResource, type MatchVolunteer } from '@/lib/matching';
import { Flash } from '@/components/Flash';
import { fmtDate } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function ReviewMatch({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  const d = getDict();
  const locale = getLocale();
  await requireRole('admin');
  const sb = createClient();

  const { data: req } = await sb.from('requests').select('*, organizations(name)').eq('id', params.id).maybeSingle();
  if (!req) notFound();
  const [{ data: resources }, { data: vols }] = await Promise.all([
    sb.from('resources').select('*, profiles(full_name)'),
    sb.from('volunteers').select('*, profiles(full_name)')
  ]);

  const resList: MatchResource[] = (resources ?? []).map((r: any) => ({ ...r, donor_label: r.profiles?.full_name }));
  const volList: MatchVolunteer[] = (vols ?? []).map((v: any) => ({ ...v, name: v.profiles?.full_name }));
  const p = suggestMatch(
    { id: req.id, category: req.category, quantity: req.quantity, needed_by: req.needed_by, urgency: req.urgency, lat: req.lat, lng: req.lng },
    resList,
    volList
  );

  const checkText = (c: { code: string; ok: boolean; data?: Record<string, string | number> }) => {
    const key = c.code === 'quantity' ? (c.ok ? 'quantity_ok' : 'quantity_no')
      : c.code === 'distance' ? (c.ok ? 'distance_ok' : 'distance_no')
      : c.code === 'transport' ? (c.ok ? 'transport_ok' : 'transport_no')
      : c.code;
    const data = { ...(c.data ?? {}) } as Record<string, string | number>;
    if (c.code === 'category') data.category = d.cat[req.category as keyof typeof d.cat];
    if (c.code === 'transport') data.vehicle = d.volunteer.vehicles[String(data.vehicle) as keyof typeof d.volunteer.vehicles] ?? String(data.vehicle);
    return fmt((d.checks as Record<string, string>)[key] ?? key, data);
  };

  return (
    <div className="wrap py-8">
      <Link href="/admin" className="muted text-sm">← {d.admin.backToList}</Link>
      <h1 className="h1 mt-2">{d.admin.reviewTitle}</h1>
      <div className="mt-3"><Flash error={searchParams.error} /></div>

      <section className="card">
        <h2 className="h2">{d.admin.request}</h2>
        <p className="mt-1 font-semibold">{req.title}</p>
        <p className="muted text-sm">
          {(req as any).organizations?.name} · 📦 {req.quantity} · {d.cat[req.category as keyof typeof d.cat]} · {d.urg[req.urgency as 1 | 2 | 3]} · {d.common.neededBy} {fmtDate(req.needed_by, locale)} · 📍 {req.area}
        </p>
      </section>

      <section className="card mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="h2">{d.admin.allocation}</h2>
          <span className="pill bg-brand-100 text-brand-800">{d.admin.score}: {p.score}/100</span>
        </div>
        {p.parts.length === 0 ? (
          <p className="muted mt-2">{d.common.none}</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="muted border-b border-[#e0e7de]"><th className="py-2">{d.admin.donorCol}</th><th>{d.admin.itemCol}</th><th>{d.admin.takeCol}</th><th>{d.admin.distCol}</th></tr></thead>
              <tbody>
                {p.parts.map((x) => (
                  <tr key={x.resource.id} className="border-b border-[#eef2ec]">
                    <td className="py-2">{x.resource.donor_label ?? '-'}</td>
                    <td>{x.resource.title}</td>
                    <td className="font-bold">{x.take}</td>
                    <td>{x.distKm.toFixed(1)} {d.common.km}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-sm">
          <b>{d.admin.transport}:</b>{' '}
          {p.volunteer ? `${p.volunteer.name ?? '-'} (${d.volunteer.vehicles[p.volunteer.vehicle as keyof typeof d.volunteer.vehicles] ?? p.volunteer.vehicle}, ${p.volunteer.capacity})` : '-'}
        </p>
      </section>

      <section className="card mt-4">
        <h2 className="h2">{d.admin.checks}</h2>
        <ul className="mt-2 space-y-1.5 text-sm">
          {p.checks.map((c, i) => (
            <li key={i}>{c.ok ? '✅' : '❌'} {checkText(c)}</li>
          ))}
        </ul>
        {p.rejected.length > 0 && (
          <>
            <h3 className="mt-4 font-bold">{d.admin.rejectedTitle}</h3>
            <ul className="muted mt-1 space-y-1 text-sm">
              {p.rejected.map((r) => (
                <li key={r.resource.id}>⚠️ {r.resource.donor_label ?? '-'} · {r.resource.title}: {d.reject[r.reason]}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="mt-5">
        {p.feasible && req.status === 'open' ? (
          <form action={approveMatch} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="request_id" value={req.id} />
            <SubmitButton>{d.common.approve}</SubmitButton>
            <Link href="/admin" className="btn-outline">{d.common.cancel}</Link>
            <span className="muted text-xs">{d.admin.approveHint}</span>
          </form>
        ) : (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <b>{d.admin.notFeasibleTitle}</b>
            {p.shortfall > 0 && <p>{fmt(d.admin.shortfall, { n: p.shortfall })}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
