
# Performance Best Practices

## Loading Performance

1. **Code splitting**
   - Split by route
   ```tsx
   import { lazy, Suspense } from 'react';
   
   const Home = lazy(() => import('./pages/Home'));
   const About = lazy(() => import('./pages/About'));
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   
   function App() {
     return (
       <Suspense fallback={<LoadingSpinner />}>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/about" element={<About />} />
           <Route path="/dashboard" element={<Dashboard />} />
         </Routes>
       </Suspense>
     );
   }
   ```
   
   - Split large third-party libraries
   ```tsx
   // Instead of importing the entire library
   import { Doughnut, Line, Bar } from 'react-chartjs-2';
   
   // Lazy load specific chart components
   const Doughnut = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Doughnut })));
   const Line = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));
   ```
   
   - Use dynamic imports for less critical features
   ```tsx
   const FeatureComponent = ({ featureEnabled }) => {
     const [Component, setComponent] = useState(null);
     
     useEffect(() => {
       if (featureEnabled) {
         import('./FeatureImplementation').then(module => {
           setComponent(() => module.default);
         });
       }
     }, [featureEnabled]);
     
     return Component ? <Component /> : null;
   };
   ```

2. **Asset optimization**
   - Optimize images (WebP, responsive sizes)
   ```html
   <img
     src="image-small.webp"
     srcSet="image-small.webp 400w, image-medium.webp 800w, image-large.webp 1200w"
     sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
     loading="lazy"
     alt="Description"
   />
   ```
   
   - Lazy load below-the-fold images
   ```html
   <img loading="lazy" src="image.jpg" alt="Description" />
   ```
   
   - Use appropriate media formats
   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="Description">
   </picture>
   ```

3. **Initial load optimization**
   - Minimize CSS/JS bundle sizes
   ```js
   // vite.config.js
   import { defineConfig } from 'vite';
   import { visualizer } from 'rollup-plugin-visualizer';
   
   export default defineConfig({
     plugins: [
       visualizer(), // Analyze bundle size
     ],
     build: {
       minify: 'terser',
       terserOptions: {
         compress: {
           drop_console: true,
         },
       },
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             ui: ['@/components/ui'],
           },
         },
       },
     },
   });
   ```
   
   - Implement critical CSS
   - Optimize third-party scripts loading
   ```html
   <!-- Defer non-critical scripts -->
   <script defer src="non-critical.js"></script>
   
   <!-- Use async for independent scripts -->
   <script async src="analytics.js"></script>
   ```

## Runtime Performance

1. **Rendering optimization**
   - Avoid unnecessary re-renders
   ```tsx
   // Use React.memo for expensive components
   const ExpensiveComponent = React.memo(function ExpensiveComponent(props) {
     // ...
   });
   
   // Use callback memoization
   const handleClick = useCallback(() => {
     console.log('Clicked!');
   }, []); // Empty deps array = never recreated
   ```
   
   - Use memo/useMemo for expensive calculations
   ```tsx
   const sortedItems = useMemo(() => {
     return [...items].sort((a, b) => a.name.localeCompare(b.name));
   }, [items]); // Only recalculate when items changes
   ```
   
   - Implement virtualization for long lists
   ```tsx
   import { useVirtualizer } from '@tanstack/react-virtual';
   
   function VirtualizedList({ items }) {
     const parentRef = useRef(null);
     
     const virtualizer = useVirtualizer({
       count: items.length,
       getScrollElement: () => parentRef.current,
       estimateSize: () => 50,
     });
     
     return (
       <div 
         ref={parentRef} 
         className="h-[500px] overflow-auto"
       >
         <div
           className="relative w-full"
           style={{ height: `${virtualizer.getTotalSize()}px` }}
         >
           {virtualizer.getVirtualItems().map(virtualRow => (
             <div
               key={virtualRow.index}
               className="absolute top-0 left-0 w-full"
               style={{
                 height: `${virtualRow.size}px`,
                 transform: `translateY(${virtualRow.start}px)`,
               }}
             >
               {items[virtualRow.index].name}
             </div>
           ))}
         </div>
       </div>
     );
   }
   ```

2. **Animation performance**
   - Use CSS transitions where possible
   ```css
   .button {
     transition: transform 0.2s ease-out;
   }
   
   .button:hover {
     transform: scale(1.05);
   }
   ```
   
   - Avoid layout thrashing
   ```tsx
   // Bad: Causes multiple layout recalculations
   elements.forEach(el => {
     const height = el.offsetHeight;
     el.style.height = `${height * 2}px`;
   });
   
   // Good: Batch reads then writes
   const heights = elements.map(el => el.offsetHeight);
   elements.forEach((el, i) => {
     el.style.height = `${heights[i] * 2}px`;
   });
   ```
   
   - Use will-change property judiciously
   ```css
   /* Only use when animation is about to happen */
   .element-about-to-animate {
     will-change: transform;
   }
   ```

3. **Memory management**
   - Properly cleanup effects and subscriptions
   ```tsx
   useEffect(() => {
     const subscription = subscribeToData();
     
     return () => {
       subscription.unsubscribe();
     };
   }, []);
   ```
   
   - Be mindful of closure-related memory leaks
   ```tsx
   // Potential memory leak - stale closure
   useEffect(() => {
     const interval = setInterval(() => {
       doSomethingWithState(state);
     }, 1000);
     
     return () => clearInterval(interval);
   }, []); // Missing dependency
   
   // Fixed version
   useEffect(() => {
     const interval = setInterval(() => {
       doSomethingWithState(state);
     }, 1000);
     
     return () => clearInterval(interval);
   }, [state]); // Include dependency
   ```
   
   - Monitor memory usage
   ```tsx
   // During development
   const logMemoryUsage = () => {
     if (process.env.NODE_ENV === 'development' && window.performance?.memory) {
       console.log('Memory usage:', window.performance.memory);
     }
   };
   ```

## Network Optimization

1. **Implement caching strategies**
   - Cache API responses appropriately
   ```tsx
   const { data } = useQuery({
     queryKey: ['user-profile'],
     queryFn: fetchUserProfile,
     staleTime: 1000 * 60 * 5, // 5 minutes
     cacheTime: 1000 * 60 * 30, // 30 minutes
   });
   ```
   
   - Use service workers for offline support
   - Implement HTTP caching headers

2. **Optimize API calls**
   - Batch related requests
   ```tsx
   // Instead of multiple separate requests
   const fetchDashboardData = async () => {
     const [userResponse, postsResponse, statsResponse] = await Promise.all([
       fetch('/api/user'),
       fetch('/api/posts'),
       fetch('/api/stats'),
     ]);
     
     return {
       user: await userResponse.json(),
       posts: await postsResponse.json(),
       stats: await statsResponse.json(),
     };
   };
   ```
   
   - Implement data pagination
   - Use GraphQL for precise data fetching

3. **Progressive enhancement**
   - Load core functionality first
   - Enhanced features lazy loaded
   - Support offline mode where appropriate
