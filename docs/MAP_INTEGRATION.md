
# Map Integration Guide

This documentation covers how to add and implement maps in the SoundMaster Radio application across different environments and deployment options.

## Table of Contents
1. [Overview](#overview)
2. [Map Provider Options](#map-provider-options)
3. [Implementation Guide](#implementation-guide)
4. [Environment Setup](#environment-setup)
5. [Examples](#examples)
6. [Troubleshooting](#troubleshooting)

## Overview

Maps can be used in the SoundMaster Radio application for several purposes:
- Displaying event locations
- Showing radio station coverage areas
- Visualizing listener demographics
- Highlighting DJ tour locations

## Map Provider Options

### 1. Mapbox
Mapbox offers highly customizable maps with excellent performance.

**Key Features:**
- Custom styling
- Interactive data visualization
- Geocoding services
- Directions API

**Integration Requirements:**
- Mapbox API key
- mapbox-gl package

### 2. Google Maps
Google Maps provides comprehensive mapping services with familiar UI.

**Key Features:**
- Extensive POI data
- Street View integration
- Directions service
- Places API

**Integration Requirements:**
- Google Maps API key
- @google/maps package

### 3. Leaflet (with OpenStreetMap)
An open-source option with flexibility and no usage limits.

**Key Features:**
- Free to use
- Extensive plugin ecosystem
- Mobile-friendly
- Open data sources

**Integration Requirements:**
- Leaflet package
- No API key required for basic functionality

## Implementation Guide

### Mapbox Implementation

1. **Installation**

```bash
npm install mapbox-gl @types/mapbox-gl
```

2. **Component Creation**

Create a reusable map component like:

```typescript
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface MapProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
  }>;
  style?: React.CSSProperties;
}

const MapComponent = ({
  centerLat = 0,
  centerLng = 0,
  zoom = 9,
  markers = [],
  style = { height: '400px', width: '100%' }
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Fetch API key from Supabase settings
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'MAPBOX_API_KEY')
          .single();

        if (error) throw error;
        if (data) setApiKey(data.value);
      } catch (error) {
        console.error('Error fetching Mapbox API key:', error);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    if (!apiKey || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [centerLng, centerLat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(/marker-icon.png)';
      el.style.width = '32px';
      el.style.height = '32px';

      new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${marker.title}</h3><p>${marker.description || ''}</p>`)
        )
        .addTo(map.current!);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey, centerLat, centerLng, zoom, markers]);

  return <div ref={mapContainer} style={style} />;
};

export default MapComponent;
```

3. **Usage Example**

```typescript
import MapComponent from '@/components/Map';

const EventPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Event Location</h1>
      <MapComponent 
        centerLat={-23.833333}
        centerLng={30.147675}
        zoom={12}
        markers={[
          {
            lat: -23.833333,
            lng: 30.147675,
            title: 'SoundMaster Event',
            description: 'Live DJ session at Tzaneen Main Hall'
          }
        ]}
      />
    </div>
  );
};
```

### Google Maps Implementation

Follow a similar pattern using the @react-google-maps/api package.

## Environment Setup

### Supabase Environment

Store your map provider API keys in the Supabase `settings` table:

```sql
INSERT INTO public.settings (key, value)
VALUES ('MAPBOX_API_KEY', 'your_mapbox_api_key_here');
```

### Firebase Environment

Store your API keys in Firebase config:

```javascript
// In src/integrations/firebase/client.ts
const getMapApiKey = async () => {
  const { getDoc, doc } = await import('firebase/firestore');
  const docRef = doc(db, 'settings', 'mapbox_api_key');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().value;
  }
  
  return null;
};
```

### Cloudflare Environment

Store your API keys as Cloudflare Workers KV pairs or as environment variables:

```javascript
// Access in a Worker
const mapboxApiKey = await SOUNDMASTER_KV.get("MAPBOX_API_KEY");
```

### Local Development

For local development, store API keys in `.env.local`:

```
VITE_MAPBOX_API_KEY=your_mapbox_api_key_here
```

Then access with:

```typescript
const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
```

## Examples

### Event Location Map

Implement a map showing all upcoming events:

```typescript
const EventsMap = () => {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw error;
      return data;
    }
  });

  const markers = events?.map(event => ({
    lat: event.latitude,
    lng: event.longitude,
    title: event.title,
    description: event.description
  })) || [];

  return (
    <MapComponent
      centerLat={-23.833333}
      centerLng={30.147675}
      zoom={8}
      markers={markers}
      style={{ height: '600px', width: '100%' }}
    />
  );
};
```

### Station Coverage Map

Visualize radio station coverage areas:

```typescript
const CoverageMap = ({ stationId }) => {
  const { data: coverage } = useQuery({
    queryKey: ['station-coverage', stationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('station_coverage')
        .select('*')
        .eq('station_id', stationId);
      
      if (error) throw error;
      return data;
    }
  });

  // Implementation for rendering coverage areas on the map
  // ...

  return <MapComponent /* props */ />;
};
```

## Troubleshooting

### Common Issues

1. **Map doesn't load**
   - Check if API key is valid and properly loaded
   - Verify the map container has a defined height

2. **Markers not appearing**
   - Ensure marker coordinates are in the correct format (longitude, latitude)
   - Check if marker elements are properly styled

3. **CORS errors**
   - Add the proper domains to your map provider's allowed origins list

4. **Performance issues**
   - Limit the number of markers displayed at once
   - Use marker clustering for large datasets
   - Implement lazy loading for map resources

### Solutions

For optimization of maps with many points:

```typescript
// Example of marker clustering with Mapbox
useEffect(() => {
  if (!map.current || !apiKey) return;
  
  map.current.on('load', () => {
    map.current?.addSource('markers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: markers.map(m => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [m.lng, m.lat]
          },
          properties: {
            title: m.title,
            description: m.description
          }
        }))
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });
    
    map.current?.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'markers',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }
    });
    
    // Add more layers for cluster counts and individual points
  });
}, [map.current, apiKey, markers]);
```
