import { describe, it, expect } from 'vitest';
import { suggestMatch, sortByPriority, type MatchResource, type MatchVolunteer, type MatchRequest } from '../src/lib/matching';

const NOW = new Date('2026-10-11T00:00:00Z');
const school: MatchRequest = { id: 'r1', category: 'education', quantity: 30, needed_by: '2026-10-20', urgency: 2, lat: 4.3685, lng: 100.9665 };

const res = (o: Partial<MatchResource> & { id: string }): MatchResource => ({
  title: 'School kits', category: 'education', condition: 'new', quantity: 10, reserved: 0,
  available_from: '2026-10-10', available_to: '2026-10-30', lat: 4.3836, lng: 100.9686, ...o
});
const vol = (o: Partial<MatchVolunteer> & { id: string }): MatchVolunteer => ({
  vehicle: 'car', capacity: 30, area_km: 20, is_available: true, available_from: '2026-10-10', available_to: '2026-10-30',
  lat: 4.38, lng: 100.97, ...o
});

describe('suggestMatch', () => {
  it('combines two donors (12 + 18) to fulfil a 30-kit request with one volunteer', () => {
    const p = suggestMatch(school, [res({ id: 'a', quantity: 12 }), res({ id: 'b', quantity: 18 })], [vol({ id: 'v1' })], undefined, NOW);
    expect(p.total).toBe(30);
    expect(p.shortfall).toBe(0);
    expect(p.parts).toHaveLength(2);
    expect(p.volunteer?.id).toBe('v1');
    expect(p.trips).toBe(1);
    expect(p.feasible).toBe(true);
  });

  it('never takes more than a donor has left (respects reserved stock)', () => {
    const p = suggestMatch(school, [res({ id: 'a', quantity: 20, reserved: 15 }), res({ id: 'b', quantity: 40 })], [vol({ id: 'v1' })], undefined, NOW);
    const a = p.parts.find((x) => x.resource.id === 'a');
    expect((a?.take ?? 0)).toBeLessThanOrEqual(5);
    expect(p.total).toBe(30);
  });

  it('skips perishable goods, far donors, expired listings and other categories', () => {
    const list = [
      res({ id: 'per', condition: 'perishable', quantity: 30 }),
      res({ id: 'far', quantity: 30, lat: 4.5975, lng: 101.0901 }),
      res({ id: 'old', quantity: 30, available_to: '2026-10-01' }),
      res({ id: 'food', category: 'food', quantity: 30 })
    ];
    const p = suggestMatch(school, list, [vol({ id: 'v1' })], undefined, NOW);
    expect(p.parts).toHaveLength(0);
    expect(p.feasible).toBe(false);
    const reasons = Object.fromEntries(p.rejected.map((r) => [r.resource.id, r.reason]));
    expect(reasons).toMatchObject({ per: 'perishable', far: 'too_far', old: 'schedule' });
    expect(reasons.food).toBeUndefined();
  });

  it('reports a shortfall when supply is not enough', () => {
    const p = suggestMatch(school, [res({ id: 'a', quantity: 12 })], [vol({ id: 'v1' })], undefined, NOW);
    expect(p.total).toBe(12);
    expect(p.shortfall).toBe(18);
    expect(p.feasible).toBe(false);
  });

  it('is not feasible without a suitable volunteer', () => {
    const p = suggestMatch(school, [res({ id: 'a', quantity: 30 })], [vol({ id: 'v1', is_available: false }), vol({ id: 'v2', area_km: 1, lat: 4.5975, lng: 101.0901 })], undefined, NOW);
    expect(p.volunteer).toBeNull();
    expect(p.feasible).toBe(false);
    expect(p.checks.some((c) => c.code === 'no_volunteer')).toBe(true);
  });

  it('prefers a volunteer who can carry everything in one trip, and counts trips otherwise', () => {
    const list = [res({ id: 'a', quantity: 30 })];
    const best = suggestMatch(school, list, [vol({ id: 'bike', capacity: 8 }), vol({ id: 'car', capacity: 30 })], undefined, NOW);
    expect(best.volunteer?.id).toBe('car');
    const onlyBike = suggestMatch(school, list, [vol({ id: 'bike', capacity: 8 })], undefined, NOW);
    expect(onlyBike.volunteer?.id).toBe('bike');
    expect(onlyBike.trips).toBe(4);
  });
});

describe('sortByPriority', () => {
  it('orders by urgency, then earliest deadline', () => {
    const out = sortByPriority([
      { id: 1, urgency: 1, needed_by: '2026-10-12' },
      { id: 2, urgency: 3, needed_by: '2026-10-30' },
      { id: 3, urgency: 3, needed_by: '2026-10-15' }
    ]);
    expect(out.map((x) => x.id)).toEqual([3, 2, 1]);
  });
});
