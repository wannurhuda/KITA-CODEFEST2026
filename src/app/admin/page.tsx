import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getDict, getLocale } from '@/lib/i18n/server';
import { verifyOrg, approveDelivery } from '@/actions/admin';
import { sortByPriority } from '@/lib/matching';
import { Flash } from '@/components/Flash';
import { Pill, Empty, fmtDate, urgencyTone } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function AdminHome({ searchParams }: { searchParams: { error?: string; ok?: string } }) {
  const d = getDict();
  const locale = getLocale();
  await requireRole('admin');
  const sb = createClient();

  const [{ data: orgs }, { data: open }, { data: matches }] = await Promise.all([
    sb.from('organizations').select('id, name, area').eq('verified', false).order('created_at'),
    sb.from('requests').select('id, title, category, quantity, urgency, needed_by, organizations(name)').eq('status', 'open'),
    sb
      .from('matches')
      .select('id, status, score, created_at, requests(title), volunteers(id, profiles(full_name))')
      .order('created_at', { ascending: false })
      .limit(30)
  ]);
  const queue = sortByPriority((open ?? []) as any[]);

  return (
    <div className="wrap py-8">
      <h1 className="h1">{d.admin.title}</h1>
      <p className="muted mb-4">{d.admin.sub}</p>
      <Flash error={searchParams.error} ok={searchParams.ok} />

      <h2 className="h2 mb-2 mt-4">{d.admin.orgsTitle}</h2>
      {(orgs ?? []).length === 0 ? (
        <p className="muted text-sm">{d.admin.noOrgs}</p>
      ) : (
        (orgs ?? []).map((o: any) => (
          <form key={o.id} action={verifyOrg} className="card mb-2 flex items-center justify-between gap-3">
            <input type="hidden" name="id" value={o.id} />
            <div><b>{o.name}</b><br /><span className="muted text-xs">📍 {o.area}</span></div>
            <SubmitButton>{d.common.verify}</SubmitButton>
          </form>
        ))
      )}

      <h2 className="h2 mb-2 mt-8">{d.admin.openTitle}</h2>
      <div className="card divide-y divide-[#e0e7de] !p-0">
        {queue.length === 0 && <Empty>{d.common.none}</Empty>}
        {queue.map((r: any) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className={`pill ${urgencyTone(r.urgency)}`}>{d.urg[r.urgency as 1 | 2 | 3]}</span>
            <div className="min-w-[200px] flex-1">
              <b>{r.title}</b>
              <p className="muted text-xs">{r.organizations?.name} · 📦 {r.quantity} · {d.cat[r.category as keyof typeof d.cat]} · {d.common.neededBy} {fmtDate(r.needed_by, locale)}</p>
            </div>
            <Link href={`/admin/match/${r.id}`} className="btn btn-sm">{d.admin.reviewMatch}</Link>
          </div>
        ))}
      </div>

      <h2 className="h2 mb-2 mt-8">{d.admin.matchesTitle}</h2>
      <div className="card divide-y divide-[#e0e7de] !p-0">
        {(matches ?? []).length === 0 && <Empty>{d.admin.noMatches}</Empty>}
        {(matches ?? []).map((m: any) => (
          <div key={m.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-[200px] flex-1">
              <b>{m.requests?.title}</b>
              <p className="muted text-xs">{d.admin.volunteer}: {m.volunteers?.profiles?.full_name ?? '-'} · {d.admin.score}: {m.score ?? '-'}</p>
            </div>
            
            {/* Added a container here for the pill and the button */}
            <div className="flex flex-col items-end gap-2">
              <Pill kind={m.status}>{d.mstatus[m.status as keyof typeof d.mstatus]}</Pill>
              
              {m.status === 'delivered' && (
                <form action={approveDelivery}>
                  <input type="hidden" name="matchId" value={m.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2
                    rounded-xl bg-emerald-800 px-5 py-2.5
                    text-sm font-semibold text-white
                    shadow-sm transition-all duration-200
                    hover:bg-emerald-900 hover:shadow-md
                    active:scale-95
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-emerald-700"
>
                    <span aria-hidden="true">✓</span>
                    Approve Delivery
                  </button>
                </form>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}