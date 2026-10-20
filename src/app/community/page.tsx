import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getDict, getLocale } from '@/lib/i18n/server';
import { registerOrg } from '@/actions/community';
import { advanceMatch } from '@/actions/matches';
import { Flash } from '@/components/Flash';
import { Pill, AreaSelect, CAT_EMOJI, Empty, fmtDate } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function CommunityHome({ searchParams }: { searchParams: { error?: string; ok?: string } }) {
  const d = getDict();
  const locale = getLocale();
  const { user } = await requireRole('community');
  const sb = createClient();

  const { data: org } = await sb.from('organizations').select('id, name, area, verified').eq('owner_id', user.id).limit(1).maybeSingle();
  const { data: reqs } = org
    ? await sb.from('requests').select('id, title, category, quantity, urgency, needed_by, status').eq('org_id', org.id).order('created_at', { ascending: false })
    : { data: [] as any[] };
  const reqIds = (reqs ?? []).map((r: any) => r.id);
  const { data: matches } = reqIds.length
    ? await sb.from('matches').select('id, status, request_id, requests(title)').in('request_id', reqIds).neq('status', 'declined')
    : { data: [] as any[] };
  const toConfirm = (matches ?? []).filter((m: any) => m.status === 'delivered');
  const matchByRequest = new Map((matches ?? []).map((m: any) => [m.request_id, m.status as string]));

  return (
    <div className="wrap py-8">
      <h1 className="h1">{d.community.title}</h1>
      <p className="muted mb-4">{d.community.sub}</p>
      <Flash error={searchParams.error} ok={searchParams.ok} />

      {!org ? (
        <form action={registerOrg} className="card max-w-lg">
          <h2 className="h2">{d.community.registerTitle}</h2>
          <p className="muted text-sm">{d.community.registerBody}</p>
          <label className="label" htmlFor="name">{d.community.orgName}</label>
          <input id="name" name="name" className="input" required maxLength={100} />
          <label className="label">{d.common.area}</label>
          <AreaSelect />
          <div className="mt-5"><SubmitButton>{d.community.register}</SubmitButton></div>
        </form>
      ) : (
        <>
          <div className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="h2">{org.name}</h2>
              <p className="muted text-sm">📍 {org.area}</p>
            </div>
            <div className="flex items-center gap-3">
              <Pill kind={org.verified ? 'verified' : 'pending'}>{org.verified ? d.common.verified : d.common.pending}</Pill>
              {org.verified && <Link href="/community/new" className="btn">+ {d.community.newRequest}</Link>}
            </div>
          </div>
          {!org.verified && <p className="muted mt-2 text-sm">{d.community.waiting}</p>}

          <h2 className="h2 mb-2 mt-8">{d.community.confirmTitle}</h2>
          {toConfirm.length === 0 ? (
            <p className="muted text-sm">{d.community.noConfirm}</p>
          ) : (
            toConfirm.map((m: any) => (
              <form key={m.id} action={advanceMatch} className="card mb-2 flex flex-wrap items-center justify-between gap-3">
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="to" value="received" />
                <input type="hidden" name="return_to" value="/community" />
                <div><b>{m.requests?.title}</b><br /><span className="muted text-xs">{d.mstatus.delivered}</span></div>
                <SubmitButton>{d.community.confirmBtn}</SubmitButton>
              </form>
            ))
          )}

          <h2 className="h2 mb-2 mt-8">{d.community.requestsTitle}</h2>
          <div className="card divide-y divide-[#e0e7de] !p-0">
            {(reqs ?? []).length === 0 && <Empty>{d.common.none}</Empty>}
            {(reqs ?? []).map((r: any) => {
              const ms = matchByRequest.get(r.id);
              return (
                <div key={r.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-xl">{CAT_EMOJI[r.category]}</div>
                  <div className="min-w-[200px] flex-1">
                    <h3 className="font-bold">{r.title}</h3>
                    <p className="muted text-xs">📦 {r.quantity} · {d.urg[r.urgency as 1 | 2 | 3]} · {d.common.neededBy} {fmtDate(r.needed_by, locale)}</p>
                  </div>
                  <Pill kind={r.status}>{d.qstatus[r.status as keyof typeof d.qstatus]}</Pill>
                  {ms && <Pill kind={ms}>{d.mstatus[ms as keyof typeof d.mstatus]}</Pill>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
