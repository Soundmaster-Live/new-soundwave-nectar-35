
# Architecture

This document provides a detailed overview of the SoundMaster Radio application architecture.

## Component Architecture

The application uses a component-based architecture with:
- Reusable UI components
- Custom hooks for business logic
- Context providers for global state
- Route-based code splitting

### Directory Structure
```
/src
  /components       # Reusable UI components
    /ui             # Base UI components from shadcn/ui
    /streaming      # Audio streaming components
    /ai-broadcaster # AI DJ components
    /navbar         # Navigation components
    /home           # Home page components
    /auth           # Authentication components
    /admin          # Admin dashboard components
  /hooks            # Custom React hooks
  /contexts         # React context providers
  /pages            # Page components
  /utils            # Utility functions
    /ai             # AI integration utilities
  /lib              # Library code and helpers
  /types            # TypeScript type definitions
  /integrations     # External service integrations
```

## Frontend Architecture

### Component Design Principles
1. **Composition over inheritance**: Building complex components from smaller ones
2. **Single responsibility**: Each component should do one thing well
3. **Container/presentation pattern**: Separating logic from presentation
4. **Custom hooks**: Extracting reusable stateful logic

### State Management Strategy
1. **Local component state**: For UI-specific state
2. **React Context**: For global application state
3. **React Query**: For server state and data fetching
4. **URL state**: For navigation and preservation across refreshes

## Backend Architecture

### Supabase Integration
The backend is implemented using Supabase, with these key components:

1. **Authentication**: User management and session handling
2. **Database**: PostgreSQL for data storage with Row Level Security
3. **Edge Functions**: Serverless functions for backend logic
4. **Storage**: File storage for media and assets

### Data Flow
1. User actions in the frontend trigger API calls
2. Requests are authenticated using JWT tokens
3. Supabase processes requests through RLS policies
4. Responses are cached when appropriate using React Query

## API Architecture

### REST API Design
- Resource-based endpoints
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent response formats

### API Security
- JWT-based authentication
- Row Level Security (RLS) in the database
- CORS configuration
- Input validation

## Integration Architecture

### AI Services Integration
- Modular design with provider abstraction
- Fallback mechanisms for service unavailability
- Error handling and retry logic

### Third-Party Service Integration
- Authentication providers (Google OAuth)
- Payment processors (planned)
- Analytics services (planned)

## Security Architecture

### Authentication
- Email/password authentication
- OAuth integration
- JWT token management
- Session expiration and refresh

### Authorization
- Role-based access control
- Row Level Security in the database
- Protected routes in the frontend

## Scalability Considerations

### Frontend Scalability
- Code splitting for performance
- Lazy loading of components
- Resource optimization

### Backend Scalability
- Serverless functions for automatic scaling
- PostgreSQL scalability through Supabase
- Caching strategies for frequent queries

