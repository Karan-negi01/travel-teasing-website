-- Community trips: user-created trips on FIT packages.
-- Run this in the Supabase SQL editor once.

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
create index if not exists community_trips_package_idx on community_trips(package_id);
create index if not exists community_trips_status_idx on community_trips(status);
create index if not exists community_trips_creator_idx on community_trips(creator_id);

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
create index if not exists community_trip_members_trip_idx on community_trip_members(trip_id);
create index if not exists community_trip_members_user_idx on community_trip_members(user_id);

-- Personal gallery: albums are user_trips rows; photos live in user_trip_photos.
alter table user_trips add column if not exists is_public boolean default true;
alter table user_trips add column if not exists community_trip_id uuid references community_trips(id) on delete set null;

create table if not exists user_trip_photos (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid not null references user_trips(id) on delete cascade,
  url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index if not exists user_trip_photos_trip_idx on user_trip_photos(trip_id);
