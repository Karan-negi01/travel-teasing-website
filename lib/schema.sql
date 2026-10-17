-- PACKAGES
create table if not exists packages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  location text not null,
  state text not null,
  category text not null check (category in ('group','family','sacred','adventure','corporate','weekend','fit')),
  duration_days int not null,
  duration_nights int not null,
  group_size_min int default 1,
  group_size_max int default 20,
  price_per_person int not null,
  total_price int not null,
  description text,
  highlights text[],
  inclusions text[],
  exclusions text[],
  things_to_carry text[],
  tour_options jsonb,
  multi_dates jsonb,
  itinerary jsonb,
  cover_image text,
  gallery_images text[],
  is_featured boolean default false,
  is_active boolean default true,
  departure_city text,
  meeting_point text,
  best_time_to_visit text,
  difficulty_level text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- USER PROFILES (extends Supabase auth)
create table if not exists user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  city text,
  gender text,
  date_of_birth date,
  bio text,
  profile_photo text,
  is_verified boolean default false,
  trip_style text[],
  budget_preference text,
  sleep_schedule text,
  comfort_level text,
  instagram_handle text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TRAVEL PORTFOLIO (user trips)
create table if not exists user_trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  package_id uuid references packages(id) on delete set null,
  destination text not null,
  state text,
  country text default 'India',
  trip_type text,
  travel_date_from date,
  travel_date_to date,
  cover_photo text,
  caption text,
  booked_through_platform boolean default false,
  is_public boolean default true,
  community_trip_id uuid,
  created_at timestamptz default now()
);

-- BADGES
create table if not exists badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon text,
  condition_type text,
  condition_value int
);

-- USER BADGES (earned)
create table if not exists user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  badge_id uuid references badges(id),
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- ENQUIRIES
create table if not exists enquiries (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references packages(id) on delete set null,
  package_title text,
  enquiry_type text not null,
  name text not null,
  phone text not null,
  email text,
  message text,
  destination text,
  travel_dates text,
  group_size int,
  budget_per_person int,
  status text default 'new',
  created_at timestamptz default now()
);

-- TESTIMONIALS
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  traveler_city text,
  trip_destination text,
  review_text text not null,
  rating int default 5,
  trip_category text,
  photo text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- BLOGS
create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  category text,
  author text default 'Travel Teasing Team',
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- GALLERY
create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  location text,
  category text,
  sort_order int default 0,
  is_active boolean default true
);

-- COMPANY TRANSACTIONS (co-founder card expense tracker)
create table if not exists company_transactions (
  id uuid default gen_random_uuid() primary key,
  amount int not null,
  merchant text not null,
  purpose text not null,
  card_holder text not null check (card_holder in ('karan', 'lakshay')),
  category text not null default 'other',
  transaction_date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- COMMUNITY TRIPS (user-created trips on FIT packages) — see lib/migrations/2026-10-17-community-trips.sql
create table if not exists community_trips (
  id uuid default gen_random_uuid() primary key,
  share_code text unique not null,
  package_id uuid not null references packages(id) on delete cascade,
  creator_id uuid not null references user_profiles(id) on delete cascade,
  title text,
  note text,
  start_date date not null,
  end_date date,
  departure_city text,
  total_spots int not null check (total_spots >= 2),
  vibe_tags text[] default '{}',
  gender_rule text not null default 'any' check (gender_rule in ('any','female','male')),
  age_min int,
  age_max int,
  price_per_person int,
  status text not null default 'open' check (status in ('open','full','confirmed','completed','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists community_trip_members (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid not null references community_trips(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('creator','member')),
  status text not null default 'requested' check (status in ('requested','approved','rejected','removed','left')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','refunded')),
  message text,
  created_at timestamptz default now(),
  decided_at timestamptz,
  unique(trip_id, user_id)
);

-- PERSONAL GALLERY photos (albums are user_trips rows; user_trips.is_public controls visibility)
create table if not exists user_trip_photos (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid not null references user_trips(id) on delete cascade,
  url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);
