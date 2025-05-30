
# Contact Page Map Integration

This document provides specific guidance for implementing the map on the Contact page of the SoundMaster Radio application.

## Overview

The Contact page should display the location of SoundMaster Radio's physical office in Tzaneen, South Africa, using an interactive map.

## Implementation Steps

### 1. Create Map Component for Contact Page

Create a specialized map component for the contact page:

```typescript
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";

const ContactMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const tzaneenCoordinates = {
    lng: 30.147675,
    lat: -23.833333
  };

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
      center: [tzaneenCoordinates.lng, tzaneenCoordinates.lat],
      zoom: 15,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker for office location
    const marker = new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([tzaneenCoordinates.lng, tzaneenCoordinates.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3>SoundMaster Radio</h3><p>Tzaneen, Limpopo, South Africa</p>')
      )
      .addTo(map.current);

    // Open popup by default
    marker.togglePopup();

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey]);

  if (!apiKey) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Map loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div ref={mapContainer} className="h-[300px] w-full rounded-b-lg" />
      </CardContent>
    </Card>
  );
};

export default ContactMap;
```

### 2. Integrate with Contact Page

Update the Contact page to include the map:

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactMap from "@/components/ContactMap";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">081 543 6748</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">soundmaster@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">Tzaneen, Limpopo, South Africa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ContactMap />
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2">Name</label>
                <Input id="name" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">Email</label>
                <Input id="email" type="email" placeholder="Your email" required />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2">Phone</label>
                <Input id="phone" type="tel" placeholder="Your phone number" required />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2">Message</label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  className="min-h-[150px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
```

## Environment Configuration for Contact Map

### API Key Setup

For the Contact page map to work across environments, ensure the appropriate API key is set:

#### Supabase
```sql
INSERT INTO public.settings (key, value, created_at, updated_at)
VALUES ('MAPBOX_API_KEY', 'your_mapbox_api_key', NOW(), NOW());
```

#### Firebase
```javascript
const firestore = getFirestore();
await setDoc(doc(firestore, "settings", "mapbox_api_key"), {
  value: "your_mapbox_api_key",
  updated_at: serverTimestamp()
});
```

#### Cloudflare
```javascript
await SOUNDMASTER_KV.put("MAPBOX_API_KEY", "your_mapbox_api_key");
```

#### Local Development
```
# .env.local
VITE_MAPBOX_API_KEY=your_mapbox_api_key
```

## Customizing the Contact Map

### Style Options

Mapbox offers various map styles that can be used by changing the style URL:

- Default Street Style: `mapbox://styles/mapbox/streets-v12`
- Light Style: `mapbox://styles/mapbox/light-v11`
- Dark Style: `mapbox://styles/mapbox/dark-v11`
- Satellite Style: `mapbox://styles/mapbox/satellite-v9`
- Outdoors Style: `mapbox://styles/mapbox/outdoors-v12`

Example change:
```typescript
map.current = new mapboxgl.Map({
  container: mapContainer.current,
  style: 'mapbox://styles/mapbox/dark-v11', // Use dark theme
  center: [tzaneenCoordinates.lng, tzaneenCoordinates.lat],
  zoom: 15,
});
```

### Custom Marker Options

You can customize the marker for the office location:

```typescript
// Custom marker element
const el = document.createElement('div');
el.className = 'custom-marker';
el.style.backgroundImage = 'url(/logo-pin.png)';
el.style.width = '32px';
el.style.height = '32px';
el.style.backgroundSize = '100%';

// Use custom element for marker
new mapboxgl.Marker(el)
  .setLngLat([tzaneenCoordinates.lng, tzaneenCoordinates.lat])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML('<h3>SoundMaster Radio</h3><p>Tzaneen, Limpopo, South Africa</p>')
  )
  .addTo(map.current);
```

### Interactive Features

Add click events to the map for additional interactivity:

```typescript
map.current.on('click', (e) => {
  const coordinates = e.lngLat;
  console.log(`Clicked at: ${coordinates.lng}, ${coordinates.lat}`);
  
  // You could use this to let users suggest location corrections
  // or mark their own location
});
```

## Troubleshooting Contact Map Issues

### Mobile Responsiveness

Ensure the map is responsive on mobile devices:

```typescript
// Add to component styles
const mapContainerStyle = {
  height: '300px',
  width: '100%',
  maxWidth: '100vw'
};

// Use in the component
<div ref={mapContainer} style={mapContainerStyle} />
```

### Loading State

Improve the loading state UI:

```typescript
if (!apiKey) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-[300px] flex flex-col items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500 mt-4">Loading map...</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Fallback Map

Create a fallback static map in case the interactive map fails:

```typescript
const StaticMap = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative h-[300px] w-full bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/30.147675,-23.833333,14/600x300?access_token=YOUR_PUBLIC_TOKEN" 
            alt="Static map of SoundMaster office location"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-2 rounded shadow">
              <h3 className="font-semibold">SoundMaster Radio</h3>
              <p className="text-sm">Tzaneen, Limpopo, South Africa</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```
