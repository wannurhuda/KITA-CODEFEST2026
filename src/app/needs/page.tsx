import { createClient } from '@/lib/supabase/server';
import { getDict } from '@/lib/i18n/server';
import { NeedsBrowser, type NeedItem } from '@/components/NeedsBrowser';

export const dynamic = 'force-dynamic';

export default async function Needs() {
  const d = getDict();
  let items: NeedItem[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await createClient()
      .from('requests')
      .select('id, title, category, quantity, urgency, needed_by, status, area, organizations(name)')
      .in('status', ['open', 'matched'])
      .order('created_at', { ascending: false });
    items = (data ?? []).map((r: any) => ({
      id: r.id, title: r.title, category: r.category, quantity: r.quantity, urgency: r.urgency,
      needed_by: r.needed_by, status: r.status, area: r.area, org: r.organizations?.name ?? ''
    }));
  }
  return (
    <div className="wrap py-8">
      <h1 className="h1">{d.needs.title}</h1>
      <p className="muted">{d.needs.sub}</p>
      <NeedsBrowser items={items} />
    </div>
  );
}
