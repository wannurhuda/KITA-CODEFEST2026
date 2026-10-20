import { redirect } from 'next/navigation';

/** Redirect back to a page with a message code (shown by <Flash />). */
export function back(path: string, key: 'error' | 'ok', code: string): never {
  const sep = path.includes('?') ? '&' : '?';
  redirect(`${path}${sep}${key}=${encodeURIComponent(code)}`);
}

export const str = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();
export const dateOrNull = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

export function safePath(p: string, fallback: string) {
  return p.startsWith('/') && !p.startsWith('//') ? p : fallback;
}
