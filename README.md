# Blood Donation System

A React single-page app backed directly by **Supabase** (PostgreSQL + Auth).
There is **no custom backend server** — the frontend talks to Supabase using
the public anon key and Row Level Security.

## Tech Stack

- **Frontend**: React 18, Create React App, Tailwind CSS, React Router
- **Database + Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)

## Architecture

```
my-app/
  src/
    lib/supabaseClient.js     # one shared Supabase client (reads env vars)
    services/                 # all database/auth access lives here
      auth.service.js         # sign up / in / out + profile mapping
      donors.service.js       # donor directory + search + nearby
      reviews.service.js      # donor reviews
      bloodRequests.service.js# requests, responses, donor contacts
      donations.service.js    # history, stats, eligibility, scheduling
      centers.service.js      # donation centers + time slots
      notifications.service.js# per-user notifications
    contexts/AuthContext.js   # session state from Supabase
    pages/ , Components/       # UI only — they call the services
supabase/
  migrations/                 # ordered SQL to build a fresh database
```

The UI never calls Supabase directly; it imports from `services/`. To change
the backend you only touch the service layer, which keeps re-engineering easy.

## Setup on a fresh Supabase account

### 1. Create the database

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run the files in `supabase/migrations/` **in order**:
   `01_init.sql` → `02_profiles.sql` → `03_reviews.sql` → `04_blood_requests.sql`
   → `05_donation_centers.sql` → `06_donations.sql` → `07_notifications.sql`
   → `08_seed.sql` (optional demo data).
   Each file is safe to re-run.

### 2. Configure Auth

In **Authentication → Providers → Email**, for easiest local testing you can
turn **"Confirm email" OFF** so new users can sign in immediately after
registering. (Leave it ON if you want real email confirmation.)

### 3. Run the app

```bash
cd my-app
cp .env.example .env     # then edit .env with your project URL + anon key
npm install
npm start
```

`.env` must contain (from **Supabase → Settings → API**):

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```

CRA only reads env vars at startup, so restart `npm start` after editing `.env`.
The app runs on http://localhost:3000.

## Features

- Email/password auth via Supabase Auth
- Donor directory, search, and reviews
- Blood requests (public + per-user), donor responses and contacts
- Donation history, computed stats and eligibility, appointment scheduling
- Per-user notifications

## Data model

`profiles` (1:1 with `auth.users`), `reviews`, `blood_requests`,
`donor_contacts`, `request_responses`, `donation_centers`, `donations`,
`notifications`. See `supabase/migrations/` for the full schema and RLS
policies.
