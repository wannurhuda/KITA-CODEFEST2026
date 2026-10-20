# 🤝 KITA - Smart Community Resource Coordination & Matching Platform

**UTP CodeFest 2026 Submission | Track 3: Civic Tech and Public Services**

A web platform that connects verified community needs with donors and volunteers. A transparent matching engine suggests how to fulfil a request, explains its reasoning, and a human administrator approves every match.

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)


---

## 📋 Table of Contents
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [SDG Alignment](#-sdg-alignment)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [How the Matching Works](#-how-the-matching-works)
- [Getting Started](#-getting-started)
- [Demo Accounts and Demo Flow](#-demo-accounts-and-demo-flow)
- [Tests](#-tests)
- [How It Maps to the Proposal](#-how-it-maps-to-the-proposal)
- [Project Structure](#-project-structure)
- [Security and Privacy](#-security-and-privacy)
- [Known Limits](#-known-limits-of-this-mvp)
- [Future Ideas](#-future-ideas)
- [Team](#-team)
- [Disclosure](#-disclosure)

---

## 🌍 Problem Statement

**The challenge:**

Communities need essential supplies, while donors and volunteers are ready to help. But they often do not find each other.

- **Needs are hard to see.** Donors do not know what is needed, where, or how urgently.
- **Information is scattered.** Offers sit in chat groups, social media and personal contacts.
- **Matching is manual.** One request may need several donors, and combining them takes a lot of effort.
- **Delivery is hard to arrange.** Even after a match, there may be no volunteer or transport.
- **Progress is not tracked.** Nobody can easily see what is reserved, delivered or still waiting.
- **Resources go unused.** Useful items can be wasted when no recipient is found in time.

**Example:** a university club has 40 unused school kits, a nearby community needs 25, and a volunteer is free to drive. Without a shared system, none of them know about each other.

---

## 💡 Our Solution

**KITA** coordinates the full journey, from a verified need to a confirmed delivery.

### 1️⃣ Needs-First Requests
- Only **verified** community organizations can post requests
- Each request has a category, quantity, general area, urgency and time window

### 2️⃣ Explainable Matching
- Combines **several donors** to fill one request
- Recommends a **volunteer** who can carry the items
- Shows **why** the match was suggested, and which items were skipped

### 3️⃣ Human Approval and Tracking
- An administrator **approves every match**
- Delivery status is tracked: approved, accepted, delivered, received
- The impact dashboard counts **confirmed deliveries only**

**KITA does not replace charities or community groups. It gives them shared tools to coordinate.**

---

## 🎯 SDG Alignment

KITA supports the principles of civic participation, responsible resource use and community collaboration.

| SDG | How KITA contributes |
|---|---|
| **SDG 1** No Poverty | Directs essential supplies to communities that have a verified need |
| **SDG 2** Zero Hunger | Allows food and basic supplies to be requested and matched |
| **SDG 11** Sustainable Cities and Communities | Builds stronger, better-connected local communities |
| **SDG 12** Responsible Consumption and Production | Reduces waste by finding recipients for unused items |
| **SDG 17** Partnerships for the Goals | Brings donors, volunteers, organizations and administrators together |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Web app | Next.js 14 (App Router, Server Components, Server Actions), React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Database, login, security | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| Matching engine | TypeScript, rule-based filtering plus weighted ranking (`src/lib/matching.ts`) |
| Map | Leaflet with OpenStreetMap tiles |
| Tests | Vitest (matching engine) |
| Languages | Bahasa Melayu (default) and English |

---

## ✨ Key Features

### 1. Four Roles
| Role | What they do |
|---|---|
| 🎁 **Donor** | Lists available resources (category, quantity, condition, pickup area, time window) |
| 🏘️ **Community representative** | Submits requests for their verified organization and confirms receipt |
| 🚗 **Volunteer** | Sets availability, area and carrying capacity, then accepts and updates deliveries |
| 🛡️ **Administrator** | Verifies organizations, reviews suggested matches and approves them |

### 2. Matching Review Page
- Shows the donors, quantities and volunteer chosen for a request
- Explains the reasoning in plain language
- Lists items that were skipped (for example, perishable food)

### 3. Delivery Tracking
```
approved  >  accepted  >  delivered  >  received
```
The order is enforced by a database trigger, so a step cannot be skipped.

### 4. Impact Dashboard
Counts fulfilled requests, delivered items and active volunteers. **Only confirmed outcomes are counted.**

### 5. Map and Language
- `/map` shows needs and resources by general area using OpenStreetMap
- Switch between **Bahasa Melayu** and **English** at any time

---

## 🧠 How the Matching Works

The prototype uses a transparent, rule-based method:

1. **Filter** out resources that are incompatible or unavailable (wrong category, perishable, outside the time window, too far)
2. **Rank** the rest using a weighted score of urgency, distance, quantity fulfilment and schedule fit
3. **Combine** donors with a greedy allocation until the request is covered
4. **Pick a volunteer** whose availability and capacity fit
5. **Explain** the result so the administrator can review it

Example from the demo: a verified request for **30 school kits** is filled by **12 kits (Donor A) + 18 kits (Donor B)**, with one volunteer recommended for transport.

Weights and the 15 km distance limit are constants in `src/lib/matching.ts` (`DEFAULT_CONFIG`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or newer
- Git and VS Code
- A free Supabase account

### Installation (about 10 minutes)

#### 1. Clone the repository
```bash
git clone https://github.com/wannurhuda/KITA-CODEFEST2026.git
cd KITA-CODEFEST2026
```

#### 2. Create the database
1. Create a free project at https://supabase.com
2. Open **SQL Editor > New query**, paste all of `supabase/schema.sql`, click **Run**
3. Open **Authentication > Providers > Email** and turn **Confirm email** OFF while developing (or keep it on and confirm through the email link)

#### 3. Add your keys
1. In Supabase open **Project Settings > API** and copy the Project URL, `anon` key and `service_role` key
2. Copy `.env.example` to `.env.local` and paste the three values:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

⚠️ **Security note:** never commit `.env.local`. It is already listed in `.gitignore`.

#### 4. Install and run
```bash
npm install
npm run seed      # optional: demo accounts + the 30 school-kit scenario
npm run dev
```

#### 5. Open the app
Go to http://localhost:3000

### Make your own account an admin
Sign up normally, then run this in the Supabase SQL Editor (replace the email):
```sql
update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
```

---

## 🎬 Demo Accounts and Demo Flow

### Demo accounts (after `npm run seed`, password `Kita@2026demo`)
| Role | Email |
|---|---|
| Administrator | admin@kita.test |
| Donor (12 kits) | library@kita.test |
| Donor (18 kits) | union@kita.test |
| Community representative (verified) | school@kita.test |
| Volunteer (car, 30 items) | aisyah@kita.test |

---

## 🧪 Tests

```bash
npm test            # 7 tests for the matching engine
npm run typecheck
npm run build
```

---

## 🗺️ How It Maps to the Proposal

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

---

## 📄 Project Structure

```
KITA-CODEFEST2026/
├── supabase/
│   └── schema.sql          # tables, security policies, triggers
├── src/
│   ├── app/                # pages (donor, community, volunteer, admin, map, impact...)
│   ├── actions/            # server actions (all writes)
│   ├── components/         # shared UI
│   └── lib/
│       ├── matching.ts     # matching engine (pure functions, unit tested)
│       ├── i18n/           # BM and English text
│       └── supabase/       # Supabase client helpers
├── scripts/
│   └── seed.mjs            # demo data
├── tests/                  # matching engine tests
├── .env.example            # variable names only (no real keys)
└── README.md               # this file
```

---

## 🔒 Security and Privacy

### Keeping keys safe
- Real keys live only in `.env.local`, which is in `.gitignore` and never uploaded to GitHub
- `.env.example` shows the variable names with empty values
- The `service_role` key has full database access. Never put it in the code, a screenshot or a public chat. If it is ever exposed, reset it in Supabase under **Project Settings > API**
- The `anon` key is designed to be public, and access is still limited by Row Level Security

### User privacy
- Only general areas are shown, never exact addresses
- Donor stock is hidden from the public
- Row Level Security is enabled on every table
- Matches are approved by an admin, and the engine is re-run on the server at approval time

---

## ⚠️ Known Limits of This MVP

- Admin approves only fully covered requests (no partial matches yet)
- No email or SMS notifications (status is visible in each dashboard)
- Declined or cancelled deliveries are not re-assigned automatically
- One organization per community account
- Demo data is synthetic and map coordinates for areas are approximate

---

## 🔮 Future Ideas

- Partial matches and automatic re-assignment of cancelled deliveries
- Email or SMS notifications
- AI-assisted request entry in Bahasa Melayu or English (for example, "Kami perlukan 20 beg sekolah untuk pelajar"), always confirmed by the user
- More advanced allocation methods, such as constrained assignment or integer linear programming
- Small-scale pilot with UTP and nearby communities, with stakeholder interviews and usability testing

---

## 👥 Team

**👤 WAN NUR HUDA BINTI WAN MOKHTAR** 
- University: Universiti Teknologi PETRONAS
- GitHub: [@wannurhuda](https://github.com/wannurhuda)

**👤 NUR UZMA BATRISYIA BINTI MOHD YUSOF** 
- University: Universiti Teknologi PETRONAS

**👤 NUR SYAFIQAH IZZATI BINTI LOKMAN** 
- University: Universiti Teknologi PETRONAS

**👤 NURUL FATEHA BINTI DESMAWARDI** 
- University: Universiti Teknologi PETRONAS

---

## 📜 Disclosure

Required by CodeFest rules.

- **AI tools:** this codebase was drafted with the help of Claude (Anthropic). The team reviewed, tested and is responsible for it.
- **Third-party libraries:** Next.js, React, Tailwind CSS, Supabase JS and SSR packages, Leaflet, Vitest, TypeScript.
- **External services and data:** Supabase (database and auth), OpenStreetMap tiles, Google Fonts (Inter). No external datasets. Poverty figures on the About page come from DOSM (Poverty in Malaysia 2024), as cited in the project proposal.
- **Demo data** is synthetic.

---

## 🔄 Updating This Repository

```bash
git add .
git commit -m "describe your change"
git push
```

---

<div align="center">

**🤝 Built for UTP CodeFest 2026 🤝**

*Connecting needs, donors and volunteers, one verified match at a time*

[![GitHub](https://img.shields.io/badge/GitHub-KITA--CODEFEST2026-181717?logo=github)](https://github.com/wannurhuda/KITA-CODEFEST2026)
[![Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?logo=nextdotjs)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)

</div>