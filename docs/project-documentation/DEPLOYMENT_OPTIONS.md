
# Deployment Options

This document outlines the various deployment options for the SoundMaster Radio application.

## Current Deployment

The application is currently deployed using Lovable with Supabase as the backend service.

### Lovable Deployment Process

1. Click the "Publish" button in the Lovable interface
2. The application is built and deployed to Lovable's infrastructure
3. The deployed application is available at the Lovable-provided URL

## Alternative Deployment Options

### Firebase Deployment

#### Prerequisites
1. Firebase account
2. Firebase CLI installed
3. Firebase project created

#### Migration Steps
1. Create a new Firebase project
2. Set up Firebase Authentication
3. Create a Firestore database with the equivalent schema
4. Migrate data from Supabase to Firestore
5. Update the Firebase configuration in `src/integrations/firebase/client.ts`
6. Deploy Firebase Functions for serverless backend logic
7. Update API integration points to use Firebase APIs

#### Deployment Process
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in the project
firebase init

# Build the application
npm run build

# Deploy to Firebase
firebase deploy
```

### Cloudflare Deployment

#### Prerequisites
1. Cloudflare account
2. Wrangler CLI installed
3. Cloudflare Workers and Pages enabled

#### Migration Steps
1. Set up Cloudflare Pages for frontend hosting
2. Implement backend logic using Cloudflare Workers
3. Set up Cloudflare D1 or KV for data storage
4. Update API integration points to use Cloudflare APIs
5. Configure environment variables in Cloudflare dashboard

#### Deployment Process
```bash
# Install Wrangler CLI if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the application
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

### Local Development

#### Prerequisites
1. Node.js and npm installed
2. Local database (PostgreSQL recommended)
3. Supabase CLI for local development

#### Setup Steps
1. Clone the repository
   ```bash
   git clone https://github.com/your-org/project.git
   cd project
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up local database with the provided schema
   ```bash
   # Start local Supabase
   supabase start

   # Run migrations
   supabase migration up
   ```

4. Configure environment variables in `.env` file
   ```
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

### Docker Deployment

#### Prerequisites
1. Docker and Docker Compose installed
2. PostgreSQL database (containerized or external)

#### Setup Steps

1. Create a Dockerfile in the project root:
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Create an nginx.conf file:
   ```nginx
   server {
       listen 80;
       
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. Create a docker-compose.yml file:
   ```yaml
   version: '3'
   
   services:
     frontend:
       build:
         context: .
       ports:
         - "80:80"
       depends_on:
         - supabase
     
     supabase:
       image: supabase/supabase-local
       ports:
         - "54321:54321"
       environment:
         - POSTGRES_PASSWORD=postgres
   ```

4. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Continuous Integration/Continuous Deployment

### GitHub Actions

Set up CI/CD using GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### Netlify Deployment

For Netlify deployments:

1. Connect repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set up environment variables in Netlify dashboard
4. Configure redirect rules for SPA routing:

```
/* /index.html 200
```

### Vercel Deployment

For Vercel deployments:

1. Connect repository to Vercel
2. Configure build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set up environment variables in Vercel dashboard

## Custom Domain Configuration

To use a custom domain with any deployment:

1. Register a domain with a domain registrar
2. Configure DNS settings to point to your deployment:
   - For Netlify: Add CNAME record pointing to your Netlify site
   - For Vercel: Add A records pointing to Vercel's IP addresses
   - For Firebase: Add A records pointing to Firebase's IP addresses
3. Configure SSL certificate (automatically handled by most platforms)
4. Update authentication redirect URLs to match your custom domain

## Staging and Production Environments

For managing multiple environments:

1. Create separate projects/instances for staging and production
2. Use environment-specific configuration files:
   - `.env.staging` for staging
   - `.env.production` for production
3. Set up separate CI/CD pipelines for each environment
4. Implement feature flags to enable features in specific environments

