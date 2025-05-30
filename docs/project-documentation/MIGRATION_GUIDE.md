# Project Migration Guide

This document provides instructions for migrating the SoundMaster Radio application between different backend services.

## Migrating from Supabase to Firebase

### Database Migration

1. **Export data from Supabase tables**
   ```bash
   # Export profiles table
   supabase db dump -t profiles > profiles_dump.sql
   
   # Export songs table
   supabase db dump -t songs > songs_dump.sql
   
   # Export radio_stations table
   supabase db dump -t radio_stations > radio_stations_dump.sql
   
   # Export radio_shows table
   supabase db dump -t radio_shows > radio_shows_dump.sql
   
   # Export settings table
   supabase db dump -t settings > settings_dump.sql
   ```

2. **Transform SQL data to Firestore format**
   ```javascript
   // Script to convert SQL dumps to Firestore JSON format
   const fs = require('fs');
   const { parse } = require('sql-parser');
   
   // Read SQL dump
   const sqlDump = fs.readFileSync('profiles_dump.sql', 'utf8');
   
   // Parse SQL to get data
   const statements = parse(sqlDump);
   
   // Transform to Firestore format
   const firestoreData = statements.map(statement => {
     // Transformation logic
     return transformedData;
   });
   
   // Write to JSON file
   fs.writeFileSync('profiles_firestore.json', JSON.stringify(firestoreData, null, 2));
   ```

3. **Import data into Firestore collections**
   ```javascript
   // Firebase admin script to import data
   const admin = require('firebase-admin');
   const fs = require('fs');
   
   admin.initializeApp({
     credential: admin.credential.applicationDefault()
   });
   
   const db = admin.firestore();
   
   // Read JSON data
   const profiles = JSON.parse(fs.readFileSync('profiles_firestore.json', 'utf8'));
   
   // Import to Firestore
   async function importData() {
     const batch = db.batch();
     
     profiles.forEach(profile => {
       const docRef = db.collection('profiles').doc(profile.id);
       batch.set(docRef, profile);
     });
     
     await batch.commit();
     console.log('Import complete!');
   }
   
   importData().catch(console.error);
   ```

4. **Update database queries in the codebase**
   
   Create a new Firebase client file:
   ```typescript
   // src/integrations/firebase/client.ts
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';
   import { getStorage } from 'firebase/storage';
   
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   
   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   export const storage = getStorage(app);
   ```
   
   Update database queries:
   ```typescript
   // Original Supabase query
   const { data, error } = await supabase
     .from('profiles')
     .select('*')
     .eq('id', userId)
     .single();
   
   // New Firebase query
   import { doc, getDoc } from 'firebase/firestore';
   import { db } from '../integrations/firebase/client';
   
   const docRef = doc(db, 'profiles', userId);
   const docSnap = await getDoc(docRef);
   
   if (docSnap.exists()) {
     const data = docSnap.data();
     // Use data
   } else {
     // Handle error
   }
   ```

### Authentication Migration

1. **Export users from Supabase Auth**
   ```bash
   # Export auth users to JSON
   supabase auth export > auth_users.json
   ```

2. **Import users into Firebase Authentication**
   ```javascript
   // Firebase admin script to import users
   const admin = require('firebase-admin');
   const fs = require('fs');
   
   admin.initializeApp({
     credential: admin.credential.applicationDefault()
   });
   
   const auth = admin.auth();
   
   // Read exported users
   const users = JSON.parse(fs.readFileSync('auth_users.json', 'utf8'));
   
   // Import users to Firebase
   async function importUsers() {
     for (const user of users) {
       try {
         await auth.createUser({
           uid: user.id,
           email: user.email,
           emailVerified: user.email_confirmed_at !== null,
           disabled: user.disabled,
           displayName: user.raw_user_meta_data.name || '',
           // Note: Password hashes cannot be directly imported
           // Users will need to reset passwords
         });
         console.log(`Imported user ${user.email}`);
       } catch (error) {
         console.error(`Error importing ${user.email}:`, error);
       }
     }
     console.log('User import complete!');
   }
   
   importUsers().catch(console.error);
   ```

