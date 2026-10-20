import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getDict, getLocale } from '@/lib/i18n/server';
import { saveVolunteer } from '@/actions/volunteer';
import { advanceMatch } from '@/actions/matches';
import { Flash } from '@/components/Flash';
import { Pill, AreaSelect, Empty, fmtDate } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';
import { AREAS } from '@/lib/areas';
import type { VolunteerRow } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function VolunteerHome({ searchParams }: { searchParams: { error?: string; ok?: string } }) {
  const d = getDict();
  const locale = getLocale();
  const { user } = await requireRole('volunteer');
  const sb = createClient();

  const { data: v } = await sb.from('volunteers').select('*').eq('id', user.id).maybeSingle();
  const vol = v as VolunteerRow | null;
  const { data: matches } = await sb
    .from('matches')
    .select('id, status, requests(title, quantity, needed_by, area, organizations(name)), match_items(quantity, resources(title, pickup_area))')
    .eq('volunteer_id', user.id)
    .in('status', ['approved', 'accepted', 'delivered', 'received'])
    .order('created_at', { ascending: false });
  const areaId = vol ? AREAS.find((a) => a.name === vol.area)?.id : undefined;

  return (
    <div className="wrap py-8">
      <h1 className="h1">{d.volunteer.title}</h1>
      <p className="muted mb-4">{d.volunteer.sub}</p>
      <Flash error={searchParams.error} ok={searchParams.ok} />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form action={saveVolunteer} className="card h-fit">
          <h2 className="h2">{d.volunteer.availability}</h2>
          <label className="label">{d.volunteer.vehicle}</label>
          <select name="vehicle" className="input" defaultValue={vol?.vehicle ?? 'car'}>
            {Object.entries(d.volunteer.vehicles).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
          <label className="label">{d.volunteer.capacity}</label>
          <input name="capacity" type="number" min={1} required className="input" defaultValue={vol?.capacity} />
          <label className="label">{d.volunteer.range}</label>
          <input name="area_km" type="number" min={1} required className="input" defaultValue={vol?.area_km ?? 10} />
          <label className="label">{d.common.area}</label>
          <AreaSelect defaultValue={areaId} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">{d.common.from}</label><input name="available_from" type="date" className="input" defaultValue={vol?.available_from ?? ''} /></div>
            <div><label className="label">{d.common.to}</label><input name="available_to" type="date" className="input" defaultValue={vol?.available_to ?? ''} /></div>
          </div>
          <label className="mt-4 flex items-center gap-2 font-semibold">
            <input type="checkbox" name="is_available" defaultChecked={vol?.is_available ?? true} /> {d.volunteer.available}
          </label>
          <div className="mt-5"><SubmitButton>{d.volunteer.saveBtn}</SubmitButton></div>
        </form>

        <section>
          <h2 className="h2 mb-3">{d.volunteer.assignments}</h2>
          {(matches ?? []).length === 0 && <div className="card"><Empty>{d.volunteer.noAssign}</Empty></div>}
          {(matches ?? []).map((m: any) => (
            <article key={m.id} className="card mb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">{m.requests?.title}</h3>
                <Pill kind={m.status}>{d.mstatus[m.status as keyof typeof d.mstatus]}</Pill>
              </div>
              <p className="muted text-xs">{d.volunteer.deliverTo}: {m.requests?.organizations?.name} ({m.requests?.area}) · {d.common.neededBy} {fmtDate(m.requests?.needed_by ?? null, locale)}</p>
              <ul className="mt-2 text-sm">
                {(m.match_items ?? []).map((it: any, i: number) => (
                  <li key={i}>📦 {it.quantity} × {it.resources?.title} <span className="muted">({d.volunteer.pickup}: {it.resources?.pickup_area})</span></li>
                ))}
              </ul>
              {(m.status === 'approved' || m.status === 'accepted') && (
                <form action={advanceMatch} className="mt-3">
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="to" value={m.status === 'approved' ? 'accepted' : 'delivered'} />
                  <input type="hidden" name="return_to" value="/volunteer" />
                  <SubmitButton>{m.status === 'approved' ? d.volunteer.accept : d.volunteer.markDelivered}</SubmitButton>
                </form>
              )}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
