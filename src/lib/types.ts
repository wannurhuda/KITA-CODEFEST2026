export type Role = 'donor' | 'community' | 'volunteer' | 'admin';
export type Category = 'food' | 'education' | 'hygiene' | 'essentials' | 'others';
export type Condition = 'new' | 'good' | 'perishable';

export const CATEGORIES: Category[] = ['food', 'education', 'hygiene', 'essentials', 'others'];
export const CONDITIONS: Condition[] = ['new', 'good', 'perishable'];

export interface Profile { id: string; full_name: string; role: Role }
export interface Organization { id: string; owner_id: string; name: string; area: string; verified: boolean }

export interface Resource {
  id: string; donor_id: string; title: string; category: Category; description: string;
  condition: Condition; quantity: number; reserved: number; delivered: number;
  pickup_area: string; lat: number; lng: number;
  available_from: string | null; available_to: string | null;
}

export interface RequestRow {
  id: string; org_id: string; title: string; category: Category; description: string;
  quantity: number; urgency: 1 | 2 | 3; needed_by: string | null; area: string;
  lat: number; lng: number; status: 'open' | 'matched' | 'fulfilled' | 'cancelled';
  organizations?: { name: string; area: string } | null;
}

export interface VolunteerRow {
  id: string; vehicle: string; capacity: number; area_km: number; area: string;
  lat: number; lng: number; available_from: string | null; available_to: string | null;
  is_available: boolean;
}

export type MatchStatus = 'proposed' | 'approved' | 'accepted' | 'delivered' | 'received' | 'declined';

export function resourceStatus(r: Pick<Resource, 'quantity' | 'reserved' | 'delivered'>):
  'available' | 'partial' | 'matched' | 'completed' {
  if (r.delivered >= r.quantity) return 'completed';
  if (r.reserved >= r.quantity) return 'matched';
  if (r.reserved > 0) return 'partial';
  return 'available';
}