3. **Update authentication logic in `src/hooks/useAuth.tsx`**
   ```typescript
   // Original Supabase auth
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password,
   });
   
   // New Firebase auth
   import { signInWithEmailAndPassword } from 'firebase/auth';
   import { auth } from '../integrations/firebase/client';
   
   try {
     const userCredential = await signInWithEmailAndPassword(auth, email, password);
     const user = userCredential.user;
     // Handle successful sign-in
   } catch (error) {
     // Handle error
   }
   ```

### Edge Functions Migration

1. **Reimplement edge functions as Firebase Cloud Functions**
   
   Create a new Firebase functions project:
   ```bash
   firebase init functions
   ```
   
   Implement the functions:
   ```typescript
   // functions/src/index.ts
   import * as functions from 'firebase-functions';
   import * as admin from 'firebase-admin';
   
   admin.initializeApp();
   
   // AI Broadcaster function
   export const aiBroadcaster = functions.https.onCall(async (data, context) => {
     // Ensure user is authenticated
     if (!context.auth) {
       throw new functions.https.HttpsError(
         'unauthenticated',
         'User must be authenticated'
       );
     }
     
     const { input, context: conversationContext } = data;
     
     // Implementation logic
     // ...
     
     return { response: 'AI response' };
   });
   
   // Send notification function
   export const sendNotification = functions.https.onCall(async (data, context) => {
     // Implementation
     // ...
     
     return { success: true };
   });
   
   // Update radio metrics function
   export const updateRadioMetrics = functions.https.onCall(async (data, context) => {
     // Implementation
     // ...
     
     return { success: true };
   });
   ```

2. **Update function invocation in the codebase**
   ```typescript
   // Original Supabase function invocation
   const { data, error } = await supabase.functions.invoke('ai-broadcaster', {
     body: { input, context }
   });
   
   // New Firebase function invocation
   import { getFunctions, httpsCallable } from 'firebase/functions';
   import { app } from '../integrations/firebase/client';
   
   const functions = getFunctions(app);
   const aiBroadcasterFunction = httpsCallable(functions, 'aiBroadcaster');
   
   try {
     const result = await aiBroadcasterFunction({ input, context });
     const data = result.data;
     // Handle result
   } catch (error) {
     // Handle error
   }
   ```

### Storage Migration

1. **Export files from Supabase Storage**
   ```bash
   # List buckets
   supabase storage list-buckets
   
   # Download files from a bucket
   supabase storage download-bucket avatars ./downloaded_avatars
   ```

2. **Import files into Firebase Storage**
   ```javascript
   // Firebase admin script to upload files
   const admin = require('firebase-admin');
   const fs = require('fs');
   const path = require('path');
   
   admin.initializeApp({
     credential: admin.credential.applicationDefault(),
     storageBucket: 'your-project-id.appspot.com'
   });
   
   const bucket = admin.storage().bucket();
   
   async function uploadFiles(directory, bucketPath) {
     const files = fs.readdirSync(directory);
     
     for (const file of files) {
       const filePath = path.join(directory, file);
       if (fs.statSync(filePath).isFile()) {
         await bucket.upload(filePath, {
           destination: `${bucketPath}/${file}`
         });
         console.log(`Uploaded ${file} to ${bucketPath}`);
       }
     }
   }
   
   uploadFiles('./downloaded_avatars', 'avatars').catch(console.error);
   ```

3. **Update storage references in the codebase**
   ```typescript
   // Original Supabase storage
   const { error } = await supabase.storage
     .from('avatars')
     .upload(fileName, file);
   
   // New Firebase storage
   import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
   import { storage } from '../integrations/firebase/client';
   
   const storageRef = ref(storage, `avatars/${fileName}`);
   
   try {
     const snapshot = await uploadBytes(storageRef, file);
     const downloadUrl = await getDownloadURL(snapshot.ref);
     // Handle success
   } catch (error) {
     // Handle error
   }
   ```

