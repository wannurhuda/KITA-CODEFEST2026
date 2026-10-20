import { createClient } from '@/lib/supabase/server';

export interface Stats {
  verified_requests: number; fulfilled_requests: number; resources_listed: number; deliveries_completed: number;
  items_redistributed: number; active_volunteers: number; avg_hours_to_match: number | null;
  by_category: { category: string; items: number }[];
}

export async function getStats(): Promise<Stats | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const { data, error } = await createClient().rpc('public_stats');
  if (error || !data) return null;
  return data as Stats;
}
