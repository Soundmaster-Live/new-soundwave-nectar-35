
# TypeScript Best Practices

## Type Safety

1. **Use strict type checking**
   - Enable strict mode in tsconfig.json
   - Avoid using `any` type
   - Use union types instead of `any`

2. **Type inference vs explicit types**
   - Let TypeScript infer types when possible
   - Add explicit type annotations for function parameters and return types

3. **Interfaces vs Types**
   - Use interfaces for object shapes that will be extended
   - Use types for unions, primitives, and tuples
   - Be consistent with your choice

4. **Nullable properties**
   - Use optional properties instead of possibly undefined values
   - Use the nullish coalescing operator (`??`) for defaults

## Code Quality

1. **Use typed event handlers**
   ```typescript
   // Good
   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     // ...
   };

   // Avoid
   const handleChange = (event: any) => {
     // ...
   };
   ```

2. **Leverage discriminated unions for state**
   ```typescript
   // Good
   type State = 
     | { status: 'idle' }
     | { status: 'loading' }
     | { status: 'success', data: User[] }
     | { status: 'error', error: Error };

   // Avoid
   type State = {
     status: string;
     data?: User[];
     error?: Error;
   };
   ```

3. **Use type guards for runtime safety**
   ```typescript
   function isUser(obj: any): obj is User {
     return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj;
   }
   ```

4. **Create utility types for common patterns**
   ```typescript
   type Nullable<T> = T | null;
   type Optional<T> = T | undefined;
   type Result<T> = { success: true, data: T } | { success: false, error: Error };
   ```

## Type Declarations

1. **Keep related types in the same file as their usage**
   - For component props, define types in the same file
   - For shared types, create dedicated type files

2. **Use export/import for types**
   ```typescript
   // Define in types.ts
   export type User = {
     id: string;
     name: string;
   };

   // Import in component
   import { User } from './types';
   ```

3. **Use descriptive type names**
   - Choose names that describe what the type represents
   - Use PascalCase for type names
   - Add context to generic type names

4. **Document complex types**
   ```typescript
   /**
   * Represents a user in the system
   * @property id - Unique identifier
   * @property name - User's display name
   */
   export type User = {
     id: string;
     name: string;
   };
   ```
