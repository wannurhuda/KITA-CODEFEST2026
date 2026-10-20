import { getDict } from '@/lib/i18n/server';

export function Footer() {
  const d = getDict();
  return (
    <footer className="mt-10 bg-brand-800 py-6 text-xs text-[#cfe3d7]">
      <div className="wrap">KITA. {d.appTagline} {d.common.footer}</div>
    </footer>
  );
}
