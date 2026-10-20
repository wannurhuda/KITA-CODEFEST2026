import Link from 'next/link';
import { saveResource } from '@/actions/resources';
import { SubmitButton } from './SubmitButton';
import { AreaSelect, CategorySelect } from './ui';
import { CONDITIONS, type Resource } from '@/lib/types';
import type { Dict } from '@/lib/i18n/dict';
import { AREAS } from '@/lib/areas';

export function ResourceForm({ d, resource }: { d: Dict; resource?: Resource }) {
  const areaId = resource ? AREAS.find((a) => a.name === resource.pickup_area)?.id : undefined;
  return (
    <form action={saveResource} className="card">
      {resource && <input type="hidden" name="id" value={resource.id} />}
      <label className="label !mt-0" htmlFor="title">{d.donor.itemTitle}</label>
      <input id="title" name="title" className="input" required maxLength={80} defaultValue={resource?.title} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">{d.common.category}</label><CategorySelect d={d} defaultValue={resource?.category} /></div>
        <div>
          <label className="label">{d.common.condition}</label>
          <select name="condition" className="input" defaultValue={resource?.condition ?? 'new'}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{d.cond[c]}</option>)}
          </select>
        </div>
        <div><label className="label">{d.common.quantity}</label><input name="quantity" type="number" min={resource?.reserved || 1} required className="input" defaultValue={resource?.quantity} /></div>
        <div><label className="label">{d.donor.pickupArea}</label><AreaSelect defaultValue={areaId} /></div>
        <div><label className="label">{d.common.from} ({d.common.optional})</label><input name="available_from" type="date" className="input" defaultValue={resource?.available_from ?? ''} /></div>
        <div><label className="label">{d.common.to} ({d.common.optional})</label><input name="available_to" type="date" className="input" defaultValue={resource?.available_to ?? ''} /></div>
      </div>

      <label className="label">{d.common.description} ({d.common.optional})</label>
      <textarea name="description" rows={3} className="input" maxLength={300} defaultValue={resource?.description} />
      <p className="muted mt-2 text-xs">{d.donor.safety}</p>

      <div className="mt-5 flex gap-3">
        <SubmitButton>{d.common.save}</SubmitButton>
        <Link href="/donor" className="btn-outline">{d.common.cancel}</Link>
      </div>
    </form>
  );
}
