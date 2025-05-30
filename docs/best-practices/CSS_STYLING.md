
# CSS and Styling Best Practices

## Tailwind Best Practices

1. **Use utility classes consistently**
   ```html
   <!-- Use consistent spacing, typography and colors -->
   <div class="p-4 mb-6 rounded-lg bg-white shadow">
     <h2 class="text-xl font-bold mb-2 text-gray-800">Title</h2>
     <p class="text-gray-600">Content here</p>
   </div>
   ```

2. **Create component classes for repeated patterns**
   ```js
   // In tailwind.config.js
   module.exports = {
     theme: {
       extend: {},
     },
     plugins: [],
     corePlugins: {
       // ...
     },
   };
   ```

   ```html
   <!-- In your component -->
   <button className="btn btn-primary">Submit</button>
   ```

3. **Follow responsive design patterns (mobile-first)**
   ```html
   <div class="p-2 md:p-4 lg:p-6">
     <h1 class="text-lg md:text-xl lg:text-2xl">Responsive Heading</h1>
   </div>
   ```

## Theme Consistency

1. **Use CSS variables for theming**
   ```css
   /* In your global CSS */
   :root {
     --color-primary: #4f46e5;
     --color-secondary: #06b6d4;
     --color-background: #f9fafb;
     --color-text: #111827;
   }

   .dark {
     --color-primary: #6366f1;
     --color-secondary: #0ea5e9;
     --color-background: #1f2937;
     --color-text: #f9fafb;
   }
   ```

   ```html
   <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
     Content here
   </div>
   ```

2. **Reference design tokens consistently**
   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           primary: {
             100: '#e0e7ff',
             200: '#c7d2fe',
             // ...
             900: '#312e81',
           },
           // ...
         },
       },
     },
   };
   ```

   ```html
   <button class="bg-primary-600 hover:bg-primary-700 text-white">
     Submit
   </button>
   ```

3. **Ensure color contrast for accessibility**
   - Use tools like [Colorable](https://colorable.jxnblk.com/) to check contrast
   - Maintain at least 4.5:1 contrast for normal text
   - Maintain at least 3:1 contrast for large text

## Layout Patterns

1. **Use Flexbox and Grid appropriately**
   ```html
   <!-- Flexbox for 1D layouts -->
   <div class="flex justify-between items-center">
     <div>Left content</div>
     <div>Right content</div>
   </div>

   <!-- Grid for 2D layouts -->
   <div class="grid grid-cols-3 gap-4">
     <div>Item 1</div>
     <div>Item 2</div>
     <div>Item 3</div>
   </div>
   ```

2. **Implement responsive breakpoints consistently**
   ```html
   <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
     <!-- Content here -->
   </div>
   ```

3. **Consider container queries for component-specific responsiveness**
   ```html
   <!-- Using @container in a container-query-aware browser -->
   <div class="@container">
     <div class="@md:p-4 @lg:p-6">
       Responsive to container size
     </div>
   </div>
   ```

## Component Styling

1. **Use consistent class ordering**
   ```html
   <!-- layout -> dimensions -> spacing -> typography -> visual -> interactivity -->
   <div class="
     flex justify-between items-center 
     w-full h-16
     p-4 mb-6
     text-lg font-medium
     bg-white rounded-lg shadow-md
     hover:bg-gray-50 transition-colors
   ">
     Content here
   </div>
   ```

2. **Extract complex styles to components**
   ```tsx
   function Card({ children }) {
     return (
       <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
         {children}
       </div>
     );
   }
   ```

3. **Use CSS-in-JS sparingly**
   - Prefer Tailwind utility classes
   - Use CSS-in-JS only for dynamic styles that can't be handled with Tailwind
   ```tsx
   const dynamicStyle = {
     height: `${progress * 100}%`,
   };

   return <div className="bg-blue-500" style={dynamicStyle}></div>;
   ```

## Media and Assets

1. **Optimize images**
   - Use WebP format when possible
   - Implement responsive images
   ```html
   <img
     src="image-small.jpg"
     srcSet="image-small.jpg 400w, image-medium.jpg 800w, image-large.jpg 1200w"
     sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
     alt="Description"
   />
   ```

2. **Lazy load images**
   ```html
   <img loading="lazy" src="image.jpg" alt="Description" />
   ```

3. **Use appropriate image dimensions**
   - Don't use larger images than needed
   - Consider using an image CDN for resizing
   - Use aspect ratio containers to prevent layout shifts
