# KITA - Smart Community Resource Coordination & Matching Platform

UTP CodeFest 2026, Track 3 (Civic Tech and Public Services). Pilot idea: UTP and Seri Iskandar, Perak.
Status: **proposed MVP**. Partnerships and pilot participation are not yet confirmed.

KITA connects verified community needs with donors and volunteers. A rule-based engine suggests
multi-donor allocations and explains its reasoning. A human administrator approves every match.

## Tech stack
| Layer | Technology |
|---|---|
| Web app | Next.js 14 (App Router, Server Components, Server Actions), React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Database, login, security | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| Matching engine | TypeScript, rule-based filtering plus weighted ranking (`src/lib/matching.ts`) |
| Map | Leaflet with OpenStreetMap tiles |
| Tests | Vitest (matching engine) |
| Languages | Bahasa Melayu (default) and English |

## Run it (about 10 minutes)
1. Install **Node.js 20 or newer**, **Git** and **VS Code**.
2. Get the code:
   ```
   git clone https://github.com/wannurhuda/KITA-CODEFEST2026.git
   cd KITA-CODEFEST2026
   ```
3. Create a free project at https://supabase.com.
4. In Supabase open **SQL Editor > New query**, paste all of `supabase/schema.sql`, click **Run**.
5. In Supabase open **Authentication > Providers > Email** and turn **Confirm email** OFF while developing
   (or keep it on and confirm through the email link).
6. In Supabase open **Project Settings > API** and copy the Project URL, `anon` key and `service_role` key.
7. In this folder: copy `.env.example` to `.env.local` and paste the three values.
8. Open a terminal in VS Code (Ctrl+`) and run:
   ```
   npm install
   npm run seed      # optional: demo accounts + the 30 school-kit scenario
   npm run dev
   ```
9. Open http://localhost:3000

### Demo accounts (after `npm run seed`, password `Kita@2026demo`)
| Role | Email |
|---|---|
| Administrator | admin@kita.test |
| Donor (12 kits) | library@kita.test |
| Donor (18 kits) | union@kita.test |
| Community representative (verified) | school@kita.test |
| Volunteer (car, 30 items) | aisyah@kita.test |

### Make your own account an admin
Sign up normally, then run this in the Supabase SQL Editor (replace the email):
```sql
update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
```

### Demo flow for the 3-minute video
1. Log in as `admin@kita.test`, open the 30-school-kit request, click **Review match**.
2. See 12 + 18 kits combined, the volunteer, the explanation, and the skipped perishable bread. Click **Approve**.
3. Log in as `aisyah@kita.test`: **Accept delivery**, then **Mark as delivered**.
4. Log in as `school@kita.test`: **We received the items**.
5. Open **Impact**: the request now counts as fulfilled. Only confirmed deliveries are counted.

## Keeping your keys safe
- Real keys live only in `.env.local`, which is listed in `.gitignore` and is never uploaded to GitHub.
- `.env.example` shows the variable names with empty values. Copy it to `.env.local` and fill it in.
- The `service_role` key has full database access. Never put it in the code, a screenshot or a public chat.
  If it is ever exposed, reset it in Supabase under **Project Settings > API**.
- The `anon` key is designed to be public, but access is still limited by Row Level Security.

## Tests
```
npm test            # 7 tests for the matching engine
npm run typecheck
npm run build
```

## How it maps to the proposal
| Proposal | Where |
|---|---|
| Four roles (donor, community, volunteer, admin) | Supabase Auth + `profiles.role`; pages `/donor`, `/community`, `/volunteer`, `/admin` |
| Only verified organizations post requests | RLS policy on `requests` + admin verification at `/admin` |
| Resource listing (category, quantity, condition, window, area) | `/donor`, table `resources` |
| Matching: compatibility, fulfilment, feasibility, explainability | `src/lib/matching.ts`, `/admin/match/[id]` |
| Human approval required | `approveMatch` server action (admin only; engine re-run on the server) |
| Volunteer availability and assignments | `/volunteer`, tables `volunteers`, `matches` |
| Delivery tracking and receipt confirmation | approved > accepted > delivered > received (enforced by a database trigger) |
| Impact dashboard counts confirmed outcomes only | `public_stats()` SQL function, `/impact` |
| Privacy | general areas only (no addresses); donor stock hidden from the public; row level security on every table |
| Non-perishable pilot rule | perishable items can be listed but are never matched |
| Bilingual (BM / English) | `src/lib/i18n/dict.ts`, BM is the default |
| OpenStreetMap | `/map` |

## Project structure
```
supabase/schema.sql   tables, security policies, triggers
src/lib/matching.ts   matching engine (pure functions, unit tested)
src/lib/i18n/         BM and English text
src/actions/          server actions (all writes)
src/app/              pages
src/components/       shared UI
scripts/seed.mjs      demo data
tests/                engine tests
```

## Updating this repository
```
git add .
git commit -m "describe your change"
git push
```

## Disclosure (required by CodeFest rules)
- **AI tools:** this codebase was drafted with the help of Claude (Anthropic). The team reviewed, tested and is responsible for it.
- **Third-party libraries:** Next.js, React, Tailwind CSS, Supabase JS and SSR packages, Leaflet, Vitest, TypeScript.
- **External services and data:** Supabase (database and auth), OpenStreetMap tiles, Google Fonts (Inter). No external datasets.
  Poverty figures on the About page come from DOSM (Poverty in Malaysia 2024), as cited in the project proposal.
- Demo data is synthetic. Map coordinates for areas are approximate.

## Known limits of this MVP
- Admin approves only fully covered requests (no partial matches yet).
- No email or SMS notifications (status is visible in each dashboard).
- Declined or cancelled deliveries are not re-assigned automatically.
- One organization per community account.
- Matching weights and the 15 km limit are constants in `src/lib/matching.ts` (`DEFAULT_CONFIG`).