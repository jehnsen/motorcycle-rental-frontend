export type BikeType = "big_bike" | "naked" | "scooter" | "adventure";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export type SubscriptionTier = "free" | "standard" | "premium";

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  address: string;
  city: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  subscription_tier: SubscriptionTier;
  description?: string;
  contact_number?: string;
  email?: string;
  operating_hours?: string;
  response_time?: string;
  created_at: string;
}

export interface BikeSpecs {
  engine?: string;
  transmission?: string;
  fuel_type?: string;
  mileage?: string;
  weight?: string;
  seat_height?: string;
}

export interface Bike {
  id: string;
  agency_id: string;
  brand: string;
  model: string;
  type: BikeType;
  year: number;
  color: string;
  plate_number: string;
  daily_rate: number;
  deposit_amount: number;
  min_license_years: number;
  is_available: boolean;
  images: string[];
  specs: BikeSpecs;
  created_at: string;
  agency?: Agency;
  rating?: number;
  total_reviews?: number;
}

export interface Renter {
  id: string;
  user_id: string;
  full_name: string;
  license_number: string;
  license_expiry: string;
  id_type: string;
  id_number: string;
  selfie_url: string | null;
  is_verified: boolean;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  booking_count?: number;
}

export interface Booking {
  id: string;
  bike_id: string;
  renter_id: string;
  agency_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  deposit_amount: number;
  status: BookingStatus;
  payment_method: string;
  created_at: string;
  bike?: Bike;
  renter?: Renter;
  agency?: Agency;
}

export interface Review {
  id: string;
  booking_id: string;
  renter_id: string;
  agency_id: string;
  bike_id: string;
  rating: number;
  comment: string;
  created_at: string;
  renter?: Renter;
}

export interface SearchFilters {
  location?: string;
  start_date?: string;
  end_date?: string;
  bike_type?: BikeType | "all";
  min_price?: number;
  max_price?: number;
  brands?: string[];
  min_year?: number;
  max_year?: number;
  max_deposit?: number;
}

export interface RouteCard {
  title: string;
  distance: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  best_bike: string;
  description: string;
  location: string;
}
