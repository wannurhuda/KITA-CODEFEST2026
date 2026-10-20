'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getArea } from '@/lib/areas';
import { back, dateOrNull, str } from '@/lib/action-utils';

export async function saveVolunteer(fd: FormData) {
  const { user } = await requireRole('volunteer');
  const area = getArea(str(fd, 'area'));
  const capacity = Number(str(fd, 'capacity'));
  const areaKm = Number(str(fd, 'area_km'));
  const vehicle = str(fd, 'vehicle');
  if (!area || !['motorbike', 'car', 'van', 'truck'].includes(vehicle)) back('/volunteer', 'error', 'required');
  if (!Number.isInteger(capacity) || capacity < 1 || !Number.isInteger(areaKm) || areaKm < 1) back('/volunteer', 'error', 'quantity');

  const { error } = await createClient().from('volunteers').upsert({
    id: user.id,
    vehicle,
    capacity,
    area_km: areaKm,
    area: area!.name,
    lat: area!.lat,
    lng: area!.lng,
    available_from: dateOrNull(str(fd, 'available_from')),
    available_to: dateOrNull(str(fd, 'available_to')),
    is_available: fd.get('is_available') === 'on'
  });
  if (error) back('/volunteer', 'error', 'generic');
  revalidatePath('/volunteer');
  redirect('/volunteer?ok=saved');
}
