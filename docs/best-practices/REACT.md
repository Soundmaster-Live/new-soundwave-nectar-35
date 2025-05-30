
# React Best Practices

## Component Structure

1. **Keep components small and focused**
   - Components should ideally be under 200 lines
   - Split large components into smaller ones
   - Use composition over inheritance

2. **Component organization**
   ```jsx
   // Component structure
   import React, { useState, useEffect } from 'react';
   import { useQuery } from '@tanstack/react-query';
   // External imports first

   import { Button } from '@/components/ui/button';
   import { fetchData } from '@/lib/api';
   // Internal imports next

   // Types
   type Props = {
     id: string;
     onSave: (data: SaveData) => void;
   };

   // Component
   export const MyComponent = ({ id, onSave }: Props) => {
     // State hooks
     const [value, setValue] = useState('');
     
     // Query/other hooks
     const { data, isLoading } = useQuery({...});
     
     // Effect hooks
     useEffect(() => {
       // ...
     }, [id]);
     
     // Event handlers
     const handleSubmit = () => {
       // ...
     };
     
     // Conditional rendering helpers
     const renderContent = () => {
       // ...
     };
     
     // Return JSX
     return (
       <div>
         {/* JSX here */}
       </div>
     );
   };
   ```

3. **Extract complex logic to custom hooks**
   - Move data fetching to hooks
   - Move complex state logic to hooks
   - Keep components focused on rendering

## Custom Hooks

1. **Name hooks with the `use` prefix**
   - Examples: `useAuthentication`, `useStreamData`

2. **Keep hooks focused on a single responsibility**
   - A hook should do one thing and do it well
   - Split complex hooks into smaller ones

3. **Provide clear return values**
   ```tsx
   // Good
   const { user, isLoading, error, login, logout } = useAuth();

   // Avoid
   const authStuff = useAuth();
   ```

## Context Usage

1. **Only use Context for genuinely global state**
   - Authentication state
   - Theme settings
   - User preferences

2. **Split contexts by domain**
   ```tsx
   // Good
   <AuthProvider>
     <ThemeProvider>
       <NotificationProvider>
         <App />
       </NotificationProvider>
     </ThemeProvider>
   </AuthProvider>

   // Avoid
   <GlobalStateProvider>
     <App />
   </GlobalStateProvider>
   ```

3. **Provide meaningful default values**
   ```tsx
   const defaultValue: AuthContextType = {
     user: null,
     isLoading: false,
     error: null,
     login: () => Promise.reject(new Error('Not implemented')),
     logout: () => Promise.reject(new Error('Not implemented')),
   };
   
   const AuthContext = createContext<AuthContextType>(defaultValue);
   ```

## Performance Optimization

1. **Use React.memo for expensive renders**
   ```tsx
   const ExpensiveComponent = React.memo(function ExpensiveComponent(props: Props) {
     // ...
   });
   ```

2. **Use useMemo for expensive calculations**
   ```tsx
   const sortedItems = useMemo(() => {
     return [...items].sort((a, b) => a.name.localeCompare(b.name));
   }, [items]);
   ```

3. **Use useCallback for function references**
   ```tsx
   const handleClick = useCallback(() => {
     console.log('Clicked!');
   }, []);
   ```

4. **Implement virtualization for long lists**
   ```tsx
   import { useVirtualizer } from '@tanstack/react-virtual';
   
   function VirtualList({ items }) {
     const virtualizer = useVirtualizer({
       count: items.length,
       getScrollElement: () => parentRef.current,
       estimateSize: () => 35,
     });
     
     // Render virtual list
   }
   ```

## Form Handling

1. **Use react-hook-form for complex forms**
   ```tsx
   import { useForm } from 'react-hook-form';
   
   function MyForm() {
     const { register, handleSubmit, errors } = useForm();
     
     const onSubmit = (data) => {
       // Submit data
     };
     
     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         <input {...register('name', { required: true })} />
         {errors.name && <span>This field is required</span>}
         <button type="submit">Submit</button>
       </form>
     );
   }
   ```

2. **Implement proper form validation**
   - Use Zod for schema validation
   - Provide real-time feedback
   - Handle all form states (idle, submitting, success, error)

3. **Provide meaningful error messages**
   - Be specific about validation requirements
   - Use positive language when possible
   - Place errors close to the relevant inputs
