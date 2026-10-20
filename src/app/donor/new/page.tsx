import { requireRole } from '@/lib/auth';
import { getDict } from '@/lib/i18n/server';
import { Flash } from '@/components/Flash';
import { ResourceForm } from '@/components/ResourceForm';

export const dynamic = 'force-dynamic';

export default async function NewResource({ searchParams }: { searchParams: { error?: string } }) {
  await requireRole('donor');
  const d = getDict();
  return (
    <div className="wrap max-w-2xl py-8">
      <h1 className="h1 mb-4">{d.donor.newTitle}</h1>
      <Flash error={searchParams.error} />
      <ResourceForm d={d} />
    </div>
  );
}
