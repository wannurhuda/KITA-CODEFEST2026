import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getDict } from '@/lib/i18n/server';
import { deleteResource } from '@/actions/resources';
import { resourceStatus, type Resource } from '@/lib/types';
import { Flash } from '@/components/Flash';
import { Pill, CAT_EMOJI, Empty } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function DonorHome({ searchParams }: { searchParams: { tab?: string; error?: string; ok?: string } }) {
  const d = getDict();
  const { user } = await requireRole('donor');
  const { data } = await createClient().from('resources').select('*').eq('donor_id', user.id).order('created_at', { ascending: false });
  const all = (data ?? []) as Resource[];
  const tab = searchParams.tab ?? 'all';
  const groups: Record<string, (r: Resource) => boolean> = {
    all: () => true,
    available: (r) => ['available', 'partial'].includes(resourceStatus(r)),
    progress: (r) => resourceStatus(r) === 'matched',
    done: (r) => resourceStatus(r) === 'completed'
  };
  const tabs: [string, string][] = [['all', d.donor.tabAll], ['available', d.donor.tabAvailable], ['progress', d.donor.tabProgress], ['done', d.donor.tabDone]];
  const list = all.filter(groups[tab] ?? groups.all);

  return (
    <div className="wrap py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="h1">{d.donor.title}</h1><p className="muted">{d.donor.sub}</p></div>
        <Link href="/donor/new" className="btn">+ {d.donor.add}</Link>
      </div>
      <div className="mt-4"><Flash error={searchParams.error} ok={searchParams.ok} /></div>
      <div className="my-4 flex flex-wrap gap-2">
        {tabs.map(([k, label]) => (
          <Link key={k} href={`/donor?tab=${k}`} className={`chip ${tab === k ? 'chip-on' : ''}`}>
            {label} ({all.filter(groups[k]).length})
          </Link>
        ))}
      </div>
      <div className="card divide-y divide-[#e0e7de] !p-0">
        {list.length === 0 && <Empty>{d.common.none}</Empty>}
        {list.map((r) => {
          const st = resourceStatus(r);
          return (
            <div key={r.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-brand-100 text-2xl">{CAT_EMOJI[r.category]}</div>
              <div className="min-w-[200px] flex-1">
                <h3 className="font-bold">{r.title}</h3>
                <p className="muted text-xs">📦 {r.quantity} · {d.cat[r.category]} · {d.cond[r.condition]} · 📍 {r.pickup_area}</p>
                <p className="muted text-xs">{d.donor.reserved}: {r.reserved} · {d.donor.delivered}: {r.delivered}</p>
              </div>
              <Pill kind={st}>{d.rstatus[st]}</Pill>
              <Link href={`/donor/${r.id}`} className="btn-outline btn-sm">{d.common.edit}</Link>
              {r.reserved === 0 && (
                <form action={deleteResource}>
                  <input type="hidden" name="id" value={r.id} />
                  <SubmitButton className="btn-danger btn-sm">{d.common.delete}</SubmitButton>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
