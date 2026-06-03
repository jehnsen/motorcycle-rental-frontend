
# RentNRide_PH — Frontend

Two-sided motorcycle rental marketplace for the Philippines.

## Tech Stack
- **Next.js 14** App Router, TypeScript
- **Tailwind CSS** with custom dark theme (burnt orange `#E85D24` accents)
- **shadcn/ui** components (Radix UI primitives)
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
   dashboard/          Agency dashboard (protected)
components/
   ui/                 shadcn/ui primitives
   layout/             Navbar, Footer, DashboardSidebar
   marketplace/        BikeCard, SearchBar, FilterPanel, BookingWidget
   dashboard/          StatsCard, FleetTable, BookingTable
lib/
   supabase/           client.ts, server.ts, types.ts
   hooks/              useBikes, useBookings, useAgency, useAuth
   mock/               agencies.ts, bikes.ts, bookings.ts
types/index.ts        Shared TypeScript interfaces
middleware.ts         Protect /dashboard routes
```

## Design Tokens
| Token | Value | Use |
|-------|-------|-----|
| `brand` | `#E85D24` | Primary CTA, accents |
| `brand-dark` | `#C04820` | Hover states |
| `surface` | `#111111` | Card backgrounds |
| `road` | `#0D0D0D` | Page background |

## Features
- 3 agencies, 12 bikes, 10 bookings (mock data)
- Protected dashboard routes
- Dark theme with orange accents
- Responsive design


## test user accounts
juan@rentnride.ph | maria@rentnride.ph
DemoPass123!