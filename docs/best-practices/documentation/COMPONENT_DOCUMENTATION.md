# Component Documentation Best Practices

## Component Props Documentation

1. **Document props and their types**
   ```typescript
   import { FC, ReactNode } from 'react';
   
   interface ButtonProps {
     /** The content to display inside the button */
     children: ReactNode;
     
     /** The function called when the button is clicked */
     onClick?: () => void;
     
     /** The variant determines the button's appearance */
     variant?: 'primary' | 'secondary' | 'danger';
     
     /** Whether the button is in a loading state */
     isLoading?: boolean;
     
     /** Whether the button is disabled */
     disabled?: boolean;
   }
   
   /**
    * Button component used for user interactions.
    * 
    * @example
    * ```tsx
    * <Button variant="primary" onClick={handleClick}>
    *   Click Me
    * </Button>
    * ```
    */
   export const Button: FC<ButtonProps> = ({
     children,
     onClick,
     variant = 'primary',
     isLoading = false,
     disabled = false,
   }) => {
     // Implementation...
   };
   ```

2. **Provide usage examples**
   ```typescript
   /**
    * A form input that validates email addresses.
    * 
    * @example
    * ```tsx
    * // Basic usage
    * <EmailInput 
    *   value={email}
    *   onChange={setEmail}
    * />
    * 
    * // With error handling
    * <EmailInput 
    *   value={email}
    *   onChange={setEmail}
    *   onValidationChange={(isValid) => setIsEmailValid(isValid)}
    *   errorMessage="Please enter a valid email address"
    * />
    * ```
    */
   export const EmailInput = ({ value, onChange, onValidationChange, errorMessage }: EmailInputProps) => {
     // Implementation...
   };
   ```

3. **Document component composition patterns**
   ```typescript
   /**
    * Card component for displaying content in a contained box.
    * 
    * Can be composed with Card.Header, Card.Body, and Card.Footer.
    * 
    * @example
    * ```tsx
    * <Card>
    *   <Card.Header>
    *     <h2>Card Title</h2>
    *   </Card.Header>
    *   <Card.Body>
    *     <p>Card content goes here</p>
    *   </Card.Body>
    *   <Card.Footer>
    *     <Button>Action</Button>
    *   </Card.Footer>
    * </Card>
    * ```
    */
   export const Card = ({ children }: CardProps) => {
     // Implementation...
   };
   
   Card.Header = ({ children }: { children: ReactNode }) => {
     // Implementation...
   };
   
   // Other subcomponents...
   ```

## Custom Hook Documentation

1. **Document hook parameters and return values**
   ```typescript
   /**
    * Hook for managing form state with validation.
    * 
    * @param initialValues - Initial form field values
    * @param validationSchema - Zod schema for form validation
    * @param onSubmit - Function called with validated data on form submission
    * 
    * @returns Object containing:
    * - values: Current form values
    * - errors: Validation error messages
    * - touched: Which fields have been touched
    * - handleChange: Function to update a field value
    * - handleBlur: Function to mark a field as touched
    * - handleSubmit: Function to validate and submit the form
    * - resetForm: Function to reset the form to initial values
    * 
    * @example
    * ```tsx
    * const { values, errors, handleChange, handleSubmit } = useForm({
    *   initialValues: { email: '', password: '' },
    *   validationSchema: loginSchema,
    *   onSubmit: (data) => login(data)
    * });
    * ```
    */
   function useForm<T extends Record<string, any>>({
     initialValues,
     validationSchema,
     onSubmit,
   }: UseFormProps<T>): UseFormReturn<T> {
     // Implementation...
   }
   ```

2. **Document side effects and dependencies**
   ```typescript
   /**
    * Hook that fetches user data and handles authentication state.
    * 
    * @remarks
    * This hook fetches user data on mount and whenever the user ID changes.
    * It will also refetch when the `refetchTrigger` value changes.
    * 
    * Side effects:
    * - Makes API requests to `/api/users/{id}`
    * - Updates local storage with auth token
    * - May trigger router navigation on authentication errors
    * 
    * @param userId - The ID of the user to fetch
    * @param refetchTrigger - Value that triggers refetching when changed
    */
   function useUser(userId: string, refetchTrigger?: any) {
     // Implementation...
   }
   ```

3. **Document cleanup behavior for effects**
   ```typescript
   /**
    * Hook that sets up a WebSocket connection.
    * 
    * @param url - WebSocket URL to connect to
    * @param options - Connection options
    * 
    * @remarks
    * The WebSocket connection will be automatically closed when the component unmounts.
    * 
    * @returns WebSocket instance and connection status
    */
   function useWebSocket(url: string, options?: WebSocketOptions) {
     // Implementation...
   }
   ```

## Context Provider Documentation

1. **Document the context value shape**
   ```typescript
   /**
    * Context for authentication state and operations.
    * 
    * Provides:
    * - Current user information
    * - Authentication status
    * - Login/logout functionality
    * 
    * @example
    * ```tsx
    * // Accessing the context in a component
    * function ProfileButton() {
    *   const { user, logout } = useAuth();
    *   
    *   if (!user) {
    *     return <LoginButton />;
    *   }
    *   
    *   return (
    *     <button onClick={logout}>
    *       Logout ({user.name})
    *     </button>
    *   );
    * }
    * ```
    */
   export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
   ```

2. **Document provider usage and configuration**
   ```typescript
   /**
    * Provider component for audio streaming functionality.
    * 
    * Manages audio playback state and provides controls to child components.
    * 
    * @param props.initialVolume - Initial volume level (0-1)
    * @param props.autoplay - Whether to autoplay when a stream URL is set
    * @param props.children - Child components
    * 
    * @example
    * ```tsx
    * <AudioProvider initialVolume={0.5} autoplay={false}>
    *   <App />
    * </AudioProvider>
    * ```
    */
   export const AudioProvider: FC<AudioProviderProps> = ({
     initialVolume = 0.7,
     autoplay = false,
     children,
   }) => {
     // Implementation...
   };
   ```

3. **Document the custom hook for using the context**
   ```typescript
   /**
    * Hook for accessing the theme context.
    * 
    * Must be used within a ThemeProvider component.
    * 
    * @returns Object containing:
    * - theme: Current theme ('light', 'dark', or 'system')
    * - setTheme: Function to update the theme
    * - isDark: Boolean indicating if dark theme is active
    * 
    * @throws Will throw an error if used outside of a ThemeProvider
    * 
    * @example
    * ```tsx
    * function ThemeToggle() {
    *   const { theme, setTheme } = useTheme();
    *   
    *   return (
    *     <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
    *       Toggle theme
    *     </button>
    *   );
    * }
    * ```
    */
   export function useTheme(): ThemeContextValue {
     // Implementation...
   }
   ```
