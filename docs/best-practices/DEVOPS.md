# DevOps Best Practices

## CI/CD Pipeline

1. **Automated testing**
   ```yaml
   # Example GitHub Actions workflow
   name: CI
   
   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main, develop ]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'
           
       - name: Install dependencies
         run: npm ci
       
       - name: Lint
         run: npm run lint
       
       - name: Type check
         run: npm run type-check
       
       - name: Run tests
         run: npm test
   ```

2. **Configure automated deployment**
   ```yaml
   # Example deployment workflow
   name: Deploy
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'
           
       - name: Install dependencies
         run: npm ci
       
       - name: Build
         run: npm run build
       
       - name: Deploy
         uses: FirebaseExtended/action-hosting-deploy@v0
         with:
           repoToken: '${{ secrets.GITHUB_TOKEN }}'
           firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
           projectId: your-project-id
           channelId: live
   ```

3. **Set up deployment pipeline for staging**
   ```yaml
   # Staging deployment workflow
   name: Deploy to Staging
   
   on:
     push:
       branches: [ develop ]
   
   jobs:
     deploy-staging:
       runs-on: ubuntu-latest
       
       steps:
       # Similar steps to production but deploying to staging
       - name: Deploy to Staging
         run: npm run deploy:staging
   ```

## Environment Configuration

1. **Use environment variables**
   ```typescript
   // config.ts
   const config = {
     apiUrl: process.env.REACT_APP_API_URL,
     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
     environment: process.env.NODE_ENV || 'development',
     isProduction: process.env.NODE_ENV === 'production',
     analytics: {
       enabled: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
       trackingId: process.env.REACT_APP_ANALYTICS_ID,
     },
   };
   
   export default config;
   ```

2. **Implement feature flags**
   ```typescript
   // featureFlags.ts
   type FeatureFlag = 'newUserDashboard' | 'enhancedSearch' | 'betaFeatures';
   
   const featureFlags: Record<FeatureFlag, boolean> = {
     newUserDashboard: process.env.REACT_APP_ENABLE_NEW_DASHBOARD === 'true',
     enhancedSearch: process.env.REACT_APP_ENABLE_ENHANCED_SEARCH === 'true',
     betaFeatures: process.env.REACT_APP_ENABLE_BETA === 'true',
   };
   
   export function isFeatureEnabled(flag: FeatureFlag): boolean {
     return featureFlags[flag] || false;
   }
   ```

3. **Separate dev/staging/production configurations**
   ```
   # .env.development
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_ENABLE_MOCK_API=true
   REACT_APP_ENABLE_BETA=true
   
   # .env.staging
   REACT_APP_API_URL=https://staging-api.example.com
   REACT_APP_ENABLE_BETA=true
   
   # .env.production
   REACT_APP_API_URL=https://api.example.com
   REACT_APP_ENABLE_BETA=false
   ```

## Monitoring and Analytics

1. **Set up error tracking**
   ```typescript
   // errorTracking.ts
   import * as Sentry from '@sentry/react';
   
   export function initializeErrorTracking() {
     if (process.env.NODE_ENV === 'production') {
       Sentry.init({
         dsn: process.env.REACT_APP_SENTRY_DSN,
         environment: process.env.REACT_APP_ENVIRONMENT || 'production',
         tracesSampleRate: 0.2,
       });
     }
   }
   
   export function captureException(error: Error, context?: Record<string, any>) {
     console.error(error);
     
     if (process.env.NODE_ENV === 'production') {
       Sentry.withScope((scope) => {
         if (context) {
           Object.entries(context).forEach(([key, value]) => {
             scope.setExtra(key, value);
           });
         }
         Sentry.captureException(error);
       });
     }
   }
   ```

2. **Set up performance monitoring**
   ```typescript
   import { reportWebVitals } from 'web-vitals';
   
   function sendToAnalytics({ name, delta, id }: {
     name: string,
     delta: number,
     id: string
   }) {
     // Send to analytics service
     console.log({ name, delta, id });
   
     // Example: Send to Google Analytics
     if (window.gtag) {
       window.gtag('event', name, {
         event_category: 'Web Vitals',
         event_label: id,
         value: Math.round(name === 'CLS' ? delta * 1000 : delta),
         non_interaction: true,
       });
     }
   }
   
   reportWebVitals(sendToAnalytics);
   ```

3. **Track key user metrics**
   ```typescript
   // analytics.ts
   type EventName = 
     | 'page_view'
     | 'button_click'
     | 'form_submit'
     | 'search'
     | 'error';
   
   type EventProperties = Record<string, string | number | boolean>;
   
   export function trackEvent(
     eventName: EventName,
     properties: EventProperties = {}
   ) {
     if (!process.env.REACT_APP_ENABLE_ANALYTICS) {
       return;
     }
     
     // Send to analytics service
     console.log(`Event: ${eventName}`, properties);
     
     // Example with Google Analytics
     if (window.gtag) {
       window.gtag('event', eventName, properties);
     }
   }
   
   // Usage
   function handleSubmit() {
     trackEvent('form_submit', { form_name: 'contact', form_length: 5 });
   }
   ```

## Security Practices

