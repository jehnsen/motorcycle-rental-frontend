-- RentNRide_PH — initial schema
-- All tables are prefixed with "moto_"

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ──────────────────────────────────────────────────────────────────
do $$ begin
  create type moto_bike_type as enum ('big_bike', 'naked', 'scooter', 'adventure');
exception when duplicate_object then null; end $$;

do $$ begin
  create type moto_booking_status as enum ('pending', 'confirmed', 'active', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type moto_subscription_tier as enum ('free', 'standard', 'premium');
exception when duplicate_object then null; end $$;

-- ─── moto_agencies ──────────────────────────────────────────────────────────
create table if not exists moto_agencies (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  logo_url          text,
  cover_url         text,
  address           text not null,
  city              text not null,
  rating            numeric(3, 2) not null default 0,
  total_reviews     integer not null default 0,
  is_verified       boolean not null default false,
  subscription_tier moto_subscription_tier not null default 'free',
  description       text,
  contact_number    text,
  email             text,
  operating_hours   text,
  response_time     text,
  created_at        timestamptz not null default now()
);

-- ─── moto_bikes ─────────────────────────────────────────────────────────────
create table if not exists moto_bikes (
  id                uuid primary key default uuid_generate_v4(),
  agency_id         uuid not null references moto_agencies(id) on delete cascade,
  brand             text not null,
  model             text not null,
  type              moto_bike_type not null,
  year              smallint not null,
  color             text not null,
  plate_number      text not null unique,
  daily_rate        integer not null,         -- in PHP pesos
  deposit_amount    integer not null,
  min_license_years smallint not null default 0,
  is_available      boolean not null default true,
  images            text[] not null default '{}',
  specs             jsonb not null default '{}',
  created_at        timestamptz not null default now()
);

-- ─── moto_renters ───────────────────────────────────────────────────────────
create table if not exists moto_renters (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  full_name         text not null,
  license_number    text not null,
  license_expiry    date not null,
  id_type           text not null,
  id_number         text not null,
  selfie_url        text,
  is_verified       boolean not null default false,
  is_blacklisted    boolean not null default false,
  blacklist_reason  text,
  unique (user_id)
);

-- ─── moto_bookings ──────────────────────────────────────────────────────────
create table if not exists moto_bookings (
  id             uuid primary key default uuid_generate_v4(),
  bike_id        uuid not null references moto_bikes(id) on delete restrict,
  renter_id      uuid not null references moto_renters(id) on delete restrict,
  agency_id      uuid not null references moto_agencies(id) on delete restrict,
  start_date     date not null,
  end_date       date not null,
  total_amount   integer not null,
  deposit_amount integer not null,
  status         moto_booking_status not null default 'pending',
  payment_method text not null,
  created_at     timestamptz not null default now(),
  constraint end_after_start check (end_date > start_date)
);

-- ─── moto_reviews ───────────────────────────────────────────────────────────
create table if not exists moto_reviews (
  id         uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references moto_bookings(id) on delete cascade,
  renter_id  uuid not null references moto_renters(id) on delete cascade,
  agency_id  uuid not null references moto_agencies(id) on delete cascade,
  bike_id    uuid not null references moto_bikes(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  comment    text not null default '',
  created_at timestamptz not null default now(),
  unique (booking_id)   -- one review per booking
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
create index if not exists idx_moto_bikes_agency_id     on moto_bikes(agency_id);
create index if not exists idx_moto_bikes_type          on moto_bikes(type);
create index if not exists idx_moto_bikes_is_available  on moto_bikes(is_available);
create index if not exists idx_moto_bookings_bike_id    on moto_bookings(bike_id);
create index if not exists idx_moto_bookings_renter_id  on moto_bookings(renter_id);
create index if not exists idx_moto_bookings_agency_id  on moto_bookings(agency_id);
create index if not exists idx_moto_bookings_status     on moto_bookings(status);
create index if not exists idx_moto_reviews_bike_id     on moto_reviews(bike_id);
create index if not exists idx_moto_reviews_agency_id   on moto_reviews(agency_id);

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table moto_agencies  enable row level security;
alter table moto_bikes     enable row level security;
alter table moto_renters   enable row level security;
alter table moto_bookings  enable row level security;
alter table moto_reviews   enable row level security;

-- Public read for agencies and bikes
create policy "agencies_public_read"
  on moto_agencies for select using (true);

create policy "bikes_public_read"
  on moto_bikes for select using (true);

create policy "reviews_public_read"
  on moto_reviews for select using (true);

-- Renters can read/write their own record
create policy "renters_own_read"
  on moto_renters for select using (auth.uid() = user_id);

create policy "renters_own_insert"
  on moto_renters for insert with check (auth.uid() = user_id);

create policy "renters_own_update"
  on moto_renters for update using (auth.uid() = user_id);

-- Renters can read bookings they made; agencies can read bookings for their bikes
create policy "bookings_renter_read"
  on moto_bookings for select
  using (
    renter_id in (select id from moto_renters where user_id = auth.uid())
    or
    agency_id in (select id from moto_agencies where id = agency_id)
  );

create policy "bookings_renter_insert"
  on moto_bookings for insert
  with check (renter_id in (select id from moto_renters where user_id = auth.uid()));
