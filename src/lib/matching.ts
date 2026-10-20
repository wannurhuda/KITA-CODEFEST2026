import { haversineKm, type Point } from './geo';
import type { Category, Condition } from './types';

/**
 * KITA matching engine: transparent, rule-based, with weighted ranking.
 *  1. FILTER   - drop resources that are incompatible or unavailable (category, perishable, distance, dates, stock).
 *  2. RANK     - greedy: repeatedly pick the best-scoring donor until the request is covered
 *                (score = weighted distance + quantity fulfilment + schedule slack).
 *  3. VOLUNTEER- choose a free volunteer whose area, dates and vehicle capacity fit the pickup.
 *  4. EXPLAIN  - return a list of checks the UI shows to admins. A human still approves every match.
 */

export interface MatchRequest extends Point {
  id: string; category: Category; quantity: number; needed_by: string | null; urgency: number;
}
export interface MatchResource extends Point {
  id: string; title: string; category: Category; condition: Condition; quantity: number; reserved: number;
  available_from: string | null; available_to: string | null; donor_label?: string;
}
export interface MatchVolunteer extends Point {
  id: string; name?: string; vehicle: string; capacity: number; area_km: number; is_available: boolean;
  available_from: string | null; available_to: string | null;
}

export interface MatchConfig {
  maxKm: number;
  allowPerishable: boolean;
  weights: { distance: number; fulfilment: number; schedule: number };
}
export const DEFAULT_CONFIG: MatchConfig = {
  maxKm: 15,
  allowPerishable: false, // pilot rule: non-perishable goods only
  weights: { distance: 0.4, fulfilment: 0.4, schedule: 0.2 }
};

export type RejectReason = 'none_left' | 'perishable' | 'too_far' | 'schedule';
export interface Check { code: string; ok: boolean; data?: Record<string, string | number> }
export interface Part { resource: MatchResource; take: number; distKm: number }
export interface Proposal {
  parts: Part[];
  volunteer: MatchVolunteer | null;
  trips: number;
  total: number;
  shortfall: number;
  feasible: boolean;
  score: number;
  checks: Check[];
  rejected: { resource: MatchResource; reason: RejectReason }[];
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000;

function windowOk(from: string | null, to: string | null, neededBy: string | null, today: string): boolean {
  if (to && to < today) return false; // already expired
  if (neededBy && from && from > neededBy) return false; // starts too late
  return true;
}

export function suggestMatch(
  req: MatchRequest,
  resources: MatchResource[],
  volunteers: MatchVolunteer[],
  cfg: MatchConfig = DEFAULT_CONFIG,
  now: Date = new Date()
): Proposal {
  const today = iso(now);
  const rejected: Proposal['rejected'] = [];
  const pool: { r: MatchResource; avail: number; dist: number }[] = [];

  // 1. FILTER
  for (const r of resources) {
    if (r.category !== req.category) continue; // different category: not relevant, not listed
    const avail = r.quantity - r.reserved;
    const dist = haversineKm(r, req);
    if (avail <= 0) { rejected.push({ resource: r, reason: 'none_left' }); continue; }
    if (r.condition === 'perishable' && !cfg.allowPerishable) { rejected.push({ resource: r, reason: 'perishable' }); continue; }
    if (dist > cfg.maxKm) { rejected.push({ resource: r, reason: 'too_far' }); continue; }
    if (!windowOk(r.available_from, r.available_to, req.needed_by, today)) { rejected.push({ resource: r, reason: 'schedule' }); continue; }
    pool.push({ r, avail, dist });
  }

  // 2. RANK + combine several donors (greedy)
  const parts: Part[] = [];
  let remaining = req.quantity;
  const w = cfg.weights;
  while (remaining > 0 && pool.length > 0) {
    let bestIdx = -1;
    let bestScore = -Infinity;
    pool.forEach((c, i) => {
      const fulfil = Math.min(c.avail, remaining) / remaining;
      const distScore = 1 - c.dist / cfg.maxKm;
      const deadline = req.needed_by ?? c.r.available_to ?? null;
      const latest = c.r.available_to && deadline ? (c.r.available_to < deadline ? c.r.available_to : deadline) : deadline;
      const slack = latest ? Math.max(0, daysBetween(today, latest)) : 7;
      const schedScore = Math.min(1, slack / 7);
      const s = w.distance * distScore + w.fulfilment * fulfil + w.schedule * schedScore;
      if (s > bestScore) { bestScore = s; bestIdx = i; }
    });
    const [pick] = pool.splice(bestIdx, 1);
    const take = Math.min(pick.avail, remaining);
    parts.push({ resource: pick.r, take, distKm: pick.dist });
    remaining -= take;
  }
  const total = req.quantity - remaining;

  // 3. VOLUNTEER
  let volunteer: MatchVolunteer | null = null;
  let trips = 0;
  if (parts.length > 0) {
    const eligible = volunteers
      .filter((v) => v.is_available && windowOk(v.available_from, v.available_to, req.needed_by, today))
      .map((v) => ({ v, far: Math.max(...parts.map((p) => haversineKm(v, p.resource))) }))
      .filter((x) => x.far <= x.v.area_km);
    eligible.sort((a, b) => {
      const sa = a.v.capacity >= total ? 0 : 1;
      const sb = b.v.capacity >= total ? 0 : 1;
      if (sa !== sb) return sa - sb;
      if (sa === 0 && a.v.capacity !== b.v.capacity) return a.v.capacity - b.v.capacity; // best fit
      if (sa === 1 && a.v.capacity !== b.v.capacity) return b.v.capacity - a.v.capacity; // largest first
      return a.far - b.far;
    });
    if (eligible.length > 0) {
      volunteer = eligible[0].v;
      trips = Math.ceil(total / volunteer.capacity);
    }
  }

  // 4. EXPLAIN
  const maxDist = parts.length ? Math.max(...parts.map((p) => p.distKm)) : 0;
  const checks: Check[] = [
    { code: 'category', ok: true, data: { category: req.category } },
    { code: 'quantity', ok: remaining === 0, data: { total, needed: req.quantity, donors: parts.length } },
    { code: 'distance', ok: parts.length > 0, data: { max: Math.round(maxDist * 10) / 10, limit: cfg.maxKm } },
    volunteer
      ? { code: 'transport', ok: volunteer.capacity >= total, data: { vehicle: volunteer.vehicle, capacity: volunteer.capacity, trips } }
      : { code: 'no_volunteer', ok: false },
    { code: 'schedule', ok: true, data: { date: req.needed_by ?? '-' } }
  ];

  const coverage = req.quantity ? total / req.quantity : 0;
  const distScore = parts.length ? 1 - maxDist / cfg.maxKm : 0;
  const volScore = volunteer ? (volunteer.capacity >= total ? 1 : 0.5) : 0;
  const score = Math.round(100 * (0.5 * coverage + 0.2 * distScore + 0.3 * volScore));

  return {
    parts, volunteer, trips, total, shortfall: remaining,
    feasible: remaining === 0 && volunteer !== null,
    score, checks, rejected
  };
}

/** Which open requests should an admin look at first: high urgency, then earliest deadline. */
export function sortByPriority<T extends { urgency: number; needed_by: string | null }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => b.urgency - a.urgency || (a.needed_by ?? '9999-12-31').localeCompare(b.needed_by ?? '9999-12-31')
  );
}
