// Creates demo accounts and the school-kit scenario from the proposal.
// Usage: copy .env.example to .env.local, fill the 3 values, then run: npm run seed
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const PASSWORD = 'Kita@2026demo';
const day = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

async function user(email, full_name, role) {
  const { data: list } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  let u = list?.users?.find((x) => x.email === email);
  if (!u) {
    const { data, error } = await sb.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true, user_metadata: { full_name, role } });
    if (error) throw error;
    u = data.user;
  }
  if (role === 'admin') await sb.from('profiles').update({ role: 'admin' }).eq('id', u.id);
  return u.id;
}

const admin = await user('admin@kita.test', 'KITA Admin', 'admin');
const lib = await user('library@kita.test', 'UTP Library Club', 'donor');
const union = await user('union@kita.test', 'UTP Student Union', 'donor');
const school = await user('school@kita.test', 'SK Seri Iskandar Representative', 'community');
const vol = await user('aisyah@kita.test', 'Aisyah Rahman', 'volunteer');

// wipe previous demo rows so the script can be re-run
await sb.from('requests').delete().eq('title', '30 school kits');
await sb.from('resources').delete().in('donor_id', [lib, union]);
await sb.from('organizations').delete().eq('owner_id', school);

const { data: org } = await sb.from('organizations').insert({ owner_id: school, name: 'SK Seri Iskandar', area: 'Bandar Seri Iskandar', verified: true }).select('id').single();
await sb.from('requests').insert({
  org_id: org.id, title: '30 school kits', category: 'education', quantity: 30, urgency: 3, needed_by: day(7),
  description: 'School kits (bag, books, stationery) for primary students.', area: 'Bandar Seri Iskandar', lat: 4.3685, lng: 100.9665
});
await sb.from('resources').insert([
  { donor_id: lib, title: 'School kits', category: 'education', condition: 'new', quantity: 12, pickup_area: 'Universiti Teknologi PETRONAS (UTP)', lat: 4.3836, lng: 100.9686, available_from: day(0), available_to: day(14) },
  { donor_id: union, title: 'School kits', category: 'education', condition: 'good', quantity: 18, pickup_area: 'Universiti Teknologi PETRONAS (UTP)', lat: 4.3836, lng: 100.9686, available_from: day(0), available_to: day(14) },
  { donor_id: union, title: 'Fresh bread', category: 'food', condition: 'perishable', quantity: 15, pickup_area: 'Bandar Seri Iskandar', lat: 4.3685, lng: 100.9665, available_from: day(0), available_to: day(2) }
]);
await sb.from('volunteers').upsert({
  id: vol, vehicle: 'car', capacity: 30, area_km: 20, area: 'Universiti Teknologi PETRONAS (UTP)', lat: 4.3836, lng: 100.9686,
  available_from: day(0), available_to: day(14), is_available: true
});

console.log('Demo data ready. Password for all accounts:', PASSWORD);
console.log(['admin@kita.test', 'library@kita.test', 'union@kita.test', 'school@kita.test', 'aisyah@kita.test'].join('\n'));