## Migrating from Supabase to Cloudflare

### Database Migration

1. **Export data from Supabase**
   ```bash
   # Export entire database
   supabase db dump > database_dump.sql
   ```

2. **Import data into Cloudflare D1**
   
   Transform SQL for D1:
   ```bash
   # Create D1 database
   wrangler d1 create soundmaster-db
   
   # Import SQL schema (modified for SQLite compatibility)
   wrangler d1 execute soundmaster-db --file=schema.sql
   ```

3. **Update database queries in the codebase**
   
   Create Cloudflare D1 client:
   ```typescript
   // src/integrations/cloudflare/client.ts
   export const fetchFromD1 = async (query, params = {}) => {
     const response = await fetch('/api/db', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ query, params }),
     });
     
     if (!response.ok) {
       throw new Error('Database query failed');
     }
     
     return response.json();
   };
   ```
   
   Implement Cloudflare Worker for database access:
   ```javascript
   // cloudflare-worker/src/index.js
   export default {
     async fetch(request, env) {
       if (request.method === 'POST' && new URL(request.url).pathname === '/api/db') {
         const { query, params } = await request.json();
         
         try {
           const result = await env.DB.prepare(query).bind(params).all();
           return new Response(JSON.stringify(result), {
             headers: { 'Content-Type': 'application/json' }
           });
         } catch (error) {
           return new Response(JSON.stringify({ error: error.message }), {
             status: 500,
             headers: { 'Content-Type': 'application/json' }
           });
         }
       }
       
       return new Response('Not found', { status: 404 });
     }
   };
   ```
   
   Update database queries:
   ```typescript
   // Original Supabase query
   const { data, error } = await supabase
     .from('profiles')
     .select('*')
     .eq('id', userId)
     .single();
   
   // New Cloudflare D1 query
   import { fetchFromD1 } from '../integrations/cloudflare/client';
   
   const { results, error } = await fetchFromD1(
     'SELECT * FROM profiles WHERE id = ?',
     [userId]
   );
   
   const profile = results?.length ? results[0] : null;
   ```

### Authentication Migration

1. **Implement custom authentication using Cloudflare Workers and JWT**
   
   Create authentication Worker:
   ```javascript
   // cloudflare-worker/src/auth.js
   import { verify, sign } from '@tsndr/cloudflare-worker-jwt';
   
   export async function login(request, env) {
     const { email, password } = await request.json();
     
     // Query user from database
     const user = await env.DB.prepare(
       'SELECT * FROM users WHERE email = ?'
     ).bind(email).first();
     
     if (!user) {
       return new Response(JSON.stringify({ error: 'User not found' }), {
         status: 404,
         headers: { 'Content-Type': 'application/json' }
       });
     }
     
     // Verify password (use proper password hashing)
     const passwordValid = await verifyPassword(password, user.password_hash);
     
     if (!passwordValid) {
       return new Response(JSON.stringify({ error: 'Invalid password' }), {
         status: 401,
         headers: { 'Content-Type': 'application/json' }
       });
     }
     
     // Create JWT token
     const token = await sign({
       sub: user.id,
       email: user.email,
       exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
     }, env.JWT_SECRET);
     
     return new Response(JSON.stringify({ token, user: { id: user.id, email: user.email } }), {
       headers: { 'Content-Type': 'application/json' }
     });
   }
   
   export async function verifyAuth(request, env) {
     const authHeader = request.headers.get('Authorization');
     
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return null;
     }
     
     const token = authHeader.split(' ')[1];
     
     try {
       const isValid = await verify(token, env.JWT_SECRET);
       
       if (!isValid) {
         return null;
       }
       
       const payload = decode(token);
       return payload;
     } catch (error) {
       return null;
     }
   }
   ```

