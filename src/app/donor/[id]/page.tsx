import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getDict } from '@/lib/i18n/server';
import { Flash } from '@/components/Flash';
import { ResourceForm } from '@/components/ResourceForm';
import type { Resource } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditResource({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  const { user } = await requireRole('donor');
  const d = getDict();
  const { data } = await createClient().from('resources').select('*').eq('id', params.id).eq('donor_id', user.id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="wrap max-w-2xl py-8">
      <h1 className="h1 mb-4">{d.donor.editTitle}</h1>
      <Flash error={searchParams.error} />
      <ResourceForm d={d} resource={data as Resource} />
    </div>
  );
}
