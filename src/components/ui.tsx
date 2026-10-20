import { dictionaries } from '@/lib/i18n/dict';
import { AREAS } from '@/lib/areas';
import { CATEGORIES } from '@/lib/types';
import type { Dict } from '@/lib/i18n/dict';

const tone: Record<string, string> = {
  available: 'bg-green-100 text-green-800', partial: 'bg-amber-100 text-amber-800', matched: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-200 text-gray-700', open: 'bg-green-100 text-green-800', fulfilled: 'bg-gray-200 text-gray-700',
  cancelled: 'bg-gray-200 text-gray-700', proposed: 'bg-amber-100 text-amber-800', approved: 'bg-blue-100 text-blue-800',
  accepted: 'bg-blue-100 text-blue-800', delivered: 'bg-amber-100 text-amber-800', received: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800', verified: 'bg-green-100 text-green-800', pending: 'bg-amber-100 text-amber-800'
};

export function Pill({ kind, children }: { kind: string; children: React.ReactNode }) {
  return <span className={`pill ${tone[kind] ?? 'bg-gray-100 text-gray-700'}`}>{children}</span>;
}

export const urgencyTone = (u: number) => (u >= 3 ? 'bg-red-600 text-white' : u === 2 ? 'bg-brand-600 text-white' : 'bg-blue-600 text-white');
export const CAT_EMOJI: Record<string, string> = { food: '🍚', education: '📚', hygiene: '🧼', essentials: '🥫', others: '🎒' };

export function AreaSelect({ name = 'area', defaultValue, d }: { name?: string; defaultValue?: string; d?: Dict }) {
  void d;
  return (
    <select name={name} className="input" defaultValue={defaultValue ?? ''} required>
      <option value="" disabled>-</option>
      {AREAS.map((a) => (
        <option key={a.id} value={a.id}>{a.name}</option>
      ))}
    </select>
  );
}

export function CategorySelect({ d, defaultValue }: { d: Dict; defaultValue?: string }) {
  return (
    <select name="category" className="input" defaultValue={defaultValue ?? 'food'}>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>{CAT_EMOJI[c]} {d.cat[c]}</option>
      ))}
    </select>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="muted py-8 text-center">{children}</p>;
}

export function fmtDate(d: string | null, locale: 'ms' | 'en'): string {
  if (!d) return '-';
  return new Date(d + 'T00:00:00').toLocaleDateString(locale === 'ms' ? 'ms-MY' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export { dictionaries };
