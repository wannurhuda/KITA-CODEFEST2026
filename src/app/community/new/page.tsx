import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDict } from '@/lib/i18n/server';
import { createRequest } from '@/actions/community';
import { Flash } from '@/components/Flash';
import { AreaSelect, CategorySelect } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function NewRequest({ searchParams }: { searchParams: { error?: string } }) {
  await requireRole('community');
  const d = getDict();
  return (
    <div className="wrap max-w-2xl py-8">
      <h1 className="h1">{d.community.newTitle}</h1>
      <p className="muted mb-4">{d.community.newSub}</p>
      <Flash error={searchParams.error} />
      <form action={createRequest} className="card">
        <label className="label !mt-0" htmlFor="title">{d.community.requestTitle}</label>
        <input id="title" name="title" className="input" required maxLength={100} placeholder="30 school kits" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">{d.common.category}</label><CategorySelect d={d} /></div>
          <div><label className="label">{d.common.quantity}</label><input name="quantity" type="number" min={1} required className="input" /></div>
          <div>
            <label className="label">{d.common.urgency}</label>
            <select name="urgency" className="input" defaultValue="2">
              <option value="1">{d.urg[1]}</option><option value="2">{d.urg[2]}</option><option value="3">{d.urg[3]}</option>
            </select>
          </div>
          <div><label className="label">{d.common.neededBy}</label><input name="needed_by" type="date" required className="input" /></div>
        </div>
        <label className="label">{d.common.area} ({d.community.whereHelp})</label>
        <AreaSelect />
        <label className="label">{d.common.description} ({d.common.optional})</label>
        <textarea name="description" rows={4} maxLength={300} className="input" />
        <div className="mt-5 flex gap-3">
          <SubmitButton>{d.community.submit}</SubmitButton>
          <Link href="/community" className="btn-outline">{d.common.cancel}</Link>
        </div>
      </form>
    </div>
  );
}
