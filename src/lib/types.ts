export type Lang = 'ro' | 'ru' | 'en';

/** Row that has localized name fields. */
export interface Localized {
  name_ro?: string | null;
  name_ru?: string | null;
  name_en?: string | null;
}

export interface City extends Localized {
  slug: string;
  region_ro?: string | null;
  region_ru?: string | null;
  region_en?: string | null;
  lat?: number | null;
  lng?: number | null;
  population?: number | null;
  priority?: number | null;
  active?: boolean;
  /** Optional admin-written intro paragraph that is prepended to the built-in SEO copy. */
  seo_intro_ro?: string | null;
  seo_intro_ru?: string | null;
}

/** kind = 'event' (weddings, corporate...) or 'service' (buffet, candy bar...) */
export interface Category extends Localized {
  slug: string;
  kind: 'event' | 'service';
  description_ro?: string | null;
  description_ru?: string | null;
  description_en?: string | null;
  icon?: string | null;
  priority?: number | null;
  active?: boolean;
}

export interface Taxonomy extends Localized {
  slug: string;
  kind: 'cuisine' | 'dietary';
  active?: boolean;
}

export interface Firm {
  id: string;
  owner_id?: string | null;
  name: string;
  slug: string;
  tagline_ro?: string | null;
  tagline_ru?: string | null;
  description_ro?: string | null;
  description_ru?: string | null;
  city?: string | null;
  region?: string | null;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  logo_url?: string | null;
  gallery?: string[] | null;
  price_from?: number | null;
  currency?: string | null;
  min_guests?: number | null;
  max_guests?: number | null;
  cuisines?: string[] | null;
  event_types?: string[] | null;
  dietary?: string[] | null;
  map_lat?: number | null;
  map_lng?: number | null;
  rating_avg?: number | null;
  rating_count?: number | null;
  verified?: boolean;
  published?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  seo_title?: string | null;
  seo_description_ro?: string | null;
  seo_description_ru?: string | null;
  views?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  firm_id: string;
  title_ro: string;
  title_ru?: string | null;
  description_ro?: string | null;
  description_ru?: string | null;
  category?: string | null;
  price?: number | null;
  price_type?: 'per_person' | 'per_event' | 'per_hour' | 'fixed' | 'on_request';
  unit?: string | null;
  image_url?: string | null;
  active?: boolean;
  sort?: number | null;
  created_at?: string;
}

export type InquiryStatus = 'new' | 'read' | 'replied' | 'archived' | 'spam';

export interface Inquiry {
  id: string;
  firm_id: string;
  name: string;
  email: string;
  phone?: string | null;
  event_date?: string | null;
  guests?: number | null;
  message: string;
  status?: InquiryStatus;
  created_at?: string;
}

export interface Review {
  id: string;
  firm_id: string;
  author_name: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | 'spam';
  created_at?: string;
}

export interface SiteSettings {
  seo_title_template: string;
  seo_description_ro: string;
  seo_description_ru: string;
  seo_description_en: string;
  hero_title_ro: string;
  hero_title_ru: string;
  hero_subtitle_ro: string;
  hero_subtitle_ru: string;
  reviews_enabled: boolean;
  inquiries_enabled: boolean;
  contact_email: string;
  contact_phone: string;
  footer_note_ro: string;
  footer_note_ru: string;
  featured_firm_ids: string[];
}

export interface SearchParams {
  lang: Lang;
  q?: string;
  city?: string;
  event?: string;
  cuisine?: string;
  dietary?: string[];
  priceMin?: number;
  priceMax?: number;
  guests?: number;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'new';
  page?: number;
  perPage?: number;
}

export interface SearchFiltersData {
  cities: City[];
  events: Category[];
  cuisines: Taxonomy[];
  dietary: Taxonomy[];
}
