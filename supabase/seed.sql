-- ============================================================
-- RentNRide_PH — Seed Data
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Required for password hashing and UUID generation
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- 1. AUTH USERS  (for the 5 demo renters)
-- ─────────────────────────────────────────────────────────────
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values
  (
    '00000001-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'juan@rentnride.ph',
    crypt('DemoPass123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000001-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'maria@rentnride.ph',
    crypt('DemoPass123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000001-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'carlo@rentnride.ph',
    crypt('DemoPass123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000001-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ana@rentnride.ph',
    crypt('DemoPass123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000001-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'miguel@rentnride.ph',
    crypt('DemoPass123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  )
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 2. AGENCIES
-- ─────────────────────────────────────────────────────────────
insert into moto_agencies (
  id, name, slug, address, city,
  rating, total_reviews, is_verified, subscription_tier,
  description, contact_number, email, operating_hours, response_time
) values
  (
    '00000002-0000-0000-0000-000000000001',
    'Revo Rentals Makati',
    'revo-rentals-makati',
    'G/F Makati Ave cor Dela Rosa St., Makati City',
    'Makati City',
    4.8, 214, true, 'premium',
    'Makati''s premier motorcycle rental service. We specialize in premium big bikes and nakeds for riders who demand the best. Full gear rental available.',
    '+63 917 123 4567',
    'rentals@revorentals.ph',
    'Mon-Sun 8:00 AM – 7:00 PM',
    '~15 minutes'
  ),
  (
    '00000002-0000-0000-0000-000000000002',
    'AdventureRide Cebu',
    'adventureride-cebu',
    '123 Osmena Blvd, Cebu City, Cebu',
    'Cebu City',
    4.6, 187, true, 'standard',
    'Your gateway to Cebu''s best roads. We offer adventure-ready bikes perfect for exploring the island. Helmets and gear included.',
    '+63 932 567 8901',
    'hello@adventureride.ph',
    'Mon-Sat 8:00 AM – 6:00 PM',
    '~30 minutes'
  ),
  (
    '00000002-0000-0000-0000-000000000003',
    'NorthRide Baguio',
    'northride-baguio',
    '45 Session Road, Baguio City, Benguet',
    'Baguio City',
    4.7, 143, true, 'standard',
    'Conquer the Cordillera mountain roads with our fleet of rugged and capable motorcycles. Perfect for the Sagada loop and scenic mountain routes.',
    '+63 918 901 2345',
    'ride@northride.ph',
    'Mon-Sun 7:00 AM – 6:00 PM',
    '~20 minutes'
  )
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 3. BIKES  (12 total)
-- ─────────────────────────────────────────────────────────────
insert into moto_bikes (
  id, agency_id, brand, model, type, year, color,
  plate_number, daily_rate, deposit_amount, min_license_years,
  is_available, images, specs
) values
  -- Revo Rentals Makati ─────────────────────────────────────
  (
    '00000003-0000-0000-0000-000000000001',
    '00000002-0000-0000-0000-000000000001',
    'Yamaha', 'MT-07', 'big_bike', 2023, 'Midnight Black',
    'MGC 1234', 3500, 5000, 2, true, '{}',
    '{"engine":"689cc parallel-twin","transmission":"6-speed manual","fuel_type":"Gasoline","mileage":"18,500 km","weight":"193 kg","seat_height":"805 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000002',
    '00000002-0000-0000-0000-000000000001',
    'Kawasaki', 'Z400', 'naked', 2022, 'Metallic Spark Black',
    'MGC 5678', 2500, 4000, 1, true, '{}',
    '{"engine":"399cc parallel-twin","transmission":"6-speed manual","fuel_type":"Gasoline","mileage":"12,300 km","weight":"167 kg","seat_height":"785 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000003',
    '00000002-0000-0000-0000-000000000001',
    'Honda', 'CB500F', 'naked', 2022, 'Pearl Smoky Gray',
    'MGD 2109', 2200, 3500, 1, false, '{}',
    '{"engine":"471cc parallel-twin","transmission":"6-speed manual","fuel_type":"Gasoline","mileage":"9,800 km","weight":"188 kg","seat_height":"790 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000004',
    '00000002-0000-0000-0000-000000000001',
    'Yamaha', 'Aerox 155', 'scooter', 2023, 'Matte Dark Gray',
    'MGC 8843', 850, 2000, 0, true, '{}',
    '{"engine":"155cc single-cylinder SOHC","transmission":"CVT automatic","fuel_type":"Gasoline","mileage":"6,200 km","weight":"99 kg","seat_height":"795 mm"}'
  ),
  -- AdventureRide Cebu ──────────────────────────────────────
  (
    '00000003-0000-0000-0000-000000000005',
    '00000002-0000-0000-0000-000000000002',
    'Royal Enfield', 'Himalayan', 'adventure', 2022, 'Mirage Silver',
    'CEB 4421', 2800, 4500, 1, true, '{}',
    '{"engine":"411cc single-cylinder SOHC","transmission":"5-speed manual","fuel_type":"Gasoline","mileage":"15,100 km","weight":"199 kg","seat_height":"800 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000006',
    '00000002-0000-0000-0000-000000000002',
    'Honda', 'ADV160', 'adventure', 2023, 'Pearl Glare White',
    'CEB 3312', 1500, 3000, 0, true, '{}',
    '{"engine":"157cc single-cylinder SOHC","transmission":"CVT automatic","fuel_type":"Gasoline","mileage":"4,500 km","weight":"131 kg","seat_height":"795 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000007',
    '00000002-0000-0000-0000-000000000002',
    'Yamaha', 'NMAX 155', 'scooter', 2023, 'Matte Blue',
    'CEB 7789', 900, 2000, 0, true, '{}',
    '{"engine":"155cc single-cylinder SOHC","transmission":"CVT automatic","fuel_type":"Gasoline","mileage":"7,800 km","weight":"127 kg","seat_height":"765 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000008',
    '00000002-0000-0000-0000-000000000002',
    'Honda', 'PCX 160', 'scooter', 2023, 'Mat Jeans Blue Metallic',
    'CEB 9901', 950, 2000, 0, false, '{}',
    '{"engine":"157cc single-cylinder SOHC","transmission":"CVT automatic","fuel_type":"Gasoline","mileage":"5,600 km","weight":"131 kg","seat_height":"764 mm"}'
  ),
  -- NorthRide Baguio ────────────────────────────────────────
  (
    '00000003-0000-0000-0000-000000000009',
    '00000002-0000-0000-0000-000000000003',
    'Yamaha', 'XSR155', 'naked', 2022, 'Heritage White',
    'BAG 1102', 1200, 2500, 0, true, '{}',
    '{"engine":"155cc single-cylinder SOHC","transmission":"6-speed manual","fuel_type":"Gasoline","mileage":"11,200 km","weight":"134 kg","seat_height":"810 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000010',
    '00000002-0000-0000-0000-000000000003',
    'Royal Enfield', 'Bullet 350', 'big_bike', 2022, 'Black',
    'BAG 2205', 2000, 3500, 1, true, '{}',
    '{"engine":"349cc single-cylinder SOHC","transmission":"5-speed manual","fuel_type":"Gasoline","mileage":"13,400 km","weight":"195 kg","seat_height":"800 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000011',
    '00000002-0000-0000-0000-000000000003',
    'Honda', 'CT125 Hunter Cub', 'adventure', 2023, 'Pearl Organic Green',
    'BAG 3308', 1800, 3000, 0, true, '{}',
    '{"engine":"125cc single-cylinder SOHC","transmission":"4-speed manual","fuel_type":"Gasoline","mileage":"3,200 km","weight":"107 kg","seat_height":"800 mm"}'
  ),
  (
    '00000003-0000-0000-0000-000000000012',
    '00000002-0000-0000-0000-000000000003',
    'Yamaha', 'MT-15', 'naked', 2022, 'Cyber Gray',
    'BAG 4411', 1500, 2500, 0, true, '{}',
    '{"engine":"155cc single-cylinder SOHC","transmission":"6-speed manual","fuel_type":"Gasoline","mileage":"8,900 km","weight":"138 kg","seat_height":"810 mm"}'
  )
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 4. RENTERS  (references auth.users inserted above)
-- ─────────────────────────────────────────────────────────────
insert into moto_renters (
  id, user_id, full_name, license_number, license_expiry,
  id_type, id_number, is_verified, is_blacklisted, blacklist_reason
) values
  (
    '00000004-0000-0000-0000-000000000001',
    '00000001-0000-0000-0000-000000000001',
    'Juan Dela Cruz', 'N01-23-456789', '2027-08-15',
    'Philippine Passport', 'P1234567A',
    true, false, null
  ),
  (
    '00000004-0000-0000-0000-000000000002',
    '00000001-0000-0000-0000-000000000002',
    'Maria Santos', 'C04-21-112233', '2025-03-22',
    'UMID', '12-3456789-0',
    true, false, null
  ),
  (
    '00000004-0000-0000-0000-000000000003',
    '00000001-0000-0000-0000-000000000003',
    'Carlo Reyes', 'A01-20-998877', '2026-11-30',
    'Driver''s License', 'N01-20-998877',
    false, false, null
  ),
  (
    '00000004-0000-0000-0000-000000000004',
    '00000001-0000-0000-0000-000000000004',
    'Ana Gonzales', 'B03-19-556677', '2024-06-15',
    'SSS ID', '34-5678901-2',
    true, true, 'Returned bike with major damage, refused to pay.'
  ),
  (
    '00000004-0000-0000-0000-000000000005',
    '00000001-0000-0000-0000-000000000005',
    'Miguel Torres', 'D02-22-334455', '2028-02-10',
    'Philippine Passport', 'P9876543B',
    true, false, null
  )
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 5. BOOKINGS  (10 total, mix of statuses)
-- ─────────────────────────────────────────────────────────────
insert into moto_bookings (
  id, bike_id, renter_id, agency_id,
  start_date, end_date,
  total_amount, deposit_amount,
  status, payment_method
) values
  (
    '00000005-0000-0000-0000-000000000001',
    '00000003-0000-0000-0000-000000000001', -- MT-07
    '00000004-0000-0000-0000-000000000001', -- Juan
    '00000002-0000-0000-0000-000000000001', -- Revo Makati
    '2024-07-10', '2024-07-13',
    10500, 5000, 'completed', 'GCash'
  ),
  (
    '00000005-0000-0000-0000-000000000002',
    '00000003-0000-0000-0000-000000000005', -- Himalayan
    '00000004-0000-0000-0000-000000000002', -- Maria
    '00000002-0000-0000-0000-000000000002', -- AdventureRide Cebu
    '2024-07-20', '2024-07-22',
    5600, 4500, 'confirmed', 'Maya'
  ),
  (
    '00000005-0000-0000-0000-000000000003',
    '00000003-0000-0000-0000-000000000009', -- XSR155
    '00000004-0000-0000-0000-000000000005', -- Miguel
    '00000002-0000-0000-0000-000000000003', -- NorthRide Baguio
    '2024-07-25', '2024-07-28',
    3600, 2500, 'active', 'GCash'
  ),
  (
    '00000005-0000-0000-0000-000000000004',
    '00000003-0000-0000-0000-000000000002', -- Z400
    '00000004-0000-0000-0000-000000000003', -- Carlo
    '00000002-0000-0000-0000-000000000001', -- Revo Makati
    '2024-08-01', '2024-08-03',
    5000, 4000, 'pending', 'Cash'
  ),
  (
    '00000005-0000-0000-0000-000000000005',
    '00000003-0000-0000-0000-000000000006', -- ADV160
    '00000004-0000-0000-0000-000000000001', -- Juan
    '00000002-0000-0000-0000-000000000002', -- AdventureRide Cebu
    '2024-08-05', '2024-08-08',
    4500, 3000, 'confirmed', 'GCash'
  ),
  (
    '00000005-0000-0000-0000-000000000006',
    '00000003-0000-0000-0000-000000000011', -- CT125
    '00000004-0000-0000-0000-000000000005', -- Miguel
    '00000002-0000-0000-0000-000000000003', -- NorthRide Baguio
    '2024-06-15', '2024-06-18',
    5400, 3000, 'completed', 'Maya'
  ),
  (
    '00000005-0000-0000-0000-000000000007',
    '00000003-0000-0000-0000-000000000004', -- Aerox
    '00000004-0000-0000-0000-000000000004', -- Ana
    '00000002-0000-0000-0000-000000000001', -- Revo Makati
    '2024-05-20', '2024-05-23',
    2550, 2000, 'cancelled', 'GCash'
  ),
  (
    '00000005-0000-0000-0000-000000000008',
    '00000003-0000-0000-0000-000000000007', -- NMAX
    '00000004-0000-0000-0000-000000000002', -- Maria
    '00000002-0000-0000-0000-000000000002', -- AdventureRide Cebu
    '2024-07-12', '2024-07-14',
    1800, 2000, 'completed', 'Cash'
  ),
  (
    '00000005-0000-0000-0000-000000000009',
    '00000003-0000-0000-0000-000000000010', -- Bullet 350
    '00000004-0000-0000-0000-000000000003', -- Carlo
    '00000002-0000-0000-0000-000000000003', -- NorthRide Baguio
    '2024-08-10', '2024-08-12',
    4000, 3500, 'pending', 'GCash'
  ),
  (
    '00000005-0000-0000-0000-000000000010',
    '00000003-0000-0000-0000-000000000012', -- MT-15
    '00000004-0000-0000-0000-000000000005', -- Miguel
    '00000002-0000-0000-0000-000000000003', -- NorthRide Baguio
    '2024-08-15', '2024-08-18',
    4500, 2500, 'confirmed', 'Maya'
  )
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Done! 3 agencies · 12 bikes · 5 renters · 10 bookings
-- ─────────────────────────────────────────────────────────────
