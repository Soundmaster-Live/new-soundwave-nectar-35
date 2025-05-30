
# Database Schema

This document describes the database schema for the SoundMaster Radio application.

## Tables

### profiles
Stores user profile information
```sql
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  username text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  avatar_url text,
  primary key (id)
);
```

### songs
Stores music tracks information
```sql
create table public.songs (
  id uuid default uuid_generate_v4() not null,
  title text not null,
  artist text not null,
  album text,
  genre text,
  year integer,
  url text,
  is_karaoke boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid,
  primary key (id)
);
```

### radio_stations
Stores radio station information
```sql
create table public.radio_stations (
  id uuid default uuid_generate_v4() not null,
  name text not null,
  stream_url text not null,
  description text,
  genre text,
  logo_url text,
  is_active boolean default true,
  listeners_count integer default 0,
  peak_listeners integer default 0,
  total_listening_time bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);
```

### radio_shows
Stores scheduled radio show information
```sql
create table public.radio_shows (
  id uuid default uuid_generate_v4() not null,
  title text not null,
  description text,
  dj text not null,
  day integer not null,
  start_time text not null,
  end_time text not null,
  genre text,
  is_recurring boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);
```

### settings
Stores application settings and API keys
```sql
create table public.settings (
  key text not null,
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (key)
);
```

## Database Functions

### handle_new_user
```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = 'public'
as $$
begin
  insert into public.profiles (id, username, is_admin)
  values (new.id, new.email, false);
  return new;
end;
$$;
```

### handle_updated_at
```sql
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;
```

### update_station_stats
```sql
create or replace function public.update_station_stats()
returns trigger
language plpgsql
as $$
begin
    set search_path = 'public';
    
    update radio_stations
    set 
        listeners_count = (
            select listeners_count 
            from station_analytics 
            where station_id = new.station_id 
            order by timestamp desc 
            limit 1
        ),
        peak_listeners = greatest(
            peak_listeners,
            new.listeners_count
        )
    where id = new.station_id;

    return new;
end;
$$;
```

## Database Triggers

- **on_auth_user_created**: Triggers `handle_new_user` when a new user signs up
```sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

- **handle_updated_at**: Updates the `updated_at` field on various tables
```sql
create trigger handle_updated_at
  before update on public.radio_stations
  for each row execute procedure public.handle_updated_at();
```

- **update_station_stats_trigger**: Updates station statistics when analytics are inserted
```sql
create trigger update_station_stats_trigger
  after insert on public.station_analytics
  for each row execute procedure public.update_station_stats();
```

## Relationships

### Entity Relationship Diagram

```
profiles 1---* songs (user_id)
radio_stations 1---* station_analytics (station_id)
radio_shows *---* radio_stations (through show_stations)
profiles *---* radio_stations (through favorites)
```

### Key Relationships

- **User-Profile**: One-to-one relationship between auth.users and profiles
- **User-Songs**: One-to-many relationship between users and songs
- **Stations-Analytics**: One-to-many relationship between stations and analytics
- **Shows-Stations**: Many-to-many relationship between shows and stations

## Row Level Security Policies

### profiles Table RLS
```sql
-- Allow users to read their own profile
create policy "Users can read their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
```

### songs Table RLS
```sql
-- Allow all authenticated users to read songs
create policy "Anyone can read songs"
  on songs for select
  to authenticated
  using (true);

-- Allow users to create their own songs
create policy "Users can create their own songs"
  on songs for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow users to update their own songs
create policy "Users can update their own songs"
  on songs for update
  to authenticated
  using (auth.uid() = user_id);

-- Allow users to delete their own songs
create policy "Users can delete their own songs"
  on songs for delete
  to authenticated
  using (auth.uid() = user_id);
```

### radio_stations Table RLS
```sql
-- Allow anyone to read active radio stations
create policy "Anyone can read active radio stations"
  on radio_stations for select
  using (is_active = true);

-- Allow admins to manage all radio stations
create policy "Admins can manage all radio stations"
  on radio_stations for all
  to authenticated
  using (exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  ));
```

