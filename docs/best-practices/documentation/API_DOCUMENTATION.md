
# API Documentation Best Practices

## Endpoint Documentation

1. **Document endpoints and parameters**
   ```markdown
   ## Users API
   
   ### GET /api/users
   
   Returns a list of users.
   
   #### Query Parameters
   
   | Parameter | Type   | Required | Description                  |
   |-----------|--------|----------|------------------------------|
   | page      | number | No       | Page number (default: 1)     |
   | limit     | number | No       | Items per page (default: 10) |
   | search    | string | No       | Search term for user name    |
   
   #### Response
   
   ```json
   {
     "users": [
       {
         "id": "123",
         "name": "John Doe",
         "email": "john@example.com"
       }
     ],
     "pagination": {
       "total": 50,
       "page": 1,
       "limit": 10,
       "pages": 5
     }
   }
   ```
   ```

2. **Document request bodies**
   ```markdown
   ### POST /api/users
   
   Creates a new user.
   
   #### Request Body
   
   ```json
   {
     "name": "Jane Doe",
     "email": "jane@example.com",
     "role": "user",
     "metadata": {
       "department": "Engineering",
       "location": "Remote"
     }
   }
   ```
   
   | Field      | Type    | Required | Description                      |
   |------------|---------|----------|----------------------------------|
   | name       | string  | Yes      | User's full name                 |
   | email      | string  | Yes      | User's email address             |
   | role       | string  | No       | User role (default: "user")      |
   | metadata   | object  | No       | Additional user metadata         |
   
   #### Response
   
   ```json
   {
     "id": "456",
     "name": "Jane Doe",
     "email": "jane@example.com",
     "role": "user",
     "metadata": {
       "department": "Engineering",
       "location": "Remote"
     },
     "createdAt": "2023-04-01T12:00:00Z"
   }
   ```
   ```

