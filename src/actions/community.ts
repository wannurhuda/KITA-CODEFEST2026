'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getArea } from '@/lib/areas';
import { CATEGORIES } from '@/lib/types';
import { back, dateOrNull, str } from '@/lib/action-utils';

export async function registerOrg(fd: FormData) {
  const { user } = await requireRole('community');
  const name = str(fd, 'name');
  const area = getArea(str(fd, 'area'));
  if (!name || !area) back('/community', 'error', 'required');
  const { error } = await createClient().from('organizations').insert({ owner_id: user.id, name, area: area!.name });
  if (error) back('/community', 'error', 'generic');
  revalidatePath('/community');
  redirect('/community?ok=saved');
}

export async function createRequest(fd: FormData) {
  const { user } = await requireRole('community');
  const sb = createClient();

  const { data: org } = await sb.from('organizations').select('id, verified').eq('owner_id', user.id).limit(1).maybeSingle();
  if (!org || !org.verified) back('/community', 'error', 'notVerified');

  const title = str(fd, 'title');
  const category = str(fd, 'category');
  const area = getArea(str(fd, 'area'));
  const quantity = Number(str(fd, 'quantity'));
  const urgency = Number(str(fd, 'urgency'));
  if (!title || !area || !(CATEGORIES as string[]).includes(category)) back('/community/new', 'error', 'required');
  if (!Number.isInteger(quantity) || quantity < 1) back('/community/new', 'error', 'quantity');

  const { error } = await sb.from('requests').insert({
    org_id: org!.id,
    title,
    category,
    description: str(fd, 'description'),
    quantity,
    urgency: [1, 2, 3].includes(urgency) ? urgency : 2,
    needed_by: dateOrNull(str(fd, 'needed_by')),
    area: area!.name,
    lat: area!.lat,
    lng: area!.lng
  });
  if (error) back('/community/new', 'error', 'generic');
  revalidatePath('/community');
  revalidatePath('/needs');
  redirect('/community?ok=saved');
}
