'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { back, safePath, str } from '@/lib/action-utils';

const NEXT: Record<string, string> = { accepted: 'approved', delivered: 'accepted', received: 'delivered' };

/** Volunteer: approved -> accepted -> delivered. Community owner: delivered -> received.
 *  The database trigger guard_match_update enforces who may do which step. */
export async function advanceMatch(fd: FormData) {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const to = str(fd, 'to');
  const returnTo = safePath(str(fd, 'return_to'), '/dashboard');
  if (!NEXT[to]) back(returnTo, 'error', 'generic');

  const { data, error } = await createClient().from('matches').update({ status: to }).eq('id', str(fd, 'id')).eq('status', NEXT[to]).select('id');
  if (error || !data || data.length === 0) back(returnTo, 'error', 'generic');
  revalidatePath('/', 'layout');
  redirect(`${returnTo}?ok=saved`);
}
