import { getDict } from '@/lib/i18n/server';

export default function About() {
  const d = getDict().about;
  return (
    <div className="wrap py-10">
      <h1 className="h1">{d.title}</h1>

      <section className="card mt-6">
        <h2 className="h2">{d.aboutTitle}</h2>
        <p className="mt-2">{d.about1}</p>
        <p className="mt-2">{d.about2}</p>
        <p className="muted mt-3 text-xs">{d.statusNote}</p>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="card"><div className="mb-1 text-2xl">👁️</div><h2 className="h2">{d.visionTitle}</h2><p className="mt-1">{d.vision}</p></section>
        <section className="card"><div className="mb-1 text-2xl">🎯</div><h2 className="h2">{d.missionTitle}</h2><p className="mt-1">{d.mission}</p></section>
      </div>

      <h2 className="h2 mb-3 mt-8">{d.valuesTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {d.values.map(([t, p]) => (
          <div key={t} className="card"><h3 className="font-bold">{t}</h3><p className="muted mt-1 text-sm">{p}</p></div>
        ))}
      </div>

      <section className="card mt-8 border-l-4 border-l-brand-600">
        <h2 className="h2">{d.problemTitle}</h2>
        <p className="mt-1 font-semibold">{d.problemLead}</p>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {d.problems.map(([t, p]) => (
            <div key={t}><h3 className="font-bold">{t}</h3><p className="muted text-sm">{p}</p></div>
          ))}
        </div>
        <p className="muted mt-4 text-xs">{d.problemNote}</p>
      </section>

      <h2 className="h2 mb-3 mt-8">{d.sdgTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {d.sdgs.map(([n, t, p], i) => (
          <div key={n} className="min-h-[150px] rounded-2xl p-4 text-white" style={{ background: ['#e5243b', '#c58f1d', '#e08a0b', '#9c6f1f', '#19486a'][i] }}>
            <b className="block text-3xl leading-none">{n}</b>
            <h3 className="mt-1 text-sm font-bold">{t}</h3>
            <p className="mt-1 text-xs opacity-95">{p}</p>
          </div>
        ))}
      </div>

      <section className="card mt-8">
        <h2 className="h2">{d.scopeTitle}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {d.scope.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </section>
    </div>
  );
}
