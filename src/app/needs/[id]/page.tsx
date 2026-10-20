import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDict, getLocale } from '@/lib/i18n/server';
import { getSession } from '@/lib/auth';
import { Pill, fmtDate, CAT_EMOJI } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function NeedDetail({ params }: { params: { id: string } }) {
  const d = getDict();
  const locale = getLocale();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) notFound();
  const { data: r } = await createClient()
    .from('requests')
    .select('id, title, category, description, quantity, urgency, needed_by, status, area, organizations(name)')
    .eq('id', params.id)
    .maybeSingle();
  if (!r) notFound();
  const { profile } = await getSession();
  const org = (r as any).organizations?.name as string | undefined;
  return (
    <div className="wrap max-w-2xl py-8">
      <Link href="/needs" className="muted text-sm">← {d.common.back}</Link>
      <article className="card mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill kind={r.status}>{d.qstatus[r.status as keyof typeof d.qstatus]}</Pill>
          <span className="muted text-sm">{CAT_EMOJI[r.category]} {d.cat[r.category as keyof typeof d.cat]}</span>
        </div>
        <h1 className="h1 mt-2">{r.title}</h1>
        {r.description && <p className="mt-2">{r.description}</p>}
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><dt className="muted">{d.needs.org}</dt><dd className="font-semibold">{org}</dd></div>
          <div><dt className="muted">{d.common.quantity}</dt><dd className="font-semibold">{r.quantity}</dd></div>
          <div><dt className="muted">{d.common.neededBy}</dt><dd className="font-semibold">{fmtDate(r.needed_by, locale)}</dd></div>
          <div><dt className="muted">{d.common.area}</dt><dd className="font-semibold">{r.area}</dd></div>
          <div><dt className="muted">{d.common.urgency}</dt><dd className="font-semibold">{d.urg[r.urgency as 1 | 2 | 3]}</dd></div>
        </dl>
        {r.status === 'matched' && <p className="muted mt-4 text-sm">{d.needs.matchedNote}</p>}
        <div className="mt-5">
          {profile?.role === 'donor' ? (
            <Link href="/donor/new" className="btn">{d.needs.offerHelp}</Link>
          ) : !profile ? (
            <Link href="/login" className="btn-outline">{d.needs.loginToHelp}</Link>
          ) : null}
        </div>
      </article>
    </div>
  );
}
