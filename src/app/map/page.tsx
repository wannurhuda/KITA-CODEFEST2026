import { createClient } from '@/lib/supabase/server';
import { getDict } from '@/lib/i18n/server';
import { MapLoader } from '@/components/MapLoader';
import type { MapItem } from '@/components/MapView';

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const d = getDict();
  let items: MapItem[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await createClient().from('requests').select('id, title, urgency, area, lat, lng').eq('status', 'open');
    items = (data ?? []).map((r: any) => ({ id: r.id, title: r.title, lat: r.lat, lng: r.lng, urgency: r.urgency, area: r.area }));
  }
  return (
    <div className="wrap py-8">
      <h1 className="h1">{d.map.title}</h1>
      <p className="muted mb-4">{d.map.sub} {d.map.legend}</p>
      <MapLoader items={items} />
    </div>
  );
}