1. **Audit and update dependencies**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   
   # Update dependencies
   npm update
   ```

2. **Implement security headers**
   ```js
   // Example with Express server
   app.use((req, res, next) => {
     // Content Security Policy
     res.setHeader(
       'Content-Security-Policy',
       "default-src 'self'; script-src 'self' https://trusted-cdn.com; style-src 'self' https://trusted-cdn.com; img-src 'self' data:"
     );
     
     // Other security headers
     res.setHeader('X-Content-Type-Options', 'nosniff');
     res.setHeader('X-Frame-Options', 'DENY');
     res.setHeader('X-XSS-Protection', '1; mode=block');
     res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
     res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
     
     next();
   });
   ```

3. **Set up security scanning in CI pipeline**
   ```yaml
   # GitHub Actions security scan job
   security-scan:
     runs-on: ubuntu-latest
     steps:
     - uses: actions/checkout@v3
     
     - name: Setup Node.js
       uses: actions/setup-node@v3
       with:
         node-version: '18'
         
     - name: Install dependencies
       run: npm ci
     
     - name: Run npm audit
       run: npm audit --audit-level=high
     
     - name: Run SAST scan
       uses: github/codeql-action/analyze@v2
   ```

## Deployment Strategies

1. **Blue-green deployment**
   ```bash
   # Deploy new version to non-active environment
   deploy_to_green() {
     echo "Deploying to green environment"
     npm run build
     firebase deploy --only hosting:green
   }
   
   # Run tests against new deployment
   test_green() {
     echo "Testing green environment"
     npm run test:e2e -- --baseUrl=https://green.example.com
   }
   
   # Switch traffic to new deployment
   switch_to_green() {
     echo "Switching traffic to green environment"
     firebase hosting:clone green:live
   }
   
   # Main deployment script
   deploy_to_green
   test_green
   if [ $? -eq 0 ]; then
     switch_to_green
   else
     echo "Tests failed, not switching to green"
     exit 1
   fi
   ```

2. **Feature flag deployment**
   ```typescript
   // featureFlags.ts
   import { useState, useEffect } from 'react';
   
   interface FeatureFlags {
     newDashboard: boolean;
     enhancedSearch: boolean;
     betaFeatures: boolean;
   }
   
   async function fetchFeatureFlags(): Promise<FeatureFlags> {
     try {
       const response = await fetch('/api/feature-flags');
       return await response.json();
     } catch (error) {
       console.error('Failed to fetch feature flags:', error);
       return {
         newDashboard: false,
         enhancedSearch: false,
         betaFeatures: false,
       };
     }
   }
   
   export function useFeatureFlags() {
     const [flags, setFlags] = useState<FeatureFlags>({
       newDashboard: false,
       enhancedSearch: false,
       betaFeatures: false,
     });
     
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       fetchFeatureFlags().then((flags) => {
         setFlags(flags);
         setLoading(false);
       });
     }, []);
     
     return { flags, loading };
   }
   
   // Usage in component
   function Dashboard() {
     const { flags, loading } = useFeatureFlags();
     
     if (loading) {
       return <Loading />;
     }
     
     return flags.newDashboard ? <NewDashboard /> : <ClassicDashboard />;
   }
   ```

3. **Rollback plan**
   ```bash
   # Script for quick rollback
   rollback_to_previous_version() {
     echo "Rolling back to previous version"
     
     # Get previous version tag
     PREV_VERSION=$(git describe --tags --abbrev=0 HEAD^)
     
     # Checkout previous version
     git checkout $PREV_VERSION
     
     # Build and deploy
     npm ci
     npm run build
     npm run deploy
     
     echo "Rolled back to $PREV_VERSION"
   }
   ```

## Infrastructure as Code

1. **Define infrastructure in code**
   ```yaml
   # Example Terraform configuration
   provider "aws" {
     region = "us-west-2"
   }
   
   resource "aws_s3_bucket" "frontend_hosting" {
     bucket = "my-app-frontend"
     acl    = "public-read"
     
     website {
       index_document = "index.html"
       error_document = "index.html"
     }
   }
   
   resource "aws_cloudfront_distribution" "frontend_distribution" {
     origin {
       domain_name = aws_s3_bucket.frontend_hosting.website_endpoint
       origin_id   = "S3-Website"
       
       custom_origin_config {
         http_port              = 80
         https_port             = 443
         origin_protocol_policy = "http-only"
         origin_ssl_protocols   = ["TLSv1.2"]
       }
     }
     
     enabled             = true
     default_root_object = "index.html"
     
     # Additional CloudFront settings
   }
   ```

2. **Configure backup strategy**
   ```yaml
   # Example backup configuration
   backup_database:
     image: postgres:latest
     volumes:
       - ./backup:/backup
     environment:
       PGPASSWORD: ${DB_PASSWORD}
     command: >
       bash -c "pg_dump -h db -U ${DB_USER} -d ${DB_NAME} -f /backup/backup_$(date +%Y%m%d_%H%M%S).sql"
   ```

3. **Set up monitoring alerts**
   ```yaml
   # Example alert configuration
   resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
     alarm_name          = "high-error-rate"
     comparison_operator = "GreaterThanThreshold"
     evaluation_periods  = "1"
     metric_name         = "5XXError"
     namespace           = "AWS/ApiGateway"
     period              = "60"
     statistic           = "Sum"
     threshold           = "5"
     alarm_description   = "This metric monitors API Gateway 5XX errors"
     
     alarm_actions = [aws_sns_topic.alerts.arn]
   }
   ```
