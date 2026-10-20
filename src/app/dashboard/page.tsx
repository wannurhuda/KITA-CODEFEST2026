import { redirect } from 'next/navigation';
import { getSession, roleHome } from '@/lib/auth';
import { getDict } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const { user, profile } = await getSession();
  if (!user) redirect('/login');
  if (!profile) return <div className="wrap py-10">{getDict().dash.setupProfile}</div>;
  redirect(roleHome[profile.role]);
}
