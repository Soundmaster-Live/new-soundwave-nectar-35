
# State Management Best Practices

## Local State

1. **Use `useState` for component-specific state**
   ```tsx
   const [count, setCount] = useState(0);
   const [isVisible, setIsVisible] = useState(false);
   ```

2. **Use `useReducer` for complex state logic**
   ```tsx
   const [state, dispatch] = useReducer(reducer, initialState);
   
   function reducer(state, action) {
     switch (action.type) {
       case 'increment':
         return { ...state, count: state.count + 1 };
       case 'decrement':
         return { ...state, count: state.count - 1 };
       default:
         return state;
     }
   }
   ```

3. **Derive state when possible**
   ```tsx
   // Instead of this
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [fullName, setFullName] = useState('');
   
   useEffect(() => {
     setFullName(`${firstName} ${lastName}`);
   }, [firstName, lastName]);
   
   // Do this
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const fullName = `${firstName} ${lastName}`;
   ```

## Global State

1. **Use React Context for truly global state**
   - Authentication state
   - Theme settings
   - User preferences

2. **Consider TanStack Query for server state**
   ```tsx
   const { data, error, isLoading } = useQuery({
     queryKey: ['todos'],
     queryFn: fetchTodos,
   });
   ```

3. **Avoid over-centralizing state**
   - Keep state close to where it's used
   - Only lift state when truly needed
   - Split context by domain

## Persistent State

1. **Use localStorage/sessionStorage for client-side persistence**
   ```tsx
   // Custom hook for persistent state
   function usePersistentState(key, defaultValue) {
     const [value, setValue] = useState(() => {
       const stored = localStorage.getItem(key);
       return stored ? JSON.parse(stored) : defaultValue;
     });
     
     useEffect(() => {
       localStorage.setItem(key, JSON.stringify(value));
     }, [key, value]);
     
     return [value, setValue];
   }
   ```

2. **Sync state with URL parameters**
   ```tsx
   import { useSearchParams } from 'react-router-dom';
   
   function FilterComponent() {
     const [searchParams, setSearchParams] = useSearchParams();
     const category = searchParams.get('category') || 'all';
     
     const handleCategoryChange = (newCategory) => {
       setSearchParams({ category: newCategory });
     };
     
     // ...
   }
   ```

3. **Consider offline-first approaches**
   - Cache API responses
   - Implement optimistic updates
   - Handle reconnection scenarios

## State Organization

1. **Organize state by feature**
   - Group related state together
   - Use custom hooks to encapsulate state logic
   - Keep state interfaces consistent

2. **Document state shape**
   ```tsx
   /**
   * User authentication state
   */
   type AuthState = {
     /** The currently authenticated user, or null if not authenticated */
     user: User | null;
     /** Whether authentication is in progress */
     isLoading: boolean;
     /** Any authentication error that occurred */
     error: Error | null;
   };
   ```

3. **Be consistent with state updates**
   ```tsx
   // For immutable updates with objects
   setState(prev => ({ ...prev, key: value }));
   
   // For immutable updates with arrays
   setState(prev => [...prev, newItem]);
   ```
