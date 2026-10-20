import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getDict, getLocale } from '@/lib/i18n/server';
import { setLang } from '@/actions/lang';
import { signOut } from '@/actions/auth';
import { NavLinks } from './NavLinks';

export function Logo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
      <path d="M24 40C10 34 6 22 10 10c10 0 16 6 14 30Z" fill="#1f8a5b" />
      <path d="M24 40c14-6 18-18 14-30-10 0-16 6-14 30Z" fill="#7bc47f" />
      <path d="M24 40V18" stroke="#fff" strokeWidth="2" fill="none" />
    </svg>
  );
}

export async function Header() {
  const d = getDict();
  const locale = getLocale();
  const { user, profile } = await getSession();
  const links = [
    { href: '/', label: d.nav.home },
    { href: '/needs', label: d.nav.needs },
    { href: '/about', label: d.nav.about },
    { href: '/impact', label: d.nav.impact },
    { href: '/map', label: d.nav.map },
    ...(user ? [{ href: '/dashboard', label: d.nav.dashboard }] : [])
  ];
  return (
    <header className="sticky top-0 z-[1000] border-b border-[#e0e7de] bg-white/95 backdrop-blur">
      <div className="wrap relative flex min-h-[52px] items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <Logo />
          <span className="leading-none">
            KITA
            <small className="hidden text-[9px] font-medium text-[#66756d] sm:block">{d.appTagline}</small>
          </span>
        </Link>
        <NavLinks links={links} />
        <div className="ml-2 flex items-center gap-2">
          <form action={setLang.bind(null, locale === 'ms' ? 'en' : 'ms')}>
            <button className="btn-outline btn-sm" aria-label="Language">{locale === 'ms' ? 'EN' : 'BM'}</button>
          </form>
          {user ? (
            <form action={signOut} className="flex items-center gap-2">
              <span className="hidden text-xs font-semibold lg:inline">{profile?.full_name || user.email}</span>
              <button className="btn-outline btn-sm">{d.common.logout}</button>
            </form>
          ) : (
            <>
              <Link href="/login" className="btn-outline btn-sm">{d.common.login}</Link>
              <Link href="/signup" className="btn btn-sm">{d.common.signup}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