3. **Document error responses**
   ```markdown
   ### Error Responses
   
   This API uses conventional HTTP response codes to indicate success or failure.
   
   | Code | Description                                                |
   |------|------------------------------------------------------------|
   | 200  | Success                                                    |
   | 400  | Bad Request - The request was malformed or missing data    |
   | 401  | Unauthorized - Authentication required                     |
   | 403  | Forbidden - Valid authentication but insufficient access   |
   | 404  | Not Found - The requested resource doesn't exist           |
   | 429  | Too Many Requests - Rate limit exceeded                    |
   | 500  | Server Error - Something went wrong on the server          |
   
   #### Error Response Format
   
   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid input data",
       "details": [
         {
           "field": "email",
           "message": "Must be a valid email address"
         }
       ]
     }
   }
   ```
   ```

## Authentication Documentation

1. **Document authentication requirements**
   ```markdown
   ### Authentication
   
   This API uses token-based authentication. Include the token in the Authorization header:
   
   ```
   Authorization: Bearer YOUR_TOKEN
   ```
   
   To obtain a token, use the `/api/auth/login` endpoint.
   
   ### Rate Limiting
   
   API requests are limited to:
   
   - 100 requests per minute for authenticated users
   - 20 requests per minute for unauthenticated users
   
   Rate limit headers in responses:
   
   ```
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 95
   X-RateLimit-Reset: 1617392040
   ```
   ```

2. **Document authorization levels**
   ```markdown
   ### Authorization
   
   The API uses role-based access control with the following roles:
   
   | Role        | Description                                       |
   |-------------|---------------------------------------------------|
   | user        | Standard user with access to their own resources  |
   | admin       | Administrator with access to all resources        |
   | moderator   | Can moderate content but can't modify users       |
   
   #### Permission Matrix
   
   | Endpoint             | user | moderator | admin |
   |----------------------|------|-----------|-------|
   | GET /api/users       | ❌    | ✅         | ✅     |
   | GET /api/users/{id}  | ⚠️    | ✅         | ✅     |
   | POST /api/users      | ❌    | ❌         | ✅     |
   | PUT /api/users/{id}  | ⚠️    | ❌         | ✅     |
   | DELETE /api/users/{id}| ⚠️    | ❌         | ✅     |
   
   ⚠️ Users can only access or modify their own resources
   ```

3. **Document authentication flows**
   ```markdown
   ### Authentication Flows
   
   #### Password-based Authentication
   
   1. Client sends credentials to `/api/auth/login`
      ```json
      {
        "email": "user@example.com",
        "password": "securepassword"
      }
      ```
   
   2. Server validates credentials and returns tokens
      ```json
      {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresIn": 3600
      }
      ```
   
   3. Client includes the access token in subsequent requests
      ```
      Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      ```
   
   4. When the access token expires, use the refresh token to get a new one
      ```
      POST /api/auth/refresh
      Content-Type: application/json
      
      {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
      ```
   
   #### OAuth Authentication
   
   1. Redirect the user to the authorization URL
      ```
      GET /api/auth/oauth/google
      ```
   
   2. User authenticates with the provider and is redirected back with a code
   
   3. Exchange the code for tokens
      ```
      POST /api/auth/oauth/google/callback
      Content-Type: application/json
      
      {
        "code": "4/0AY0e-g6..."
      }
      ```
   
   4. Server returns tokens as in the password flow
   ```

## API Integration

1. **Document API client usage**
   ```markdown
   ## API Client Usage
   
   The API client provides type-safe access to the API endpoints.
   
   ### Setup
   
   ```typescript
   import { createApiClient } from '@/api';
   
   const api = createApiClient({
     baseUrl: 'https://api.example.com',
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```
   
   ### Authentication
   
   ```typescript
   // Login
   const { data } = await api.auth.login({
     email: 'user@example.com',
     password: 'password',
   });
   
   // Set auth token for future requests
   api.setToken(data.accessToken);
   
   // Logout
   await api.auth.logout();
   ```
   
   ### Making Requests
   
   ```typescript
   // Get users with pagination
   const { data: users } = await api.users.list({
     page: 1,
     limit: 10,
     search: 'John',
   });
   
   // Get a specific user
   const { data: user } = await api.users.get('123');
   
   // Create a user
   const { data: newUser } = await api.users.create({
     name: 'Jane Doe',
     email: 'jane@example.com',
   });
   
   // Update a user
   const { data: updatedUser } = await api.users.update('123', {
     name: 'Jane Smith',
   });
   
   // Delete a user
   await api.users.delete('123');
   ```
   ```

2. **Document API integration with hooks**
   ```markdown
   ## API Integration with React Query
   
   We use React Query for data fetching and state management.
   
   ### Fetching Data
   
   ```tsx
   import { useQuery } from '@tanstack/react-query';
   import { api } from '@/api';
   
   function UserList() {
     const { data, isLoading, error } = useQuery({
       queryKey: ['users'],
       queryFn: () => api.users.list(),
     });
   
     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;
   
     return (
       <ul>
         {data.users.map(user => (
           <li key={user.id}>{user.name}</li>
         ))}
       </ul>
     );
   }
   ```
   
   ### Creating and Updating Data
   
   ```tsx
   import { useMutation, useQueryClient } from '@tanstack/react-query';
   import { api } from '@/api';
   
   function CreateUserForm() {
     const queryClient = useQueryClient();
     
     const mutation = useMutation({
       mutationFn: (userData) => api.users.create(userData),
       onSuccess: () => {
         // Invalidate and refetch users list
         queryClient.invalidateQueries({ queryKey: ['users'] });
       },
     });
   
     const handleSubmit = (e) => {
       e.preventDefault();
       const formData = new FormData(e.target);
       
       mutation.mutate({
         name: formData.get('name'),
         email: formData.get('email'),
       });
     };
   
     return (
       <form onSubmit={handleSubmit}>
         {/* Form fields */}
         <button type="submit" disabled={mutation.isPending}>
           {mutation.isPending ? 'Creating...' : 'Create User'}
         </button>
         {mutation.isError && <div>Error: {mutation.error.message}</div>}
       </form>
     );
   }
   ```
   ```

3. **Document websocket APIs**
   ```markdown
   ## WebSocket API
   
   The WebSocket API provides real-time updates for certain resources.
   
   ### Connection
   
   Connect to the WebSocket API at:
   
   ```
   wss://api.example.com/ws
   ```
   
   Include authentication by passing the access token:
   
   ```
   wss://api.example.com/ws?token=YOUR_ACCESS_TOKEN
   ```
   
   ### Message Format
   
   All messages use JSON format with the following structure:
   
   ```json
   {
     "type": "message_type",
     "payload": {}
   }
   ```
   
   ### Available Events
   
   #### Server-to-Client Events
   
   | Event Type        | Description                         | Payload Example                            |
   |-------------------|-------------------------------------|-------------------------------------------|
   | `user_updated`    | User data has been updated          | `{ "id": "123", "name": "Updated Name" }` |
   | `message_created` | New message created                 | `{ "id": "456", "text": "Hello!" }`       |
   | `status_changed`  | Resource status changed             | `{ "resource": "job", "id": "789", "status": "completed" }` |
   
   #### Client-to-Server Events
   
   | Event Type        | Description                         | Payload Example                            |
   |-------------------|-------------------------------------|-------------------------------------------|
   | `subscribe`       | Subscribe to a resource updates     | `{ "resource": "messages", "id": "all" }`  |
   | `unsubscribe`     | Unsubscribe from resource updates   | `{ "resource": "messages", "id": "all" }`  |
   | `ping`            | Check connection status             | `{}`                                       |
   
   ### Integration Example
   
   ```typescript
   class WebSocketClient {
     private socket: WebSocket;
     private listeners: Map<string, Function[]> = new Map();
   
     constructor(url: string, token: string) {
       this.socket = new WebSocket(`${url}?token=${token}`);
       
       this.socket.onmessage = (event) => {
         const data = JSON.parse(event.data);
         const listeners = this.listeners.get(data.type) || [];
         
         listeners.forEach(listener => listener(data.payload));
       };
     }
   
     public subscribe(resource: string, id: string) {
       this.socket.send(JSON.stringify({
         type: 'subscribe',
         payload: { resource, id }
       }));
     }
   
     public on(eventType: string, callback: Function) {
       const listeners = this.listeners.get(eventType) || [];
       listeners.push(callback);
       this.listeners.set(eventType, listeners);
     }
   
     // Additional methods...
   }
   ```
   ```
