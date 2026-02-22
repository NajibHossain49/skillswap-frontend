# SkillSwap Frontend

A production-ready Next.js 15 frontend for the SkillSwap peer-to-peer skill exchange platform. Features a distinctive dark aesthetic built with Tailwind CSS, React Query, and Zustand.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | v15.1 | React framework with App Router |
| React | v19 | UI library |
| TypeScript | v5.6 | Type safety |
| Tailwind CSS | v3.4 | Styling |
| TanStack Query | v5.62 | Server state & caching |
| Zustand | v5.0 | Client state (auth) |
| React Hook Form | v7.54 | Form management |
| Zod | v3.23 | Schema validation |
| Axios | v1.7 | HTTP client with token refresh |
| Recharts | v2.14 | Charts & analytics |
| Sonner | v1.7 | Toast notifications |
| Lucide React | v0.468 | Icons |

---

## Features

- **Authentication**: Login, register, JWT with automatic token refresh & rotation
- **Role-Based UI**: Different dashboards and actions for Admin, Mentor, Learner
- **Skills Library**: Browse, search, filter by category, create/edit/delete
- **Sessions**: Create, book, update status, leave feedback with star rating
- **Admin Panel**: User management table with role assignment, activate/deactivate, delete
- **Dashboards**: Role-specific stats, charts (Recharts PieChart), recent activity
- **Profile**: Edit name/bio, view personal stats
- **UX**: Loading skeletons, empty states, modals, toast notifications, pagination

---

## Design System

**Aesthetic**: Dark editorial — sophisticated dark UI with a distinctive violet accent. Clean typographic hierarchy with Syne (display) and DM Sans (body).

**Color Palette**:
- `ink` — Near-black base (#0A0A0F to #F5F5F7)  
- `accent` — Violet (#6C63FF)  
- `sage` — Emerald green (#3ECF8E)  
- `amber` — Gold (#F59E0B)  
- `rose` — Crimson (#F43F5E)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Split-panel auth layout
│   │   ├── login/page.tsx      # Login with demo credentials
│   │   └── register/page.tsx   # Register with role selection
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar layout with auth guard
│   │   ├── dashboard/page.tsx  # Role-specific dashboard
│   │   ├── skills/
│   │   │   ├── page.tsx        # Skills grid with search/filter
│   │   │   └── [id]/page.tsx   # Skill detail with sessions
│   │   ├── sessions/
│   │   │   ├── page.tsx        # Sessions with status filter
│   │   │   └── [id]/page.tsx   # Session detail with actions
│   │   ├── admin/page.tsx      # Admin dashboard + user table
│   │   └── profile/page.tsx    # Profile editor + stats
│   ├── globals.css
│   ├── layout.tsx              # Root layout with providers
│   └── providers.tsx           # React Query provider
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Button variants
│   │   ├── Input.tsx           # Form input with icon/error
│   │   └── index.tsx           # Card, Badge, Avatar, Modal, Select, Textarea, etc.
│   └── layout/
│       ├── Sidebar.tsx         # Navigation sidebar
│       └── Header.tsx          # Page header with user info
├── hooks/
│   ├── useAuth.ts              # Auth actions (login/register/logout)
│   ├── useSkills.ts            # Skills CRUD with React Query
│   └── useSessions.ts          # Sessions CRUD with React Query
├── lib/
│   ├── api.ts                  # Axios instance + token refresh interceptor
│   ├── api-services.ts         # Typed API functions for all endpoints
│   └── utils.ts                # Helpers (cn, formatDate, statusColors, etc.)
├── store/
│   └── auth.ts                 # Zustand auth store (persisted)
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- SkillSwap backend running on `http://localhost:3000`

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run development server

```bash
npm run dev
```

App runs at `http://localhost:3001` (or next available port)

### 4. Build for production

```bash
npm run build
npm start
```

---

## Quick Login (Demo)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillswap.com | Admin@123 |
| Mentor | mentor@skillswap.com | Mentor@123 |
| Learner | learner@skillswap.com | Learner@123 |

> Ensure the backend is seeded: `npm run db:seed` in the backend project.

---

## API Integration

All API calls go through `src/lib/api-services.ts`. The Axios instance in `src/lib/api.ts` automatically:

1. Attaches the `Authorization: Bearer <token>` header
2. On 401 responses, attempts to refresh the token
3. Retries the original request with the new token
4. Redirects to `/login` if refresh fails

**Token storage**: Access and refresh tokens are stored in `localStorage`. The Zustand store (persisted to `localStorage`) keeps user state.

---

## Role-Based Features

### Admin
- Full dashboard with user/skill/session stats and PieChart
- Admin Panel: search/filter users, change roles, activate/deactivate, delete
- Access to all sessions and skills

### Mentor  
- Dashboard with personal session stats (total, completed, scheduled, avg rating)
- Create/edit/delete own skills
- Create sessions, mark as completed, cancel
- View session stats

### Learner
- Dashboard with booked sessions overview
- Browse all skills and sessions
- Book PENDING sessions
- Cancel booked sessions, leave feedback on completed sessions

---

## Key Patterns

**Data fetching**: TanStack Query with typed query keys and automatic cache invalidation on mutations.

**Forms**: React Hook Form + Zod resolvers for all forms (login, register, create skill, create session, etc.)

**Optimistic updates**: Queries are invalidated on successful mutations so UI stays fresh.

**Error handling**: All mutations catch errors and display toast notifications via Sonner.
