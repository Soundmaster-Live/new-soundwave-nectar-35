
# Security Best Practices

## Frontend Security

1. **XSS prevention**
   - Don't use dangerouslySetInnerHTML without sanitization
   ```tsx
   // Unsafe
   <div dangerouslySetInnerHTML={{ __html: userContent }} />
   
   // Safe
   import DOMPurify from 'dompurify';
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
   ```
   
   - Sanitize user-generated content
   - Use CSP headers

2. **Authentication best practices**
   - Implement proper token storage
   ```tsx
   // Avoid storing sensitive tokens in localStorage
   localStorage.setItem('token', token); // Vulnerable to XSS
   
   // Better: Use secure, httpOnly cookies (set by server)
   // Or for SPA: Use memory state combined with refresh tokens
   ```
   
   - Use secure cookies when possible
   ```
   Set-Cookie: session=123; HttpOnly; Secure; SameSite=Strict
   ```
   
   - Implement token refresh flows

3. **Data exposure**
   - Don't expose sensitive data in client-side code
   ```tsx
   // Bad - exposing sensitive data in state
   const [user, setUser] = useState({
     name: 'John',
     email: 'john@example.com',
     ssn: '123-45-6789', // Don't include sensitive data!
     roles: ['admin'],
   });
   
   // Good - only include necessary data
   const [user, setUser] = useState({
     name: 'John',
     email: 'john@example.com',
     roles: ['admin'],
   });
   ```
   
   - Filter sensitive data before storing in state
   - Be cautious with error messages

## Backend Security

1. **API security**
   - Implement proper authentication
   ```typescript
   // Check authentication for protected routes
   function requireAuth(req, res, next) {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) {
       return res.status(401).json({ message: 'Authentication required' });
     }
     
     try {
       const decoded = verifyToken(token);
       req.user = decoded;
       next();
     } catch (error) {
       return res.status(401).json({ message: 'Invalid token' });
     }
   }
   ```
   
   - Use HTTPS everywhere
   - Validate all inputs
   ```typescript
   import { z } from 'zod';
   
   const userSchema = z.object({
     name: z.string().min(1).max(100),
     email: z.string().email(),
     age: z.number().int().positive().optional(),
   });
   
   function createUser(req, res) {
     try {
       const userData = userSchema.parse(req.body);
       // Process valid user data
     } catch (error) {
       return res.status(400).json({ errors: error.errors });
     }
   }
   ```
   
   - Rate limit sensitive endpoints
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 requests per IP
     message: 'Too many login attempts, please try again later',
   });
   
   app.post('/api/login', loginLimiter, loginHandler);
   ```

2. **Database security**
   - Implement Row Level Security in Supabase
   ```sql
   -- Example RLS policy for posts table
   CREATE POLICY "Users can view all posts"
     ON posts FOR SELECT
     USING (true);
   
   CREATE POLICY "Users can insert their own posts"
     ON posts FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update own posts"
     ON posts FOR UPDATE
     USING (auth.uid() = user_id);
   ```
   
   - Use prepared statements
   - Limit permissions to minimum needed

3. **Secret management**
   - Never commit secrets to version control
   - Use environment variables for secrets
   ```
   # .env file (add to .gitignore)
   DATABASE_URL=postgresql://user:password@localhost:5432/mydb
   API_KEY=your-secret-api-key
   ```
   
   - Rotate secrets regularly

## HTTPS and Transport Security

1. **Enforce HTTPS**
   - Redirect HTTP to HTTPS
   - Use HSTS headers
   ```
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   ```
   
2. **Implement proper CORS policy**
   ```typescript
   // Express example
   app.use(cors({
     origin: ['https://yourapp.com', 'https://staging.yourapp.com'],
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true,
   }));
   ```

3. **Use secure cookies**
   ```
   Set-Cookie: session=123; HttpOnly; Secure; SameSite=Strict
   ```

## Content Security Policy

1. **Implement CSP headers**
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; style-src 'self' https://trusted-cdn.com; img-src 'self' https://trusted-cdn.com data:; font-src 'self' https://trusted-cdn.com; connect-src 'self' https://api.yourapp.com;
   ```

2. **Prevent inline scripts**
   - Use nonce or hash-based CSP for necessary inline scripts
   ```
   Content-Security-Policy: script-src 'self' 'nonce-random123'
   
   <script nonce="random123">
     // Allowed inline script
   </script>
   ```

3. **Report CSP violations**
   ```
   Content-Security-Policy-Report-Only: default-src 'self'; report-uri https://your-report-collector.com/csp
   ```

## Security Headers

1. **Implement security headers**
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

2. **Use subresource integrity for CDN resources**
   ```html
   <script src="https://cdn.example.com/script.js" 
     integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
     crossorigin="anonymous"></script>
   ```
