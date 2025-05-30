
# Accessibility Best Practices

## Semantic HTML

1. **Use appropriate HTML elements**
   ```tsx
   // Bad
   <div onClick={handleClick}>Click me</div>
   
   // Good
   <button onClick={handleClick}>Click me</button>
   ```

2. **Implement proper heading hierarchy**
   ```tsx
   <h1>Page Title</h1>
   <section>
     <h2>Section Title</h2>
     <div>
       <h3>Subsection Title</h3>
     </div>
   </section>
   ```

3. **Use ARIA attributes when necessary**
   ```tsx
   <button 
     aria-expanded={isExpanded}
     aria-controls="dropdown-content"
     onClick={toggleExpanded}
   >
     Toggle Menu
   </button>
   <div 
     id="dropdown-content" 
     hidden={!isExpanded}
   >
     Dropdown content here
   </div>
   ```

## Keyboard Navigation

1. **Ensure all interactive elements are keyboard accessible**
   ```tsx
   // Ensure custom components can be focused
   <div 
     tabIndex={0}
     role="button"
     onKeyDown={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         handleActivation();
       }
     }}
     onClick={handleActivation}
   >
     Custom Button
   </div>
   ```

2. **Implement proper focus management**
   ```tsx
   // Focus first element when modal opens
   useEffect(() => {
     if (isOpen) {
       firstFocusableElementRef.current?.focus();
     }
   }, [isOpen]);
   
   // Trap focus within modal
   const handleKeyDown = (e) => {
     if (e.key === 'Tab') {
       if (e.shiftKey) {
         // Handle shift+tab
       } else {
         // Handle tab
       }
     }
   };
   ```

3. **Test tab order**
   - Ensure logical tab order
   - Use `tabindex="0"` for custom interactive elements
   - Avoid `tabindex` values greater than 0

## Screen Reader Compatibility

1. **Provide alt text for images**
   ```tsx
   // Informative image
   <img src="chart.png" alt="Q4 sales increased by 25% over Q3" />
   
   // Decorative image
   <img src="decorative-divider.png" alt="" role="presentation" />
   ```

2. **Use aria-live regions for dynamic content**
   ```tsx
   <div 
     aria-live="polite" 
     aria-atomic="true"
   >
     {notificationMessage}
   </div>
   ```

3. **Test with screen readers**
   - Test with NVDA or JAWS on Windows
   - Test with VoiceOver on macOS
   - Test with TalkBack on Android

## Color and Contrast

1. **Maintain sufficient color contrast**
   - Use a minimum contrast ratio of 4.5:1 for normal text
   - Use a minimum contrast ratio of 3:1 for large text
   - Use contrast checker tools during development

2. **Don't rely on color alone to convey information**
   ```tsx
   // Bad
   <div className="text-red-500">Error message</div>
   
   // Good
   <div className="text-red-500">
     <svg className="inline mr-2" aria-hidden="true">
       {/* Error icon */}
     </svg>
     <span>Error message</span>
   </div>
   ```

3. **Support high contrast mode**
   - Test with high contrast mode in Windows
   - Use appropriate media queries
   ```css
   @media (forced-colors: active) {
     .button {
       border: 1px solid ButtonText;
     }
   }
   ```

## Forms

1. **Use labels for form controls**
   ```tsx
   <div>
     <label htmlFor="name">Name</label>
     <input id="name" type="text" />
   </div>
   ```

2. **Group related form elements**
   ```tsx
   <fieldset>
     <legend>Contact Information</legend>
     
     <div>
       <label htmlFor="name">Name</label>
       <input id="name" type="text" />
     </div>
     
     <div>
       <label htmlFor="email">Email</label>
       <input id="email" type="email" />
     </div>
   </fieldset>
   ```

3. **Provide clear error messages**
   ```tsx
   <div>
     <label htmlFor="password">Password</label>
     <input 
       id="password" 
       type="password"
       aria-invalid={!!errors.password}
       aria-describedby={errors.password ? "password-error" : undefined}
     />
     {errors.password && (
       <div id="password-error" className="error-message">
         {errors.password.message}
       </div>
     )}
   </div>
   ```

## ARIA Guidelines

1. **Use roles appropriately**
   ```tsx
   <div role="tablist">
     <button 
       role="tab" 
       aria-selected={activeTab === 'tab1'} 
       aria-controls="panel1"
     >
       Tab 1
     </button>
     <button 
       role="tab" 
       aria-selected={activeTab === 'tab2'} 
       aria-controls="panel2"
     >
       Tab 2
     </button>
   </div>
   
   <div 
     id="panel1" 
     role="tabpanel" 
     aria-labelledby="tab1"
     hidden={activeTab !== 'tab1'}
   >
     Panel 1 content
   </div>
   ```

2. **Use aria-expanded for toggleable regions**
   ```tsx
   <button 
     aria-expanded={isExpanded} 
     onClick={() => setIsExpanded(!isExpanded)}
   >
     Toggle Details
   </button>
   
   {isExpanded && (
     <div>
       Expanded content here
     </div>
   )}
   ```

3. **Use aria-hidden to hide decorative elements**
   ```tsx
   <span aria-hidden="true" className="icon">
     ✓
   </span>
   <span>Task completed</span>
   ```

## Testing Accessibility

1. **Use automated testing tools**
   - Axe DevTools
   - jest-axe for unit testing
   - Lighthouse accessibility audits

2. **Implement keyboard navigation tests**
   - Test focus order
   - Test keyboard shortcuts
   - Test modal focus trapping

3. **Conduct manual testing**
   - Test with screen readers
   - Test with keyboard only navigation
   - Test with various browser zoom levels
