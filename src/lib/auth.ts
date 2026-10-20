import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Role } from '@/lib/types';

export async function getSession(): Promise<{ user: { id: string; email?: string } | null; profile: Profile | null }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { user: null, profile: null };
  const sb = createClient();
  const {
    data: { user }
  } = await sb.auth.getUser();
  if (!user) return { user: null, profile: null };
  const { data } = await sb.from('profiles').select('id, full_name, role').eq('id', user.id).maybeSingle();
  return { user: { id: user.id, email: user.email }, profile: (data as Profile | null) ?? null };
}

export async function requireRole(role: Role | Role[]) {
  const { user, profile } = await getSession();
  if (!user) redirect('/login');
  const allowed = Array.isArray(role) ? role : [role];
  if (!profile || !allowed.includes(profile.role)) redirect('/dashboard');
  return { user: user!, profile: profile! };
}

export const roleHome: Record<Role, string> = {
  donor: '/donor',
  community: '/community',
  volunteer: '/volunteer',
  admin: '/admin'
};
