# Database Export Documentation

This document contains a complete export of the database schema, including tables, functions, and triggers. This can be used to recreate the database in another environment.

## Table of Contents
1. [Database Schema](#database-schema)
2. [Tables](#tables)
3. [Functions](#functions)
4. [Triggers](#triggers)
5. [RLS Policies](#rls-policies)
6. [Initial Data](#initial-data)
7. [Migration Process](#migration-process)

## Database Schema

### Schema Overview
The database consists of several tables that store information about users, radio stations, songs, shows, and AI-related content.

### Schema Diagram

```
profiles
  ↑
  | (user_id)
  |
  ├── songs
  |
  ├── bookings
  |
  ├── events
  |
  ├── blog_posts
  |
  └── ai_content_logs
       |
       ↓ (station_id)
radio_stations ← station_analytics
  ↑
  | (station_id)
  |
radio_shows
```

## Tables

### profiles
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username text,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  avatar_url text,
  PRIMARY KEY (id)
);
```

### songs
```sql
CREATE TABLE public.songs (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  title text NOT NULL,
  artist text NOT NULL,
  album text,
  genre text,
  year integer,
  url text,
  is_karaoke boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid,
  PRIMARY KEY (id)
);
```

### radio_stations
```sql
CREATE TABLE public.radio_stations (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  name text NOT NULL,
  stream_url text NOT NULL,
  description text,
  genre text,
  logo_url text,
  is_active boolean DEFAULT true,
  listeners_count integer DEFAULT 0,
  peak_listeners integer DEFAULT 0,
  total_listening_time bigint DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### radio_shows
```sql
CREATE TABLE public.radio_shows (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  title text NOT NULL,
  description text,
  dj text NOT NULL,
  day integer NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  genre text,
  is_recurring boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### station_analytics
```sql
CREATE TABLE public.station_analytics (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  station_id uuid NOT NULL REFERENCES public.radio_stations(id),
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  listeners_count integer DEFAULT 0,
  unique_listeners integer DEFAULT 0,
  avg_listening_time integer DEFAULT 0,
  PRIMARY KEY (id)
);
```

### settings
```sql
CREATE TABLE public.settings (
  key text NOT NULL,
  value text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (key)
);
```

### ai_personalities
```sql
CREATE TABLE public.ai_personalities (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  name text NOT NULL,
  voice_id text NOT NULL,
  personality_prompt text NOT NULL,
  language text DEFAULT 'en'::text,
  is_active boolean DEFAULT true,
  user_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### ai_content_logs
```sql
CREATE TABLE public.ai_content_logs (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  content_type text NOT NULL,
  content text NOT NULL,
  user_id uuid,
  station_id uuid REFERENCES public.radio_stations(id),
  is_flagged boolean DEFAULT false,
  sentiment_score double precision,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### broadcast_settings
```sql
CREATE TABLE public.broadcast_settings (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  station_name text NOT NULL,
  current_dj uuid REFERENCES public.ai_personalities(id),
  weather_enabled boolean DEFAULT true,
  news_enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### events
```sql
CREATE TABLE public.events (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  title text NOT NULL,
  description text,
  date timestamp with time zone NOT NULL,
  location text,
  image_url text,
  user_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### blog_posts
```sql
CREATE TABLE public.blog_posts (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  user_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### bookings
```sql
CREATE TABLE public.bookings (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  time text,
  details text,
  status text DEFAULT 'pending'::text,
  user_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### notifications
```sql
CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
```

### playlists
```sql
CREATE TABLE public.playlists (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  name text NOT NULL,
  description text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### stations
```sql
CREATE TABLE public.stations (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  name text NOT NULL,
  description text,
  is_live boolean DEFAULT false,
  current_listeners integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

### stream_analytics
```sql
CREATE TABLE public.stream_analytics (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  session_id text NOT NULL,
  listener_count integer DEFAULT 0,
  peak_listeners integer DEFAULT 0,
  total_duration integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

## Functions

### handle_new_user
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$function$;
```

### handle_updated_at
```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$function$;
```

### update_station_stats
```sql
CREATE OR REPLACE FUNCTION public.update_station_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$;
```

## Triggers

### on_auth_user_created
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### handle_updated_at (radio_shows)
```sql
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.radio_shows
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### handle_updated_at (playlists)
```sql
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### update_station_stats_trigger
```sql
CREATE TRIGGER update_station_stats_trigger
  AFTER INSERT ON public.station_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_station_stats();
```

### handle_updated_at (stations)
```sql
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.stations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## RLS Policies

Currently, no Row Level Security (RLS) policies are explicitly defined in the provided information. To implement RLS, you would use statements like:

```sql
-- Enable RLS on the table
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to read all songs
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);

-- Create a policy to allow users to insert their own songs
CREATE POLICY "Users can add their own songs" ON public.songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow users to update their own songs
CREATE POLICY "Users can update their own songs" ON public.songs
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy to allow users to delete their own songs
CREATE POLICY "Users can delete their own songs" ON public.songs
  FOR DELETE USING (auth.uid() = user_id);
```

## Initial Data

### API Keys in Settings Table
```sql
INSERT INTO public.settings (key, value, created_at, updated_at)
VALUES 
  ('GOOGLE_API_KEY', 'AIzaSyCXXP_JjQfRPMkSeIBp5Aq1wU5ztK13zRM', now(), now()),
  ('OPENROUTER_API_KEY', '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', now(), now());
```

### Default Radio Station
```sql
INSERT INTO public.radio_stations (name, stream_url, description, genre, is_active)
VALUES 
  ('SoundMaster FM', 'https://example.com/stream', 'Our main radio station with the latest hits', 'Various', true);
```

### Default AI Personality
```sql
INSERT INTO public.ai_personalities (name, voice_id, personality_prompt)
VALUES 
  ('DJ Max', 'EXAVITQu4vr4xnSDxMaL', 'You are DJ Max, an energetic radio host who loves to engage with listeners. You have a great sense of humor and deep knowledge of music.');
```

## Migration Process

### Complete Database Export

To fully export the database for migration to another environment:

1. **Export Schema**
   ```bash
   pg_dump --schema-only -d postgres://username:password@host:port/database > schema.sql
   ```

2. **Export Data**
   ```bash
   pg_dump --data-only -d postgres://username:password@host:port/database > data.sql
   ```

### Database Import

To import the database into a new environment:

1. **Import Schema**
   ```bash
   psql -d postgres://username:password@host:port/new_database -f schema.sql
   ```

2. **Import Data**
   ```bash
   psql -d postgres://username:password@host:port/new_database -f data.sql
   ```

### Alternative Backends

#### Firebase/Firestore Schema

For Firebase/Firestore, the data structure would be document-based:

```javascript
// Example Firestore structure
const db = {
  profiles: {
    userId1: {
      username: "user1",
      isAdmin: false,
      createdAt: timestamp,
      avatarUrl: "https://example.com/avatar.jpg"
    }
  },
  radio_stations: {
    stationId1: {
      name: "SoundMaster FM",
      streamUrl: "https://example.com/stream",
      description: "Our main radio station",
      isActive: true,
      listenersCount: 0,
      peakListeners: 0
    }
  },
  // ... other collections
};
```

#### MongoDB Schema

For MongoDB, the schema would be similar but with MongoDB-specific features:

```javascript
// Profiles collection
db.createCollection("profiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "username"],
      properties: {
        _id: { bsonType: "string" },
        username: { bsonType: "string" },
        isAdmin: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        avatarUrl: { bsonType: "string" }
      }
    }
  }
});

// Radio stations collection
db.createCollection("radioStations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "streamUrl"],
      properties: {
        name: { bsonType: "string" },
        streamUrl: { bsonType: "string" },
        description: { bsonType: "string" },
        isActive: { bsonType: "bool" },
        listenersCount: { bsonType: "int" },
        peakListeners: { bsonType: "int" }
      }
    }
  }
});
```
