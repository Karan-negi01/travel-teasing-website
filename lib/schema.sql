-- PACKAGES
create table if not exists packages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  location text not null,
  state text not null,
  category text not null check (category in ('group','family','sacred','adventure','corporate')),
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

-- GROUP TRIPS
create table if not exists group_trips (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references packages(id) on delete cascade,
  package_title text,
  package_slug text,
  creator_name text not null,
  creator_phone text not null,
  creator_email text,
  creator_user_id uuid references user_profiles(id) on delete set null,
  departure_city text,
  trip_dates_from date,
  trip_dates_to date,
  total_spots int not null,
  filled_spots int default 1,
  price_per_person int not null,
  total_price int not null,
  vibe_tags text[],
  status text default 'open',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- GROUP TRIP JOIN REQUESTS
create table if not exists group_trip_requests (
  id uuid default gen_random_uuid() primary key,
  group_trip_id uuid references group_trips(id) on delete cascade,
  user_id uuid references user_profiles(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  message text,
  status text default 'pending',
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
