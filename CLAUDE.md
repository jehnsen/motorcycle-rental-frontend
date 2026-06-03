# RentNRide_PH — Frontend

Two-sided motorcycle rental marketplace for the Philippines.

## Tech Stack
- **Next.js 14** App Router, TypeScript
- **Tailwind CSS** with custom dark theme (burnt orange `#E85D24` accents)
- **shadcn/ui** components (Radix UI primitives, built from source in `/components/ui`)
- **Supabase** integration-ready (mock data active by default)
- **Lucide React** icons

## Quick Start
```bash
npm install
npm run dev        # http://localhost:3000
```

Copy `.env.local.example` to `.env.local` and fill Supabase credentials when ready.

## Project Structure
```
app/                  Pages (Next.js App Router)
  layout.tsx          Root layout — Navbar + Footer
  page.tsx            Landing page
  browse/             Bike search + listing
  agencies/           Agency directory + profiles
  how-it-works/       Explainer page
  auth/               Login + Register
  dashboard/          Agency dashboard (protected)
components/
  ui/                 shadcn/ui primitives (built from source)
  layout/             Navbar, Footer, DashboardSidebar
  marketplace/        BikeCard, SearchBar, FilterPanel, BookingWidget...
  dashboard/          StatsCard, FleetTable, BookingTable, RenterCard
  shared/             BikeTypeBadge, RatingStars, PriceDisplay...
lib/
  supabase/           client.ts, server.ts, types.ts
  hooks/              useBikes, useBookings, useAgency, useAuth
  mock/               agencies.ts, bikes.ts, bookings.ts (12 bikes, 3 agencies)
  utils.ts            cn(), formatPrice(), getStatusColor()...
types/index.ts        Shared TypeScript interfaces
middleware.ts         Protect /dashboard routes
```

## Design Tokens
| Token | Value | Use |
|-------|-------|-----|
| `brand` | `#E85D24` | Primary CTA, accents |
| `brand-dark` | `#C04820` | Hover states |
| `surface` | `#111111` | Card backgrounds |
| `surface-2` | `#1A1A1A` | Elevated surfaces |
| `surface-3` | `#242424` | Input backgrounds |
| `road` | `#0D0D0D` | Page background |

Custom utilities: `.asphalt-texture`, `.card-hover`, `.orange-glow`, `.text-gradient-orange`

## Mock Data
- 3 agencies: Revo Rentals Makati, AdventureRide Cebu, NorthRide Baguio
- 12 bikes: Yamaha MT-07, Kawasaki Z400, Honda CB500F, Royal Enfield Himalayan, Honda ADV160, Yamaha NMAX 155, and more
- 10 bookings (mix of statuses), 5 renters

## Supabase
When ready to connect: add env vars, swap mock imports for Supabase queries in pages/hooks.
Dashboard is protected by middleware — redirects to `/auth/login` when session is missing.
