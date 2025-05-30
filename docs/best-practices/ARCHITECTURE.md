
# Architecture Best Practices

## Component Organization

1. **Feature-based organization**
   - Group components by feature, not type
   - Keep related files close to each other
   ```
   /src/features/auth/
     components/
     hooks/
     utils/
     types.ts
   ```

2. **Component layering**
   - UI components (presentational)
   - Container components (with data)
   - Page components (routes)
   - Layout components

3. **Shared components**
   - Place truly reusable components in a shared directory
   - Document usage with examples
   - Implement storybook stories when possible

## File Structure Best Practices

1. **Naming conventions**
   - Use PascalCase for component files
   - Use camelCase for utility files
   - Use kebab-case for assets
   - Be consistent with plural/singular naming

2. **Import organization**
   - Group imports by type (React, third-party, internal)
   - Use absolute imports for clarity
   - Sort imports alphabetically

3. **Barrel files**
   - Use index files to simplify imports
   - Avoid deep nesting of barrel files
   - Be mindful of circular dependencies

## Project Organization

1. **Recommended project structure**
   ```
   /src
     /components       # Shared UI components
     /features         # Feature-based modules
     /contexts         # Global context providers
     /hooks            # Shared hooks
     /utils            # Utility functions
     /lib              # External integrations
     /pages            # Route-level components
     /types            # Shared TypeScript types
     /assets           # Static assets
   ```

2. **Component structure**
   ```
   /Button
     Button.tsx        # Component implementation
     Button.test.tsx   # Component tests
     useButton.ts      # Component-specific hook (if needed)
     types.ts          # Component-specific types
     index.ts          # Re-export the component
   ```

3. **Feature structure**
   ```
   /features/authentication
     /components       # Feature-specific components
     /hooks            # Feature-specific hooks
     /utils            # Feature-specific utilities
     /contexts         # Feature-specific contexts
     /types            # Feature-specific types
     index.ts          # Public API for the feature
   ```

## Code Organization

1. **Dependency management**
   - Keep dependencies updated
   - Use specific versions in package.json
   - Document major dependency decisions
   - Avoid dependency duplication

2. **Module boundaries**
   - Define clear module boundaries
   - Export only what's needed
   - Use barrel files to control exports
   - Consider using TypeScript path aliases

3. **Code splitting**
   - Split code by route
   - Lazy load non-critical components
   - Use React.lazy and Suspense
   ```tsx
   const UserProfile = React.lazy(() => import('./UserProfile'));
   
   function App() {
     return (
       <div>
         <Suspense fallback={<LoadingSpinner />}>
           <UserProfile />
         </Suspense>
       </div>
     );
   }
   ```

## Data Flow

1. **Unidirectional data flow**
   - Data flows down through props
   - Events flow up through callbacks
   - Use contexts for global state

2. **Props drilling alternatives**
   - Use context for deeply nested state
   - Use composition to avoid intermediate components
   - Consider component composition patterns

3. **State colocation**
   - Keep state as close as possible to where it's used
   - Lift state only when necessary
   - Split context providers to minimize re-renders
