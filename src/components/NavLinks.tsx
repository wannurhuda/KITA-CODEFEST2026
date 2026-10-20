'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="ml-auto text-2xl md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        ☰
      </button>
      <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-b border-[#e0e7de] bg-white p-3 md:static md:ml-auto md:flex md:flex-row md:border-0 md:bg-transparent md:p-0`}>
        {links.map((l) => {
          const on = l.href === '/' ? path === '/' : path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium hover:bg-brand-100 ${on ? 'bg-brand-100 font-bold text-brand-700' : 'text-[#33443b]'}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
