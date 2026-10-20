'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { suggestMatch, type MatchResource, type MatchVolunteer } from '@/lib/matching';
import { back, str } from '@/lib/action-utils';

export async function verifyOrg(fd: FormData) {
  await requireRole('admin');
  const { error } = await createClient().from('organizations').update({ verified: true }).eq('id', str(fd, 'id'));
  if (error) back('/admin', 'error', 'generic');
  revalidatePath('/admin');
  redirect('/admin?ok=verified');
}

/** Re-runs the matching engine on the server (never trusts the browser), then reserves stock and creates the match. */
export async function approveMatch(fd: FormData) {
  await requireRole('admin');
  const requestId = str(fd, 'request_id');
  const here = `/admin/match/${requestId}`;
  const sb = createClient();

  const { data: req } = await sb.from('requests').select('*').eq('id', requestId).maybeSingle();
  if (!req || req.status !== 'open') back('/admin', 'error', 'generic');

  const [{ data: resources }, { data: vols }] = await Promise.all([
    sb.from('resources').select('*'),
    sb.from('volunteers').select('*')
  ]);

  const proposal = suggestMatch(
    { id: req!.id, category: req!.category, quantity: req!.quantity, needed_by: req!.needed_by, urgency: req!.urgency, lat: req!.lat, lng: req!.lng },
    (resources ?? []) as MatchResource[],
    (vols ?? []) as MatchVolunteer[]
  );
  if (!proposal.feasible || !proposal.volunteer) back(here, 'error', 'notFeasible');

  // Reserve stock with optimistic concurrency (only if nobody changed it meanwhile).
  const reserved: { id: string; take: number; before: number }[] = [];
  const rollback = async () => {
    for (const r of reserved) await sb.from('resources').update({ reserved: r.before }).eq('id', r.id);
  };
  for (const p of proposal.parts) {
    const { data: ok } = await sb
      .from('resources')
      .update({ reserved: p.resource.reserved + p.take })
      .eq('id', p.resource.id)
      .eq('reserved', p.resource.reserved)
      .select('id');
    if (!ok || ok.length === 0) {
      await rollback();
      back(here, 'error', 'stale');
    }
    reserved.push({ id: p.resource.id, take: p.take, before: p.resource.reserved });
  }

  const { data: match, error } = await sb
    .from('matches')
    .insert({ request_id: requestId, volunteer_id: proposal.volunteer!.id, status: 'approved', score: proposal.score, explanation: proposal.checks })
    .select('id')
    .single();
  if (error || !match) {
    await rollback();
    back(here, 'error', 'generic');
  }
  const { error: itemsError } = await sb
    .from('match_items')
    .insert(proposal.parts.map((p) => ({ match_id: match!.id, resource_id: p.resource.id, quantity: p.take })));
  if (itemsError) {
    await sb.from('matches').delete().eq('id', match!.id);
    await rollback();
    back(here, 'error', 'generic');
  }
  await sb.from('requests').update({ status: 'matched' }).eq('id', requestId);

  revalidatePath('/admin');
  revalidatePath('/needs');
  redirect('/admin?ok=approved');
}

// --- THIS IS THE NEW FUNCTION FOR YOUR DASHBOARD BUTTON ---
export async function approveDelivery(fd: FormData) {
  await requireRole('admin');
  const matchId = str(fd, 'matchId');
  const sb = createClient();

  const { error } = await sb
    .from('matches')
    .update({ status: 'received' })
    .eq('id', matchId);

  // THIS LINE WILL PRINT THE EXACT ERROR IN YOUR TERMINAL
  if (error) {
    console.error("=== DATABASE ERROR ===", error);
    back('/admin', 'error', 'generic');
  }
  
  revalidatePath('/admin');
  redirect('/admin?ok=deliveryApproved');
}