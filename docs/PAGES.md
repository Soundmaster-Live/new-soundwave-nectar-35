
# Pages Documentation

## Main Pages

### Home Page (`src/pages/Index.tsx`)
The landing page of the application, featuring welcome content, DJ features, and promotional sections.

#### Key Components:
- `WelcomeSection`: Main hero section with DJ features
- `ValueProposition`: Highlights the value of the service
- `FeaturedEvents`: Displays upcoming events
- `TestimonialSection`: Customer testimonials
- `ContactCTA`: Call-to-action for contacting the service

### Live Radio Page (`src/pages/LiveRadio.tsx`)
Dedicated page for the live radio streaming experience.

#### Key Components:
- Iframe for video streaming from Kick.com
- `LiveStreamPlayer`: Audio-only player component
- Stream status indicators
- Error handling for offline streams

#### Features:
- Combined video and audio streaming options
- Stream status indicators
- Error handling and retry mechanisms
- External links to Kick.com

### Authentication Page (`src/pages/Auth.tsx`)
Handles user authentication including sign-in and sign-up functionality.

#### Features:
- Tab-based interface for switching between sign-in and sign-up
- Integration with Supabase authentication
- Form validation
- Error handling

#### URL Parameters:
- `tab`: Can be set to "signin" or "signup" to pre-select the active tab

### About Page (`src/pages/About.tsx`)
Provides information about the SoundMaster service.

### Contact Page (`src/pages/Contact.tsx`)
Allows users to contact the service provider.

### Services Page (`src/pages/Services.tsx`)
Showcases the various services offered.

## Protected Pages

### Admin Dashboard (`src/pages/Admin.tsx`)
Admin control panel, accessible only to administrators.

#### Protection:
- Requires authentication
- Requires admin role

### Live Lesson Page (`src/pages/LiveLesson.tsx`)
Interactive lesson page, accessible only to authenticated users.

#### Protection:
- Requires authentication
