import { getDict } from '@/lib/i18n/server';

export function Flash({ error, ok }: { error?: string; ok?: string }) {
  const d = getDict();
  const err = error ? (d.errors as Record<string, string>)[error] ?? d.errors.generic : null;
  const msg = ok ? (d.ok as Record<string, string>)[ok] ?? d.ok.saved : null;
  if (!err && !msg) return null;
  return (
    <div role={err ? 'alert' : 'status'} className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${err ? 'border-red-300 bg-red-50 text-red-800' : 'border-brand-300 bg-brand-50 text-brand-800'}`}>
      {err ?? msg}
    </div>
  );
}
