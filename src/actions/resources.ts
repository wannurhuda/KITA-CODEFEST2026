'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getArea } from '@/lib/areas';
import { CATEGORIES, CONDITIONS } from '@/lib/types';
import { back, dateOrNull, str } from '@/lib/action-utils';

export async function saveResource(fd: FormData) {
  const { user } = await requireRole('donor');
  const id = str(fd, 'id');
  const here = id ? `/donor/${id}` : '/donor/new';

  const title = str(fd, 'title');
  const category = str(fd, 'category');
  const condition = str(fd, 'condition');
  const area = getArea(str(fd, 'area'));
  const quantity = Number(str(fd, 'quantity'));

  if (!title || !area || !(CATEGORIES as string[]).includes(category) || !(CONDITIONS as string[]).includes(condition)) back(here, 'error', 'required');
  if (!Number.isInteger(quantity) || quantity < 1) back(here, 'error', 'quantity');

  const sb = createClient();
  const row = {
    title,
    category,
    condition,
    description: str(fd, 'description'),
    quantity,
    pickup_area: area!.name,
    lat: area!.lat,
    lng: area!.lng,
    available_from: dateOrNull(str(fd, 'available_from')),
    available_to: dateOrNull(str(fd, 'available_to'))
  };

  if (id) {
    const { data: existing } = await sb.from('resources').select('reserved').eq('id', id).eq('donor_id', user.id).maybeSingle();
    if (!existing) back('/donor', 'error', 'generic');
    if (quantity < existing!.reserved) back(here, 'error', 'reduce');
    const { error } = await sb.from('resources').update(row).eq('id', id).eq('donor_id', user.id);
    if (error) back(here, 'error', 'generic');
  } else {
    const { error } = await sb.from('resources').insert({ ...row, donor_id: user.id });
    if (error) back(here, 'error', 'generic');
  }
  revalidatePath('/donor');
  redirect('/donor?ok=saved');
}

export async function deleteResource(fd: FormData) {
  const { user } = await requireRole('donor');
  const id = str(fd, 'id');
  const sb = createClient();
  const { data } = await sb.from('resources').delete().eq('id', id).eq('donor_id', user.id).eq('reserved', 0).select('id');
  if (!data || data.length === 0) back('/donor', 'error', 'inUse');
  revalidatePath('/donor');
  redirect('/donor?ok=saved');
}
