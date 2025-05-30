
# Deployment Guide

## Prerequisites

Before deploying the SoundMaster application, ensure you have:

1. Node.js 18+ installed
2. A Supabase account and project set up
3. Appropriate stream URLs configured
4. Required environment variables prepared

## Environment Variables

The following environment variables need to be configured:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deployment Options

### Option 1: Deploy via Lovable

1. Open your Lovable project
2. Click on the "Share" button in the top right
3. Select "Publish"
4. Follow the instructions to complete deployment

### Option 2: Manual Deployment

#### Building the Application

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the required environment variables
4. Build the application:
   ```
   npm run build
   ```
5. The build output will be in the `dist` directory

#### Deploying to Netlify

1. Create a new site on Netlify
2. Connect to your Git repository or upload the `dist` directory
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in the Netlify dashboard
5. Deploy the site

#### Deploying to Vercel

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```
2. Login to Vercel:
   ```
   vercel login
   ```
3. Deploy:
   ```
   vercel
   ```

## Post-Deployment Tasks

### Supabase Edge Functions

Deploy the Supabase Edge Functions:

```bash
cd supabase/functions
supabase functions deploy send-notification
supabase functions deploy update-radio-metrics
```

### Database Migrations

Run any pending database migrations:

```bash
supabase db push
```

### Content Setup

1. Add initial stations data to the Supabase database
2. Configure stream URLs in the application settings
3. Set up admin users by updating the `is_admin` flag in the profiles table

## Custom Domain Setup

To use a custom domain:

1. Purchase a domain from a domain registrar
2. Configure DNS settings to point to your deployment
3. Set up SSL certificate for secure connections
4. Update any hardcoded URLs in the application

## Monitoring

After deployment, monitor the application using:

1. Application logs in your hosting provider
2. Supabase logs for backend operations
3. Error tracking services like Sentry
4. Performance monitoring tools like Google Analytics

## Troubleshooting Common Deployment Issues

### 404 Error on Refresh

Add a rewrite rule to redirect all requests to index.html:

For Netlify, create a `_redirects` file in the public directory:
```
/* /index.html 200
```

For Vercel, add to `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### CORS Issues

If encountering CORS issues with streaming:

1. Verify that your streaming server allows cross-origin requests
2. Add appropriate CORS headers to your Supabase Edge Functions
3. Consider using a CORS proxy for development

### Database Connection Issues

If the application cannot connect to Supabase:

1. Verify environment variables are correctly set
2. Check Supabase service status
3. Ensure Row Level Security policies are configured correctly
