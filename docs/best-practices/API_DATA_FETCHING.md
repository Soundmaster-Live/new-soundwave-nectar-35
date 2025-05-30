
# API and Data Fetching Best Practices

## TanStack Query Best Practices

1. **Use query keys consistently**
   ```tsx
   // Define query keys in a central location
   export const queryKeys = {
     todos: ['todos'],
     todo: (id) => ['todos', id],
     users: ['users'],
     user: (id) => ['users', id],
   };
   
   // Use in components
   const { data } = useQuery({
     queryKey: queryKeys.todos,
     queryFn: fetchTodos,
   });
   ```

2. **Implement proper error handling**
   ```tsx
   const { data, error, isLoading } = useQuery({
     queryKey: ['todos'],
     queryFn: fetchTodos,
     onError: (error) => {
       toast.error(`Failed to fetch todos: ${error.message}`);
     },
   });
   
   // In the component
   if (error) {
     return <ErrorDisplay error={error} />;
   }
   ```

3. **Configure appropriate stale times**
   ```tsx
   const { data } = useQuery({
     queryKey: ['user-profile'],
     queryFn: fetchUserProfile,
     staleTime: 1000 * 60 * 5, // 5 minutes
     cacheTime: 1000 * 60 * 30, // 30 minutes
   });
   ```

4. **Use prefetching for performance**
   ```tsx
   const queryClient = useQueryClient();
   
   const prefetchUser = async (userId) => {
     await queryClient.prefetchQuery({
       queryKey: ['user', userId],
       queryFn: () => fetchUser(userId),
     });
   };
   
   // In a list component
   const handleMouseEnter = () => {
     prefetchUser(user.id);
   };
   ```

## Error Handling

1. **Implement retries for transient failures**
   ```tsx
   const { data } = useQuery({
     queryKey: ['todos'],
     queryFn: fetchTodos,
     retry: 3,
     retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
   });
   ```

2. **Display user-friendly error messages**
   ```tsx
   const ErrorDisplay = ({ error }) => {
     const errorMessage = useMemo(() => {
       if (error.response?.status === 404) {
         return 'The requested resource was not found.';
       }
       if (error.response?.status === 403) {
         return 'You don\'t have permission to access this resource.';
       }
       return 'An error occurred. Please try again later.';
     }, [error]);
     
     return (
       <div className="error-container">
         <h3>Something went wrong</h3>
         <p>{errorMessage}</p>
       </div>
     );
   };
   ```

3. **Log errors for debugging**
   ```tsx
   const logError = (error, context = {}) => {
     console.error('API Error:', {
       message: error.message,
       stack: error.stack,
       response: error.response,
       ...context,
     });
     
     // Send to error tracking service
     // errorTrackingService.captureException(error, { context });
   };
   
   // Usage
   try {
     await fetchData();
   } catch (error) {
     logError(error, { component: 'UserDashboard' });
   }
   ```

## Loading States

1. **Show loading indicators for async operations**
   ```tsx
   const { data, isLoading } = useQuery({
     queryKey: ['todos'],
     queryFn: fetchTodos,
   });
   
   if (isLoading) {
     return <LoadingSpinner />;
   }
   ```

2. **Implement skeleton screens for initial loads**
   ```tsx
   const SkeletonLoading = () => {
     return (
       <div className="skeleton-container">
         <div className="skeleton-header"></div>
         <div className="skeleton-content">
           <div className="skeleton-item"></div>
           <div className="skeleton-item"></div>
           <div className="skeleton-item"></div>
         </div>
       </div>
     );
   };
   
   // In component
   if (isLoading) {
     return <SkeletonLoading />;
   }
   ```

3. **Use optimistic updates where appropriate**
   ```tsx
   const queryClient = useQueryClient();
   
   const mutation = useMutation({
     mutationFn: updateTodo,
     onMutate: async (newTodo) => {
       // Cancel outgoing refetches
       await queryClient.cancelQueries({ queryKey: ['todos', newTodo.id] });
       
       // Save previous value
       const previousTodo = queryClient.getQueryData(['todos', newTodo.id]);
       
       // Optimistically update
       queryClient.setQueryData(['todos', newTodo.id], newTodo);
       
       return { previousTodo };
     },
     onError: (err, newTodo, context) => {
       // Restore previous value on error
       queryClient.setQueryData(
         ['todos', newTodo.id],
         context.previousTodo
       );
     },
     onSettled: (newTodo) => {
       // Always refetch after error or success
       queryClient.invalidateQueries({ queryKey: ['todos', newTodo.id] });
     },
   });
   ```

## API Organization

1. **Centralize API calls**
   ```tsx
   // api/todos.ts
   export const fetchTodos = async () => {
     const response = await fetch('/api/todos');
     if (!response.ok) {
       throw new Error('Failed to fetch todos');
     }
     return response.json();
   };
   
   export const createTodo = async (todo) => {
     const response = await fetch('/api/todos', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(todo),
     });
     if (!response.ok) {
       throw new Error('Failed to create todo');
     }
     return response.json();
   };
   ```

2. **Use consistent error handling**
   ```tsx
   // utils/api.ts
   export const fetchJson = async (url, options = {}) => {
     const response = await fetch(url, options);
     
     if (!response.ok) {
       const error = new Error(`API Error: ${response.status} ${response.statusText}`);
       error.response = response;
       try {
         error.data = await response.json();
       } catch (e) {
         error.data = null;
       }
       throw error;
     }
     
     return response.json();
   };
   
   // Usage
   import { fetchJson } from '@/utils/api';
   
   export const fetchUser = (id) => fetchJson(`/api/users/${id}`);
   ```

3. **Handle authentication and tokens**
   ```tsx
   // utils/api.ts
   export const fetchWithAuth = async (url, options = {}) => {
     const token = localStorage.getItem('auth_token');
     
     const headers = {
       ...options.headers,
       Authorization: token ? `Bearer ${token}` : undefined,
     };
     
     return fetchJson(url, { ...options, headers });
   };
   ```
