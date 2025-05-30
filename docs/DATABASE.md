
# Database Documentation

## Overview

The SoundMaster application uses Supabase as its backend database service. The database is structured with the following key tables:

## Tables Schema

### profiles
Stores user profile information.

| Column   | Type        | Description                     | Constraints       |
|----------|-----------|---------------------------------|-------------------|
| id       | UUID       | User ID                         | Primary Key, Foreign Key to auth.users |
| username | TEXT       | User's display name             | Not Null          |
| is_admin | BOOLEAN    | Admin status flag               | Default: false    |
| created_at | TIMESTAMP | Creation timestamp              | Default: now()    |

### songs
Stores information about music tracks.

| Column     | Type      | Description                  | Constraints    |
|------------|-----------|------------------------------|----------------|
| id         | UUID      | Song ID                      | Primary Key    |
| title      | TEXT      | Song title                   | Not Null       |
| artist     | TEXT      | Artist name                  | Not Null       |
| album      | TEXT      | Album name                   |                |
| duration   | INTEGER   | Duration in seconds          |                |
| is_karaoke | BOOLEAN   | Flag for karaoke songs       | Default: false |
| created_at | TIMESTAMP | Creation timestamp           | Default: now() |

### stations
Stores radio station information.

| Column           | Type      | Description                | Constraints    |
|------------------|-----------|----------------------------|----------------|
| id               | UUID      | Station ID                 | Primary Key    |
| name             | TEXT      | Station name               | Not Null       |
| stream_url       | TEXT      | URL to the audio stream    | Not Null       |
| description      | TEXT      | Station description        |                |
| listeners_count  | INTEGER   | Current listener count     | Default: 0     |
| peak_listeners   | INTEGER   | Peak listener count        | Default: 0     |
| created_at       | TIMESTAMP | Creation timestamp         | Default: now() |
| updated_at       | TIMESTAMP | Last update timestamp      | Default: now() |

### playlists
Stores playlist information.

| Column      | Type      | Description             | Constraints    |
|-------------|-----------|-------------------------|----------------|
| id          | UUID      | Playlist ID             | Primary Key    |
| name        | TEXT      | Playlist name           | Not Null       |
| description | TEXT      | Playlist description    |                |
| owner_id    | UUID      | User ID of owner        | Foreign Key    |
| is_public   | BOOLEAN   | Public visibility flag  | Default: false |
| created_at  | TIMESTAMP | Creation timestamp      | Default: now() |
| updated_at  | TIMESTAMP | Last update timestamp   | Default: now() |

### radio_shows
Stores scheduled radio show information.

| Column      | Type      | Description              | Constraints    |
|-------------|-----------|--------------------------|----------------|
| id          | UUID      | Show ID                  | Primary Key    |
| title       | TEXT      | Show title               | Not Null       |
| description | TEXT      | Show description         |                |
| host_id     | UUID      | User ID of host          | Foreign Key    |
| start_time  | TIMESTAMP | Scheduled start time     | Not Null       |
| end_time    | TIMESTAMP | Scheduled end time       | Not Null       |
| is_recurring| BOOLEAN   | Recurring schedule flag  | Default: false |
| created_at  | TIMESTAMP | Creation timestamp       | Default: now() |
| updated_at  | TIMESTAMP | Last update timestamp    | Default: now() |

## Row Level Security (RLS) Policies

The database implements Row Level Security to control access to data:

### profiles
- Users can read all profiles
- Users can only update their own profile

### songs
- Anyone can read songs
- Only admins can create, update, or delete songs

### stations
- Anyone can read stations
- Only admins can create, update, or delete stations

### playlists
- Users can read public playlists
- Users can read, update, and delete their own playlists
- Only playlist owners can add or remove songs

### radio_shows
- Anyone can read shows
- Only admins can create, update, or delete shows

## Database Functions

### handle_new_user()
Automatically creates a profile when a new user registers.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$;
```

### update_station_stats()
Updates station statistics when listener data changes.

```sql
CREATE OR REPLACE FUNCTION public.update_station_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    SET search_path = 'public';
    
    UPDATE radio_stations
    SET 
        listeners_count = (
            SELECT listeners_count 
            FROM station_analytics 
            WHERE station_id = NEW.station_id 
            ORDER BY timestamp DESC 
            LIMIT 1
        ),
        peak_listeners = GREATEST(
            peak_listeners,
            NEW.listeners_count
        )
    WHERE id = NEW.station_id;

    RETURN NEW;
END;
$$;
```

### handle_updated_at()
Automatically updates the updated_at timestamp when records are modified.

```sql 
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;
```