2. **Update authentication logic in `src/hooks/useAuth.tsx`**
   ```typescript
   // Create authentication client
   // src/integrations/cloudflare/auth.ts
   export const signIn = async (email: string, password: string) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ email, password }),
     });
     
     if (!response.ok) {
       throw new Error('Authentication failed');
     }
     
     const data = await response.json();
     localStorage.setItem('authToken', data.token);
     return data.user;
   };
   
   export const signOut = () => {
     localStorage.removeItem('authToken');
   };
   
   export const getAuthToken = () => {
     return localStorage.getItem('authToken');
   };
   
   export const isAuthenticated = () => {
     return !!getAuthToken();
   };
   ```
   
   Update useAuth hook:
   ```typescript
   // src/hooks/useAuth.tsx
   import { useState, useEffect, createContext, useContext } from 'react';
   import { signIn, signOut, isAuthenticated } from '../integrations/cloudflare/auth';
   
   const AuthContext = createContext<any>(null);
   
   export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     
     // Check authentication status on mount
     useEffect(() => {
       const checkAuth = async () => {
         if (isAuthenticated()) {
           // Fetch user data
           try {
             const userData = await fetchUserData();
             setUser(userData);
           } catch (error) {
             console.error('Failed to fetch user data:', error);
             // Handle expired token
             signOut();
           }
         }
         setLoading(false);
       };
       
       checkAuth();
     }, []);
     
     const login = async (email, password) => {
       const user = await signIn(email, password);
       setUser(user);
       return user;
     };
     
     const logout = () => {
       signOut();
       setUser(null);
     };
     
     return (
       <AuthContext.Provider value={{ user, loading, login, logout }}>
         {children}
       </AuthContext.Provider>
     );
   };
   
   export const useAuth = () => {
     return useContext(AuthContext);
   };
   ```

### Edge Functions Migration

1. **Reimplement edge functions as Cloudflare Workers**
   
   Create separate Workers:
   ```javascript
   // cloudflare-worker/src/ai-broadcaster.js
   export async function handleAIBroadcaster(request, env) {
     const { input, context } = await request.json();
     
     // Implementation
     // ...
     
     return new Response(JSON.stringify({ response: 'AI response' }), {
       headers: { 'Content-Type': 'application/json' }
     });
   }
   
   // cloudflare-worker/src/send-notification.js
   export async function handleSendNotification(request, env) {
     const { userId, message, type } = await request.json();
     
     // Implementation
     // ...
     
     return new Response(JSON.stringify({ success: true }), {
       headers: { 'Content-Type': 'application/json' }
     });
   }
   ```
   
   Create router in main Worker:
   ```javascript
   // cloudflare-worker/src/index.js
   import { handleAIBroadcaster } from './ai-broadcaster';
   import { handleSendNotification } from './send-notification';
   import { login, verifyAuth } from './auth';
   
   export default {
     async fetch(request, env, ctx) {
       const url = new URL(request.url);
       
       // Simple router
       if (url.pathname === '/api/auth/login' && request.method === 'POST') {
         return login(request, env);
       }
       
       if (url.pathname === '/api/ai-broadcaster' && request.method === 'POST') {
         const auth = await verifyAuth(request, env);
         if (!auth) {
           return new Response(JSON.stringify({ error: 'Unauthorized' }), {
             status: 401,
             headers: { 'Content-Type': 'application/json' }
           });
         }
         return handleAIBroadcaster(request, env);
       }
       
       if (url.pathname === '/api/send-notification' && request.method === 'POST') {
         const auth = await verifyAuth(request, env);
         if (!auth) {
           return new Response(JSON.stringify({ error: 'Unauthorized' }), {
             status: 401,
             headers: { 'Content-Type': 'application/json' }
           });
         }
         return handleSendNotification(request, env);
       }
       
       return new Response('Not Found', { status: 404 });
     }
   };
   ```

