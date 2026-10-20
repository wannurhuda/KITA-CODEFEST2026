'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useDict } from './DictProvider';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const d = useDict();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email'));
    const password = String(f.get('password'));
    const sb = createClient();
    try {
      if (mode === 'login') {
        const { error: err } = await sb.auth.signInWithPassword({ email, password });
        if (err) return setError(d.errors.login);
        const next = params.get('next');
        router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
        router.refresh();
      } else {
        const { data, error: err } = await sb.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: String(f.get('full_name')), role: String(f.get('role')) },
            emailRedirectTo: `${location.origin}/auth/callback`
          }
        });
        if (err) return setError(err.message || d.errors.signup);
        if (data.session) {
          router.push('/dashboard');
          router.refresh();
        } else setInfo(d.ok.checkEmail);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap max-w-md py-10">
      <div className="card">
        <h1 className="h1 mb-2">{mode === 'login' ? d.auth.loginTitle : d.auth.signupTitle}</h1>
        {error && <p role="alert" className="mb-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {info && <p role="status" className="mb-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">{info}</p>}
        <form onSubmit={onSubmit}>
          {mode === 'signup' && (
            <>
              <label className="label" htmlFor="full_name">{d.auth.fullName}</label>
              <input id="full_name" name="full_name" className="input" required maxLength={80} />
            </>
          )}
          <label className="label" htmlFor="email">{d.common.email}</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" />
          <label className="label" htmlFor="password">{d.common.password}</label>
          <input id="password" name="password" type="password" className="input" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          {mode === 'signup' && (
            <>
              <label className="label" htmlFor="role">{d.common.role}</label>
              <select id="role" name="role" className="input" defaultValue="donor">
                <option value="donor">{d.roles.donor}</option>
                <option value="community">{d.roles.community}</option>
                <option value="volunteer">{d.roles.volunteer}</option>
              </select>
              <p className="muted mt-2 text-xs">{d.auth.roleHelp}</p>
            </>
          )}
          <button className="btn mt-5 w-full" disabled={busy}>{busy ? '...' : mode === 'login' ? d.common.login : d.common.signup}</button>
        </form>
        <p className="muted mt-4 text-center text-sm">
          {mode === 'login' ? d.auth.noAccount : d.auth.haveAccount}{' '}
          <Link className="font-semibold text-brand-700 underline" href={mode === 'login' ? '/signup' : '/login'}>
            {mode === 'login' ? d.common.signup : d.common.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
