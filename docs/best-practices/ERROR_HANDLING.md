# Error Handling Best Practices

## Graceful Degradation

1. **Implement fallbacks for failed requests**
   ```tsx
   function UserProfile() {
     const { data, error, isLoading } = useQuery({
       queryKey: ['user-profile'],
       queryFn: fetchUserProfile,
     });
     
     if (isLoading) {
       return <LoadingSpinner />;
     }
     
     if (error) {
       // Show a fallback UI when the request fails
       return (
         <div className="error-fallback">
           <h2>Unable to load profile</h2>
           <p>We're having trouble loading your profile data.</p>
           <button onClick={() => refetch()}>Try Again</button>
         </div>
       );
     }
     
     // Normal rendering with data
     return <ProfileDisplay user={data} />;
   }
   ```

2. **Provide meaningful error messages**
   ```tsx
   const getErrorMessage = (error) => {
     if (error.response) {
       // Server responded with non-2xx status
       if (error.response.status === 404) {
         return "The resource you requested couldn't be found.";
       }
       if (error.response.status === 403) {
         return "You don't have permission to access this resource.";
       }
       if (error.response.status === 401) {
         return "Please log in to continue.";
       }
       return "There was an error processing your request.";
     } else if (error.request) {
       // Request made but no response received
       return "We couldn't connect to the server. Please check your internet connection.";
     } else {
       // Other errors
       return "An unexpected error occurred.";
     }
   };
   ```

3. **Allow users to retry operations**
   ```tsx
   function DataFetcher() {
     const { data, error, isLoading, refetch } = useQuery({
       queryKey: ['data'],
       queryFn: fetchData,
     });
     
     if (error) {
       return (
         <div className="error-state">
           <p>{getErrorMessage(error)}</p>
           <button 
             onClick={() => refetch()} 
             className="retry-button"
           >
             Try Again
           </button>
         </div>
       );
     }
     
     // Normal rendering
   }
   ```

## Error Boundaries

1. **Implement React error boundaries**
   ```tsx
   import { Component } from 'react';
   
   class ErrorBoundary extends Component {
     state = { hasError: false, error: null };
     
     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }
     
     componentDidCatch(error, info) {
       // Log the error
       console.error("Error caught by boundary:", error, info);
       // Send to error tracking service
       // errorTrackingService.captureException(error, { info });
     }
     
     render() {
       if (this.state.hasError) {
         return this.props.fallback || (
           <div className="error-boundary-fallback">
             <h2>Something went wrong</h2>
             <p>We've been notified and are working to fix the issue.</p>
             <button onClick={() => this.setState({ hasError: false, error: null })}>
               Try Again
             </button>
           </div>
         );
       }
       
       return this.props.children;
     }
   }
   
   // Usage
   function App() {
     return (
       <ErrorBoundary>
         <SomeComponentThatMightError />
       </ErrorBoundary>
     );
   }
   ```

2. **Log errors for debugging**
   ```tsx
   import * as Sentry from '@sentry/react';
   
   const logError = (error, context = {}) => {
     console.error('Error:', error);
     
     Sentry.captureException(error, {
       extra: context,
     });
   };
   ```

3. **Provide user-friendly fallback UIs**
   ```tsx
   function FeatureWrapper({ children, featureName }) {
     return (
       <ErrorBoundary
         fallback={
           <div className="feature-error">
             <h3>Unable to load {featureName}</h3>
             <p>There was a problem loading this feature.</p>
           </div>
         }
       >
         {children}
       </ErrorBoundary>
     );
   }
   
   // Usage
   function Dashboard() {
     return (
       <div className="dashboard">
         <FeatureWrapper featureName="Revenue Chart">
           <RevenueChart />
         </FeatureWrapper>
         
         <FeatureWrapper featureName="Recent Orders">
           <OrdersList />
         </FeatureWrapper>
       </div>
     );
   }
   ```

## Logging and Monitoring

1. **Log errors with context**
   ```tsx
   const logErrorWithContext = (error, component, action, additionalData = {}) => {
     console.error(`Error in ${component} during ${action}:`, error);
     
     // Send to logging service
     logger.error({
       message: error.message,
       component,
       action,
       stack: error.stack,
       timestamp: new Date().toISOString(),
       ...additionalData,
     });
   };
   
   // Usage
   try {
     await submitForm(data);
   } catch (error) {
     logErrorWithContext(error, 'CheckoutForm', 'form submission', { 
       formData: sanitizeData(data),
       userId: currentUser.id,
     });
   }
   ```

2. **Implement structured logging**
   ```tsx
   const logger = {
     error: (data) => {
       // Log to console in development
       if (process.env.NODE_ENV === 'development') {
         console.error(data);
       }
       
       // Send to logging service in production
       if (process.env.NODE_ENV === 'production') {
         fetch('/api/logs', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             level: 'error',
             ...data,
           }),
         }).catch(err => {
           // Fallback if logging service fails
           console.error('Failed to send log:', err);
         });
       }
     },
     
     // Other log levels...
     info: (data) => { /* ... */ },
     warn: (data) => { /* ... */ },
   };
   ```

3. **Set up alerts for critical errors**
   ```tsx
   const reportCriticalError = (error, context = {}) => {
     // Log the error
     logger.error({
       message: error.message,
       stack: error.stack,
       ...context,
       isCritical: true,
     });
     
     // For critical errors, trigger immediate notification
     if (process.env.NODE_ENV === 'production') {
       fetch('/api/alerts', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           type: 'critical_error',
           message: error.message,
           context,
         }),
       }).catch(err => {
         console.error('Failed to send alert:', err);
       });
     }
   };
   ```

## Async Error Handling

1. **Use try/catch for async operations**
   ```tsx
   const handleSubmit = async (event) => {
     event.preventDefault();
     setIsSubmitting(true);
     setError(null);
     
     try {
       await submitForm(formData);
       toast.success('Form submitted successfully!');
       resetForm();
     } catch (error) {
       setError(getErrorMessage(error));
       logError(error, { formData });
     } finally {
       setIsSubmitting(false);
     }
   };
   ```

2. **Handle promise rejection chains**
   ```tsx
   fetchData()
     .then(data => processData(data))
     .then(result => {
       setData(result);
     })
     .catch(error => {
       setError(getErrorMessage(error));
       logError(error);
     })
     .finally(() => {
       setIsLoading(false);
     });
   ```

3. **Implement global fetch error handling**
   ```tsx
   // api.js
   const fetchWithErrorHandling = async (url, options = {}) => {
     try {
       const response = await fetch(url, options);
       
       if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         const error = new Error(
           errorData.message || `API Error: ${response.status} ${response.statusText}`
         );
         error.status = response.status;
         error.data = errorData;
         throw error;
       }
       
       return await response.json();
     } catch (error) {
       // Add request details to error
       error.url = url;
       error.method = options.method || 'GET';
       
       // Log all API errors
       logError(error);
       
       // Rethrow for component handling
       throw error;
     }
   };
   ```
