'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useDict } from './DictProvider';
import { CATEGORIES } from '@/lib/types';

export interface NeedItem {
  id: string; title: string; category: string; quantity: number; urgency: number; needed_by: string | null;
  status: string; org: string; area: string;
}
const EMOJI: Record<string, string> = { food: '🍚', education: '📚', hygiene: '🧼', essentials: '🥫', others: '🎒' };
const GRAD: Record<string, string> = {
  food: 'from-[#f6d9a8] to-[#e8a860]', education: 'from-[#bde0f6] to-[#7bb3e0]', hygiene: 'from-[#d6c8f0] to-[#a998d8]',
  essentials: 'from-[#cfe8c4] to-[#8cc07c]', others: 'from-[#f6c9c0] to-[#e48f80]'
};

export function NeedsBrowser({ items }: { items: NeedItem[] }) {
  const d = useDict();
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'urgent' | 'date'>('urgent');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = items.filter((n) => (cat === 'all' || n.category === cat) && (!term || `${n.title} ${n.org} ${n.area}`.toLowerCase().includes(term)));
    out.sort((a, b) =>
      sort === 'urgent'
        ? b.urgency - a.urgency || (a.needed_by ?? '9').localeCompare(b.needed_by ?? '9')
        : (a.needed_by ?? '9').localeCompare(b.needed_by ?? '9')
    );
    return out;
  }, [items, cat, q, sort]);

  return (
    <>
      <div className="my-4 flex flex-wrap items-center gap-3">
        <input className="input max-w-md flex-1" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={d.common.searchPlaceholder} aria-label={d.common.search} />
        <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value as 'urgent' | 'date')} aria-label={d.common.sort}>
          <option value="urgent">{d.common.mostUrgent}</option>
          <option value="date">{d.common.soonest}</option>
        </select>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'chip-on' : ''}`}>
            {c === 'all' ? d.common.all : d.cat[c as keyof typeof d.cat]}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="muted py-10 text-center">{d.needs.empty}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((n) => (
            <article key={n.id} className="card overflow-hidden p-0">
              <div className={`relative grid h-32 place-items-center bg-gradient-to-br ${GRAD[n.category] ?? GRAD.others}`}>
                <span className="text-5xl drop-shadow">{EMOJI[n.category]}</span>
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${n.urgency >= 3 ? 'bg-red-600' : n.urgency === 2 ? 'bg-brand-600' : 'bg-blue-600'}`}>
                  {d.urg[n.urgency as 1 | 2 | 3]}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{n.title}</h3>
                <p className="muted mt-1 text-xs">🏫 {n.org}</p>
                <p className="muted text-xs">📦 {n.quantity} {d.common.items} · {d.cat[n.category as keyof typeof d.cat]}</p>
                <p className={`text-xs ${n.urgency >= 3 ? 'font-semibold text-red-600' : 'muted'}`}>🗓 {d.needs.by} {n.needed_by ?? '-'}</p>
                <Link href={`/needs/${n.id}`} className="btn mt-3 w-full">{d.common.view}</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
