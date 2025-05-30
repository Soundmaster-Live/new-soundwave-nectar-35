# Migration Guide

This document provides detailed instructions for migrating the SoundMaster Radio application from its current implementation with Supabase to various other backend services.

## Table of Contents
1. [Migration Overview](#migration-overview)
2. [Migrating to Firebase](#migrating-to-firebase)
3. [Migrating to AWS Amplify](#migrating-to-aws-amplify)
4. [Migrating to Cloudflare](#migrating-to-cloudflare)
5. [Local Development Setup](#local-development-setup)
6. [Docker Deployment](#docker-deployment)
7. [Database Migration](#database-migration)
8. [Authentication Migration](#authentication-migration)
9. [Serverless Functions Migration](#serverless-functions-migration)
10. [Storage Migration](#storage-migration)
11. [Post-Migration Testing](#post-migration-testing)
12. [Troubleshooting](#troubleshooting)

## Migration Overview

### Current Architecture
The application currently uses Supabase for:
- Authentication and user management
- PostgreSQL database
- Edge Functions for serverless logic
- Storage for files

### Migration Goals
The migration should:
- Preserve all current functionality
- Maintain data integrity
- Minimize downtime
- Be well-documented for future developers

### Migration Strategy
1. Export all data from the current implementation
2. Set up the new backend infrastructure
3. Import data into the new backend
4. Update application code to use the new backend
5. Test thoroughly
6. Switch over to the new backend

## Migrating to Firebase

### Step 1: Set Up Firebase Project

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore, Authentication, Storage, and Functions
3. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
4. Login to Firebase:
   ```bash
   firebase login
   ```
5. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   Select Firestore, Functions, Hosting, and Storage

### Step 2: Configure Firebase in the Application

Create a new Firebase client configuration file:

```typescript
// src/integrations/firebase/client.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
```

### Step 3: Update Authentication Implementation

Replace Supabase authentication with Firebase authentication:

```typescript
// src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../integrations/firebase/client';

interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  is_admin: boolean;
  avatar_url?: string;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
        
        if (profileDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            username: profileDoc.data().username,
            is_admin: profileDoc.data().is_admin || false,
            avatar_url: profileDoc.data().avatar_url || firebaseUser.photoURL || undefined,
            created_at: profileDoc.data().created_at
          });
        } else {
          // If profile doesn't exist yet, create it
          const newProfile = {
            username: firebaseUser.email?.split('@')[0],
            is_admin: false,
            created_at: new Date().toISOString()
          };
          
          await setDoc(doc(db, 'profiles', firebaseUser.uid), newProfile);
          
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            ...newProfile,
            avatar_url: firebaseUser.photoURL || undefined
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const newProfile = {
        username: username || email.split('@')[0],
        is_admin: false,
        created_at: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'profiles', firebaseUser.uid), newProfile);
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Step 4: Implement Firebase Database Queries

Create a utility file for Firestore database operations:

```typescript
// src/utils/firebase/dbUtils.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../integrations/firebase/client';

// Get a single document by ID
export const getById = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      return { 
        data: { id: docSnapshot.id, ...docSnapshot.data() }, 
        error: null 
      };
    } else {
      return { data: null, error: 'Document not found' };
    }
  } catch (error) {
    return { data: null, error };
  }
};

// Get all documents in a collection
export const getAll = async (collectionName: string, orderByField?: string) => {
  try {
    let queryRef = collection(db, collectionName);
    let querySnapshot;
    
    if (orderByField) {
      querySnapshot = await getDocs(query(queryRef, orderBy(orderByField)));
    } else {
      querySnapshot = await getDocs(queryRef);
    }
    
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Insert a new document
export const insert = async (collectionName: string, data: any) => {
  try {
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      created_at: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamps);
    return { data: { id: docRef.id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Update a document
export const update = async (collectionName: string, id: string, data: any) => {
  try {
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      updated_at: Timestamp.now()
    };
    
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, dataWithTimestamps);
    return { data: { id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Delete a document
export const remove = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return { data: { id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Query documents with filters
export const queryDocuments = async (collectionName: string, filters: Array<{field: string, operator: any, value: any}>, orderByField?: string) => {
  try {
    let queryRef = collection(db, collectionName);
    
    // Build query with filters
    const queryConstraints = filters.map(filter => 
      where(filter.field, filter.operator, filter.value)
    );
    
    if (orderByField) {
      queryConstraints.push(orderBy(orderByField));
    }
    
    const querySnapshot = await getDocs(query(queryRef, ...queryConstraints));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
```

### Step 5: Implement Firebase Functions

1. Create Firebase Cloud Functions for backend logic:

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as OpenAI from 'openai';

admin.initializeApp();
const db = admin.firestore();

// Express app for API endpoints
const app = express();
app.use(cors({ origin: true }));

// AI Broadcaster function
app.post('/ai-broadcaster', async (req, res) => {
  try {
    const { prompt, topic } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    // Create system message based on topic
    let systemMessage = "You are a friendly radio DJ on SoundMaster Radio.";
    
    switch (topic) {
      case "welcome":
        systemMessage += " Introduce yourself with a name you choose, mention it's a great day for music, and invite listeners to enjoy the stream. Keep it brief and enthusiastic.";
        break;
      case "news":
        systemMessage += " Deliver a brief news update with 2-3 current headlines related to music, entertainment or pop culture. Be engaging and conversational.";
        break;
      // ... other topic cases
      default:
        systemMessage += " Provide a brief, engaging update for listeners in a conversational tone.";
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI.OpenAI({
      apiKey: functions.config().openai.key
    });
    
    // Generate AI response
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const aiResponse = response.choices[0].message.content;
    
    return res.status(200).json({
      text: aiResponse,
      topic: topic || "general"
    });
  } catch (error) {
    console.error("Error in AI broadcaster:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Send notification function
app.post('/send-notification', async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    
    // Validate inputs
    if (!userId || !message || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Store the notification in Firestore
    await db.collection('notifications').add({
      user_id: userId,
      type,
      message,
      read: false,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error("Error in send-notification:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Update radio metrics function
app.post('/update-radio-metrics', async (req, res) => {
  try {
    // Get all radio stations
    const stationsSnapshot = await db.collection('radio_stations').get();
    
    for (const stationDoc of stationsSnapshot.docs) {
      const stationId = stationDoc.id;
      
      // Get analytics for this station
      const analyticsQuery = await db.collection('station_analytics')
        .where('station_id', '==', stationId)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();
      
      if (!analyticsQuery.empty) {
        const analyticsData = analyticsQuery.docs[0].data();
        
        // Update station metrics
        await stationDoc.ref.update({
          listeners_count: analyticsData.listeners_count,
          peak_listeners: Math.max(stationDoc.data().peak_listeners || 0, analyticsData.listeners_count || 0)
        });
      }
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating radio metrics:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Expose Express API as a single Cloud Function
exports.api = functions.https.onRequest(app);
```

2. Configure Firebase Functions:

```bash
# Deploy Firebase functions
firebase deploy --only functions
```

### Step 6: Update API Integration

Create a utility file for Firebase Functions calls:

```typescript
// src/utils/firebase/functionsUtils.ts
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../integrations/firebase/client';

// Call AI Broadcaster function
export const generateAIBroadcasterContent = async (prompt: string, topic: string) => {
  try {
    const aiBroadcasterFunction = httpsCallable(functions, 'api/ai-broadcaster');
    const result = await aiBroadcasterFunction({ prompt, topic });
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error calling AI broadcaster function:', error);
    return { data: null, error };
  }
};

// Send notification function
export const sendNotification = async (userId: string, message: string, type: string) => {
  try {
    const sendNotificationFunction = httpsCallable(functions, 'api/send-notification');
    const result = await sendNotificationFunction({ userId, message, type });
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { data: null, error };
  }
};
```

### Step 7: Update Storage Implementation

Create utility functions for Firebase Storage:

```typescript
// src/utils/firebase/storageUtils.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../integrations/firebase/client';

// Upload file
export const uploadFile = async (bucketPath: string, file: File) => {
  try {
    const storageRef = ref(storage, bucketPath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { data: { path: bucketPath, url: downloadURL }, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
};

// Get file URL
export const getFileURL = async (bucketPath: string) => {
  try {
    const storageRef = ref(storage, bucketPath);
    const url = await getDownloadURL(storageRef);
    
    return { data: { url }, error: null };
  } catch (error) {
    console.error('Error getting file URL:', error);
    return { data: null, error };
  }
};

// Delete file
export const deleteFile = async (bucketPath: string) => {
  try {
    const storageRef = ref(storage, bucketPath);
    await deleteObject(storageRef);
    
    return { data: { path: bucketPath }, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { data: null, error };
  }
};
```

### Step 8: Update Environment Variables

Create `.env.firebase` file:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Step 9: Data Migration

1. Export data from Supabase
2. Transform data to Firestore format
3. Import data into Firestore

## Migrating to AWS Amplify

### Step 1: Set Up AWS Amplify

1. Install Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure Amplify:
   ```bash
   amplify configure
   ```
   Follow the prompts to create an IAM user.

3. Initialize Amplify in your project:
   ```bash
   amplify init
   ```
   Follow the prompts to set up your project.

4. Add authentication:
   ```bash
   amplify add auth
   ```

5. Add storage (DynamoDB):
   ```bash
   amplify add storage
   ```

6. Add API (AppSync GraphQL):
   ```bash
   amplify add api
   ```

7. Add functions:
   ```bash
   amplify add function
   ```

8. Add storage (S3):
   ```bash
   amplify add storage
   ```

9. Deploy resources:
   ```bash
   amplify push
   ```

### Step 2: Configure Amplify in the Application

```typescript
// src/integrations/amplify/client.ts
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

export { Amplify };
```

### Step 3: Update Authentication Implementation

```typescript
// src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { getProfile } from '../graphql/queries';
import { createProfile } from '../graphql/mutations';

interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  is_admin: boolean;
  avatar_url?: string;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        
        try {
          // Get user profile
          const profileData = await API.graphql(graphqlOperation(getProfile, { id: userData.username }));
          const profile = profileData.data.getProfile;
          
          if (profile) {
            setUser({
              id: userData.username,
              email: userData.attributes.email,
              username: profile.username,
              is_admin: profile.is_admin || false,
              avatar_url: profile.avatar_url,
              created_at: profile.created_at
            });
          } else {
            // Create profile if it doesn't exist
            const newProfile = {
              id: userData.username,
              username: userData.attributes.email.split('@')[0],
              is_admin: false,
              created_at: new Date().toISOString()
            };
            
            await API.graphql(graphqlOperation(createProfile, { input: newProfile }));
            
            setUser({
              id: userData.username,
              email: userData.attributes.email,
              ...newProfile
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    
    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await Auth.signIn(email, password);
      
      // Reload user after sign-in
      const userData = await Auth.currentAuthenticatedUser();
      const profileData = await API.graphql(graphqlOperation(getProfile, { id: userData.username }));
      const profile = profileData.data.getProfile;
      
      setUser({
        id: userData.username,
        email: userData.attributes.email,
        username: profile.username,
        is_admin: profile.is_admin || false,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at
      });
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email
        }
      });
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Migrating to Cloudflare

### Step 1: Set Up Cloudflare Services

1. Create a Cloudflare account or use an existing one
2. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
3. Login to Cloudflare:
   ```bash
   wrangler login
   ```
4. Initialize Wrangler:
   ```bash
   wrangler init
   ```

### Step 2: Configure Cloudflare Pages

1. Create a `wrangler.toml` file:
   ```toml
   name = "soundmaster-radio"
   type = "javascript"
   account_id = "<your-account-id>"
   workers_dev = true
   
   [site]
   bucket = "./dist"
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   npm run build
   wrangler publish
   ```

### Step 3: Create Cloudflare Workers

1. Create a KV namespace for storing settings:
   ```bash
   wrangler kv:namespace create SETTINGS
   ```

2. Create a D1 database for storing application data:
   ```bash
   wrangler d1 create soundmaster-db
   ```

3. Update `wrangler.toml` with KV and D1 bindings:
   ```toml
   [[kv_namespaces]]
   binding = "SETTINGS"
   id = "<your-kv-namespace-id>"
   
   [[d1_databases]]
   binding = "DB"
   database_name = "soundmaster-db"
   database_id = "<your-database-id>"
   ```

4. Create a Worker for API functionality:
   ```typescript
   // workers/api/index.js
   export default {
     async fetch(request, env, ctx) {
       const url = new URL(request.url);
       const path = url.pathname.replace('/api/', '');
       
       // Handle CORS
       if (request.method === 'OPTIONS') {
         return new Response(null, {
           headers: {
             'Access-Control-Allow-Origin': '*',
             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
             'Access-Control-Allow-Headers': 'Content-Type, Authorization'
           }
         });
       }
       
       // Route requests
       if (path.startsWith('ai-broadcaster')) {
         return handleAIBroadcaster(request, env);
       } else if (path.startsWith('send-notification')) {
         return handleSendNotification(request, env);
       } else if (path.startsWith('update-radio-metrics')) {
         return handleUpdateRadioMetrics(request, env);
       }
       
       return new Response('Not Found', { status: 404 });
     }
   };
   
   async function handleAIBroadcaster(request, env) {
     try {
       const { prompt, topic } = await request.json();
       
       if (!prompt) {
         return new Response(JSON.stringify({ error: 'No prompt provided' }), {
           status: 400,
           headers: { 'Content-Type': 'application/json' }
         });
       }
       
       // Get OpenAI API key from KV
       const openaiApiKey = await env.SETTINGS.get('OPENAI_API_KEY');
       
       // Create system message based on topic
       let systemMessage = "You are a friendly radio DJ on SoundMaster Radio.";
       // ... add topic-specific content to the system message
       
       // Make API call to OpenAI
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${openaiApiKey}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           model: 'gpt-4o-mini',
           messages: [
             { role: 'system', content: systemMessage },
             { role: 'user', content: prompt }
           ],
           temperature: 0.7,
           max_tokens: 300
         })
       });
       
       const data = await response.json();
       
       return new Response(JSON.stringify({
         text: data.choices[0].message.content,
         topic: topic || 'general'
       }), {
         headers: { 'Content-Type': 'application/json' }
       });
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' }
       });
     }
   }
   
   // Other handler functions...
   ```

## Local Development Setup

### Step 1: Configure PostgreSQL Database

1. Install PostgreSQL
2. Create a new database:
   ```sql
   CREATE DATABASE soundmaster;
   ```
3. Import schema:
   ```bash
   psql -d soundmaster -f database_schema.sql
   ```
4. Import data:
   ```bash
   psql -d soundmaster -f database_data.sql
   ```

### Step 2: Set Up Express Backend

1. Create an Express server for local development:
   ```typescript
   // server/index.ts
   import express from 'express';
   import cors from 'cors';
   import pg from 'pg';
   import dotenv from 'dotenv';
   
   dotenv.config();
   
   const app = express();
   const port = process.env.PORT || 3000;
   
   // Middleware
   app.use(cors());
   app.use(express.json());
   
   // Database connection
   const pool = new pg.Pool({
     connectionString: process.env.DATABASE_URL
   });
   
   // API routes
   app.get('/api/profiles/:id', async (req, res) => {
     try {
       const { id } = req.params;
       const result = await pool.query(
         'SELECT * FROM profiles WHERE id = $1',
         [id]
       );
       
       if (result.rows.length === 0) {
         return res.status(404).json({ error: 'Profile not found' });
       }
       
       res.json(result.rows[0]);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   // Additional API routes...
   
   // Start server
   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

2. Create API client for the frontend:
   ```typescript
   // src/integrations/api/client.ts
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
   
   export const apiClient = {
     async get(endpoint: string) {
       try {
         const response = await fetch(`${API_URL}/${endpoint}`);
         if (!response.ok) {
           throw new Error(`HTTP error ${response.status}`);
         }
         return await response.json();
       } catch (error) {
         console.error(`API GET error: ${endpoint}`, error);
         throw error;
       }
     },
     
     async post(endpoint: string, data: any) {
       try {
         const response = await fetch(`${API_URL}/${endpoint}`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(data)
         });
         
         if (!response.ok) {
           throw new Error(`HTTP error ${response.status}`);
         }
         
         return await response.json();
       } catch (error) {
         console.error(`API POST error: ${endpoint}`, error);
         throw error;
       }
     },
     
     // Additional methods...
   };
   ```

### Step 3: Configure Environment Variables

Create `.env.local` file:

```
VITE_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://username:password@localhost:5432/soundmaster
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Docker Deployment

### Step 1: Create Dockerfile for Frontend

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

### Step 2: Create Dockerfile for Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### Step 3: Create Docker Compose Configuration

```yaml
version: '3'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/soundmaster
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:14
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=soundmaster
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

### Step 4: Create Nginx Configuration

```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Database Migration

### Migrating from PostgreSQL to Other Databases

#### To Firebase Firestore

1. Export data from PostgreSQL:
   ```bash
   psql -d soundmaster -c "COPY (SELECT json_agg(profiles) FROM profiles) TO '/tmp/profiles.json'"
   # Repeat for other tables
   ```

2. Transform data for Firestore:
   ```javascript
   const fs = require('fs');
   const admin = require('firebase-admin');
   
   // Initialize Firebase Admin SDK
   const serviceAccount = require('./serviceAccountKey.json');
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   
   const db = admin.firestore();
   
   // Read and transform data
   const profiles = JSON.parse(fs.readFileSync('/tmp/profiles.json', 'utf8'));
   
   // Import data to Firestore
   async function importProfiles() {
     const batch = db.batch();
     
     profiles.forEach(profile => {
       const docRef = db.collection('profiles').doc(profile.id);
       batch.set(docRef, {
         username: profile.username,
         is_admin: profile.is_admin,
         created_at: profile.created_at,
         avatar_url: profile.avatar_url
       });
     });
     
     await batch.commit();
     console.log('Profiles imported successfully');
   }
   
   importProfiles().catch(console.error);
   ```

#### To MongoDB

1. Export data from PostgreSQL:
   ```bash
   psql -d soundmaster -c "COPY (SELECT json_agg(profiles) FROM profiles) TO '/tmp/profiles.json'"
   # Repeat for other tables
   ```

2. Import data to MongoDB:
   ```javascript
   const fs = require('fs');
   const { MongoClient } = require('mongodb');
   
   const uri = "mongodb://localhost:27017";
   const client = new MongoClient(uri);
   
   async function importData() {
     try {
       await client.connect();
       const db = client.db("soundmaster");
       
       // Import profiles
       const profiles = JSON.parse(fs.readFileSync('/tmp/profiles.json', 'utf8'));
       await db.collection('profiles').insertMany(profiles);
       
       console.log('Data imported successfully');
     } finally {
       await client.close();
     }
   }
   
   importData().catch(console.error);
   ```

## Authentication Migration

### From Supabase Auth to Custom JWT Authentication

1. Create JWT utility functions:
   ```typescript
   // src/utils/auth/jwtUtils.ts
   import jwt from 'jsonwebtoken';
   
   const JWT_SECRET = process.env.JWT_SECRET;
   const JWT_EXPIRY = '24h';
   
   export const generateToken = (userId: string, email: string, isAdmin: boolean) => {
     return jwt.sign(
       { sub: userId, email, is_admin: isAdmin },
       JWT_SECRET,
       { expiresIn: JWT_EXPIRY }
     );
   };
   
   export const verifyToken = (token: string) => {
     try {
       return jwt.verify(token, JWT_SECRET);
     } catch (error) {
       return null;
     }
   };
   ```

2. Create authentication endpoints:
   ```typescript
   // server/routes/auth.ts
   import express from 'express';
   import bcrypt from 'bcrypt';
   import { generateToken } from '../utils/jwtUtils';
   
   const router = express.Router();
   
   router.post('/signup', async (req, res) => {
     try {
       const { email, password, username } = req.body;
       
       // Check if user already exists
       const existingUser = await db.query(
         'SELECT * FROM users WHERE email = $1',
         [email]
       );
       
       if (existingUser.rows.length > 0) {
         return res.status(400).json({ error: 'Email already in use' });
       }
       
       // Hash password
       const hashedPassword = await bcrypt.hash(password, 10);
       
       // Create user
       const result = await db.query(
         'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
         [email, hashedPassword]
       );
       
       const userId = result.rows[0].id;
       
       // Create profile
       await db.query(
         'INSERT INTO profiles (id, username, is_admin) VALUES ($1, $2, $3)',
         [userId, username || email.split('@')[0], false]
       );
       
       // Generate JWT
       const token = generateToken(userId, email, false);
       
       res.status(201).json({ token });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   router.post('/signin', async (req, res) => {
     try {
       const { email, password } = req.body;
       
       // Find user
       const result = await db.query(
         'SELECT u.id, u.email, u.password_hash, p.is_admin FROM users u JOIN profiles p ON u.id = p.id WHERE u.email = $1',
         [email]
       );
       
       if (result.rows.length === 0) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }
       
       const user = result.rows[0];
       
       // Verify password
       const isPasswordValid = await bcrypt.compare(password, user.password_hash);
       
       if (!isPasswordValid) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }
       
       // Generate JWT
       const token = generateToken(user.id, user.email, user.is_admin);
       
       res.json({ token });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   export default router;
   ```

## Serverless Functions Migration

### From Supabase Edge Functions to AWS Lambda

1. Create a Lambda function for AI broadcaster:
   ```typescript
   // lambda/ai-broadcaster/index.js
   const OpenAI = require('openai');
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY
   });
   
   exports.handler = async (event) => {
     try {
       const body = JSON.parse(event.body);
       const { prompt, topic } = body;
       
       if (!prompt) {
         return {
           statusCode: 400,
           headers: {
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': '*'
           },
           body: JSON.stringify({ error: 'No prompt provided' })
         };
       }
       
       // Create system message based on topic
       let systemMessage = "You are a friendly radio DJ on SoundMaster Radio.";
       // ... add topic-specific content
       
       const response = await openai.chat.completions.create({
         model: "gpt-4o-mini",
         messages: [
           { role: "system", content: systemMessage },
           { role: "user", content: prompt }
         ],
         temperature: 0.7,
         max_tokens: 300
       });
       
       const aiResponse = response.choices[0].message.content;
       
       return {
         statusCode: 200,
         headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*'
         },
         body: JSON.stringify({
           text: aiResponse,
           topic: topic || "general"
         })
       };
     } catch (error) {
       console.error("Error in AI broadcaster:", error);
       
       return {
         statusCode: 500,
         headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*'
         },
         body: JSON.stringify({ error: error.message })
       };
     }
   };
   ```

2. Create Lambda client for the frontend:
   ```typescript
   // src/integrations/aws/lambdaClient.ts
   const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
   
   export const invokeFunction = async (functionName: string, payload: any) => {
     try {
       const response = await fetch(`${API_URL}/${functionName}`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(payload)
       });
       
       if (!response.ok) {
         throw new Error(`HTTP error ${response.status}`);
       }
       
       return await response.json();
     } catch (error) {
       console.error(`Lambda function error: ${functionName}`, error);
       throw error;
     }
   };
   ```

## Storage Migration

### From Supabase Storage to S3

1. Export files from Supabase Storage
2. Upload files to S3:
   ```javascript
   const AWS = require('aws-sdk');
   const fs = require('fs');
   const path = require('path');
   
   // Configure AWS
   AWS.config.update({
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
     region: process.env.AWS_REGION
   });
   
   const s3 = new AWS.S3();
   
   // Function to upload a file to S3
   async function uploadFile(filePath, bucketName, key) {
     const fileContent = fs.readFileSync(filePath);
     
     const params = {
       Bucket: bucketName,
       Key: key,
       Body: fileContent,
       ContentType: getContentType(filePath)
     };
     
     try {
       const data = await s3.upload(params).promise();
       console.log(`File uploaded successfully: ${data.Location}`);
       return data.Location;
     } catch (error) {
       console.error(`Error uploading file: ${error}`);
       throw error;
     }
   }
   
   // Helper to determine content type
   function getContentType(filePath) {
     const ext = path.extname(filePath).toLowerCase();
     switch (ext) {
       case '.jpg':
       case '.jpeg':
         return 'image/jpeg';
       case '.png':
         return 'image/png';
       case '.gif':
         return 'image/gif';
       case '.mp3':
         return 'audio/mpeg';
       default:
         return 'application/octet-stream';
     }
   }
   
   // Example usage
   uploadFile('path/to/file.jpg', 'my-bucket', 'avatars/user123/profile.jpg');
   ```

3. Update storage client in the application:
   ```typescript
   // src/utils/aws/storageUtils.ts
   import AWS from 'aws-sdk';
   
   // Configure AWS
   AWS.config.update({
     region: import.meta.env.VITE_AWS_REGION,
     credentials: new AWS.CognitoIdentityCredentials({
       IdentityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID
     })
   });
   
   const s3 = new AWS.S3();
   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
   
   export const uploadFile = async (filePath: string, file: File) => {
     try {
       const params = {
         Bucket: bucketName,
         Key: filePath,
         Body: file,
         ContentType: file.type
       };
       
       const { Location } = await s3.upload(params).promise();
       
       return { data: { path: filePath, url: Location }, error: null };
     } catch (error) {
       console.error('Error uploading file:', error);
       return { data: null, error };
     }
   };
   
   export const getFileURL = (filePath: string) => {
     try {
       const params = {
         Bucket: bucketName,
         Key: filePath,
         Expires: 3600 // URL expires in 1 hour
       };
       
       const url = s3.getSignedUrl('getObject', params);
       
       return { data: { url }, error: null };
     } catch (error) {
       console.error('Error getting file URL:', error);
       return { data: null, error };
     }
   };
   
   export const deleteFile = async (filePath: string) => {
     try {
       const params = {
         Bucket: bucketName,
         Key: filePath
       };
       
       await s3.deleteObject(params).promise();
       
       return { data: { path: filePath }, error: null };
     } catch (error) {
       console.error('Error deleting file:', error);
       return { data: null, error };
     }
   };
   ```

## Post-Migration Testing

### Testing Checklist

1. **Authentication**
   - [ ] User registration
   - [ ] User login
   - [ ] Password reset
   - [ ] Session persistence
   - [ ] Profile access

2. **Data Access**
   - [ ] Radio stations list
   - [ ] Song list
   - [ ] User profile data
   - [ ] Admin-only data

3. **AI Features**
   - [ ] Text generation
   - [ ] Text-to-speech conversion
   - [ ] Broadcaster functionality

4. **File Storage**
   - [ ] File uploads
   - [ ] File retrieval
   - [ ] File deletion

5. **Real-time Features**
   - [ ] Live radio streaming
   - [ ] Chat functionality

### Automated Testing

Create automated tests for critical functionality:

```typescript
// tests/auth.test.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('User can register', async ({ page }) => {
    await page.goto('/auth?tab=signup');
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard after successful signup
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('User can login', async ({ page }) => {
    await page.goto('/auth?tab=signin');
    await page.fill('input[name="email"]', 'existing@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard after successful login
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Troubleshooting

### Common Migration Issues

#### Authentication Issues

**Problem**: Users cannot login after migration
**Solution**: Check the authentication flow in the new implementation. Ensure that:
1. The login endpoint is correctly configured
2. User credentials are properly validated
3. JWT tokens are correctly generated and stored
4. The client correctly sends authentication headers with requests

#### Database Connection Issues

**Problem**: Application cannot connect to the database
**Solution**:
1. Verify database connection string is correct
2. Ensure database credentials are valid
3. Check network access to the database server
4. Verify that the database schema is correctly migrated

#### API Integration Issues

**Problem**: API calls fail after migration
**Solution**:
1. Check API endpoint URLs
2. Verify authentication is correctly set up for API calls
3. Ensure request and response formats match the expected schema
4. Check CORS configuration if API calls are cross-origin

#### Data Migration Issues

**Problem**: Missing or incorrect data after migration
**Solution**:
1. Verify all tables were migrated
2. Check data transformation logic for any errors
3. Compare record counts between old and new databases
4. Run data validation queries to check for consistency

#### File Storage Issues

**Problem**: Files are inaccessible after migration
**Solution**:
1. Verify all files were transferred to the new storage
2. Check file permissions in the new storage system
3. Update file URLs in the database to point to the new storage
4. Ensure the application has the correct credentials to access the storage
