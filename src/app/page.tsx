import Link from 'next/link';
import { getDict } from '@/lib/i18n/server';
import { getStats } from '@/lib/stats';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const d = getDict();
  const s = await getStats();
  const { user, profile } = await getSession();
  const offerHref = !user ? '/signup' : profile?.role === 'donor' ? '/donor' : '/dashboard';
  const requestHref = !user ? '/signup' : profile?.role === 'community' ? '/community' : '/dashboard';
  const volunteerHref = !user ? '/signup' : profile?.role === 'volunteer' ? '/volunteer' : '/dashboard';
  const n = (v: number | undefined) => (v === undefined ? '-' : String(v));
  const features = [
    { icon: '🎁', t: d.home.f1t, p: d.home.f1p, href: offerHref },
    { icon: '📝', t: d.home.f2t, p: d.home.f2p, href: requestHref },
    { icon: '🤝', t: d.home.f3t, p: d.home.f3p, href: volunteerHref },
    { icon: '🔗', t: d.home.f4t, p: d.home.f4p, href: '/about' }
  ];
  const stats = [
    { icon: '✅', v: n(s?.verified_requests), l: d.home.s1 },
    { icon: '📦', v: n(s?.resources_listed), l: d.home.s2 },
    { icon: '🎯', v: n(s?.fulfilled_requests), l: d.home.s3 },
    { icon: '💚', v: n(s?.active_volunteers), l: d.home.s4 }
  ];
  return (
    <>
      <section
        className="relative"
        style={{ backgroundImage: 'linear-gradient(90deg,#f4f8f1 0%,#f4f8f1 32%,rgba(244,248,241,.8) 48%,rgba(244,248,241,0) 72%), url(/hero.jpg), linear-gradient(180deg,#f8fbf5,#cfe3c6)', backgroundSize: 'cover', backgroundPosition: 'right center' }}
      >
        <div className="wrap grid gap-6 pb-24 pt-12 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] md:text-5xl">{d.home.title}</h1>
            <p className="mt-5 max-w-lg text-lg text-[#2c3b33]">{d.home.sub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={offerHref} className="btn rounded-full px-8 py-3 text-base">{d.home.offer}</Link>
              <Link href={requestHref} className="btn-outline rounded-full px-8 py-3 text-base">{d.home.request}</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap -mt-16 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.t} href={f.href} className="card shadow-lg shadow-brand-900/5 transition hover:-translate-y-1">
              <div className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-xl">{f.icon}</div>
              <h3 className="font-bold">{f.t}</h3>
              <p className="muted text-sm">{f.p}</p>
            </Link>
          ))}
        </div>
        <div className="card mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((x) => (
            <div key={x.l} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-xl">{x.icon}</div>
              <div><b className="block text-2xl leading-none">{x.v}</b><span className="muted text-xs">{x.l}</span></div>
            </div>
          ))}
        </div>
        <p className="muted mt-2 text-xs">{d.home.statsNote}</p>
      </div>

      <section className="wrap py-12">
        <h2 className="text-2xl font-extrabold">{d.home.howTitle}</h2>
        <p className="muted mb-6 mt-1">{d.home.howSub}</p>
        <ol className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {d.home.steps.map((t, i) => (
            <li key={t} className="flex items-start gap-3 font-semibold">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-700 text-white">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-2xl bg-brand-100 p-6">
          <h3 className="text-xl font-bold">{d.home.moreTitle}</h3>
          <p className="mt-1 max-w-3xl">{d.home.moreBody}</p>
          <Link href="/about" className="btn mt-4">{d.home.learn}</Link>
        </div>
      </section>
    </>
  );
}