2. **Update function invocation in the codebase**
   ```typescript
   // Original Supabase function invocation
   const { data, error } = await supabase.functions.invoke('ai-broadcaster', {
     body: { input, context }
   });
   
   // New Cloudflare Worker invocation
   import { getAuthToken } from '../integrations/cloudflare/auth';
   
   const callWorker = async (endpoint, body) => {
     const response = await fetch(`/api/${endpoint}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${getAuthToken()}`,
       },
       body: JSON.stringify(body),
     });
     
     if (!response.ok) {
       throw new Error(`Worker call failed: ${response.statusText}`);
     }
     
     return response.json();
   };
   
   // Usage
   const data = await callWorker('ai-broadcaster', { input, context });
   ```

### Storage Migration

1. **Export files from Supabase Storage**
   ```bash
   # Download files from a bucket
   supabase storage download-bucket avatars ./downloaded_avatars
   ```

2. **Import files into Cloudflare R2**
   ```bash
   # Install AWS CLI
   pip install awscli
   
   # Configure AWS CLI with R2 credentials
   aws configure
   
   # Upload files to R2 bucket
   aws s3 cp ./downloaded_avatars s3://soundmaster-bucket/avatars --recursive --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
   ```

3. **Update storage references in the codebase**
   
   Create R2 client:
   ```typescript
   // src/integrations/cloudflare/storage.ts
   export const uploadFile = async (bucket: string, path: string, file: File) => {
     const formData = new FormData();
     formData.append('file', file);
     
     const response = await fetch(`/api/storage/${bucket}/${path}`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${getAuthToken()}`,
       },
       body: formData,
     });
     
     if (!response.ok) {
       throw new Error('File upload failed');
     }
     
     return response.json();
   };
   
   export const getFileUrl = (bucket: string, path: string) => {
     return `/api/storage/${bucket}/${path}`;
   };
   ```
   
   Create storage Worker:
   ```javascript
   // cloudflare-worker/src/storage.js
   export async function handleStorage(request, env) {
     const url = new URL(request.url);
     const auth = await verifyAuth(request, env);
     
     if (!auth) {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), {
         status: 401,
         headers: { 'Content-Type': 'application/json' }
       });
     }
     
     const parts = url.pathname.split('/');
     if (parts.length < 4) {
       return new Response(JSON.stringify({ error: 'Invalid path' }), {
         status: 400,
         headers: { 'Content-Type': 'application/json' }
       });
     }
     
     const bucket = parts[2];
     const path = parts.slice(3).join('/');
     
     if (request.method === 'GET') {
       // Get file
       const object = await env.R2.get(`${bucket}/${path}`);
       
       if (object === null) {
         return new Response('Object Not Found', { status: 404 });
       }
       
       const headers = new Headers();
       object.writeHttpMetadata(headers);
       headers.set('etag', object.httpEtag);
       
       return new Response(object.body, {
         headers,
       });
     } else if (request.method === 'POST') {
       // Upload file
       const formData = await request.formData();
       const file = formData.get('file');
       
       if (!file) {
         return new Response(JSON.stringify({ error: 'No file provided' }), {
           status: 400,
           headers: { 'Content-Type': 'application/json' }
         });
       }
       
       await env.R2.put(`${bucket}/${path}`, file);
       
       return new Response(JSON.stringify({
         success: true,
         url: `/api/storage/${bucket}/${path}`
       }), {
         headers: { 'Content-Type': 'application/json' }
       });
     }
     
     return new Response('Method Not Allowed', { status: 405 });
   }
   ```
   
   Update main Worker to include storage:
   ```javascript
   // cloudflare-worker/src/index.js
   import { handleStorage } from './storage';
   
   export default {
     async fetch(request, env, ctx) {
       const url = new URL(request.url);
       
       // Add storage route
       if (url.pathname.startsWith('/api/storage/')) {
         return handleStorage(request, env);
       }
       
       // ... other routes
     }
   };
   ```
