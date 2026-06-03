export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      moto_agencies: {
        Row: {
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
          subscription_tier: "free" | "standard" | "premium";
          description: string | null;
          contact_number: string | null;
          email: string | null;
          operating_hours: string | null;
          response_time: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["moto_agencies"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["moto_agencies"]["Insert"]>;
      };
      moto_bikes: {
        Row: {
          id: string;
          agency_id: string;
          brand: string;
          model: string;
          type: "big_bike" | "naked" | "scooter" | "adventure";
          year: number;
          color: string;
          plate_number: string;
          daily_rate: number;
          deposit_amount: number;
          min_license_years: number;
          is_available: boolean;
          images: string[];
          specs: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["moto_bikes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["moto_bikes"]["Insert"]>;
      };
      moto_bookings: {
        Row: {
          id: string;
          bike_id: string;
          renter_id: string;
          agency_id: string;
          start_date: string;
          end_date: string;
          total_amount: number;
          deposit_amount: number;
          status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
          payment_method: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["moto_bookings"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["moto_bookings"]["Insert"]>;
      };
      moto_renters: {
        Row: {
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
        };
        Insert: Omit<Database["public"]["Tables"]["moto_renters"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["moto_renters"]["Insert"]>;
      };
      moto_reviews: {
        Row: {
          id: string;
          booking_id: string;
          renter_id: string;
          agency_id: string;
          bike_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["moto_reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["moto_reviews"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      moto_bike_type: "big_bike" | "naked" | "scooter" | "adventure";
      moto_booking_status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
      moto_subscription_tier: "free" | "standard" | "premium";
    };
  };
}
