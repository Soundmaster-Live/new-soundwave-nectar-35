
# Code Comments Best Practices

## General Guidelines

1. **Focus on explaining "why", not "what"**
   - The code should be self-explanatory about what it does
   - Comments should explain reasoning, edge cases, and non-obvious implications

2. **Keep comments up-to-date**
   - Outdated comments are worse than no comments
   - Update comments when you change the related code

3. **Use consistent formatting**
   - Maintain consistent style across the codebase
   - Follow team conventions for comment formatting

## Function and Method Comments

1. **Document complex logic**
   ```typescript
   /**
    * Calculates the optimal grid layout based on container size and item dimensions.
    * 
    * The algorithm works by:
    * 1. Determining available width
    * 2. Calculating maximum columns that fit
    * 3. Distributing items evenly across rows
    * 
    * @param containerWidth - Width of the container in pixels
    * @param itemWidth - Width of a single item in pixels  
    * @param itemCount - Total number of items to layout
    * @param gap - Gap between items in pixels
    * @returns Grid configuration object with rows and columns
    */
   function calculateGridLayout(
     containerWidth: number,
     itemWidth: number,
     itemCount: number,
     gap: number
   ): GridLayout {
     // Implementation...
   }
   ```

2. **Explain "why" not "what"**
   ```typescript
   // BAD: Explains what the code does, which is already obvious
   // Increment counter by 1
   counter += 1;
   
   // GOOD: Explains why the code does something
   // Use += operator to avoid potential bugs with post-increment behavior
   counter += 1;
   ```

3. **Document edge cases and limitations**
   ```typescript
   /**
    * Formats a phone number to (XXX) XXX-XXXX format.
    * 
    * @param phoneNumber - The phone number to format
    * @returns Formatted phone number
    * 
    * @note Only works with US phone numbers (10 digits)
    * @note Returns the input unchanged if it doesn't match the expected format
    */
   function formatPhoneNumber(phoneNumber: string): string {
     // Implementation...
   }
   ```

## TypeScript and JSDoc

1. **Use JSDoc for public APIs**
   ```typescript
   /**
    * Creates a paginated fetch function for API endpoints.
    * 
    * @template T - The type of data being fetched
    * @param {string} baseUrl - The base URL for the API
    * @param {Object} options - Configuration options
    * @param {number} options.pageSize - Number of items per page
    * @param {string} options.resourceName - Name of the resource being fetched
    * @returns {Function} A function that accepts page number and returns paginated data
    * 
    * @example
    * const fetchUsers = createPaginatedFetch('/api/users', { pageSize: 10, resourceName: 'users' });
    * const page1 = await fetchUsers(1);
    */
   function createPaginatedFetch<T>(
     baseUrl: string, 
     options: { pageSize: number, resourceName: string }
   ): (page: number) => Promise<PaginatedResult<T>> {
     // Implementation...
   }
   ```

2. **Include examples in comments**
   ```typescript
   /**
    * Debounces a function to limit how often it can be called.
    * 
    * @param fn - The function to debounce
    * @param delay - The delay in milliseconds
    * @returns A debounced version of the function
    * 
    * @example
    * // Only call saveChanges once after the user stops typing for 500ms
    * const debouncedSave = debounce(saveChanges, 500);
    * inputElement.addEventListener('input', debouncedSave);
    */
   function debounce<T extends (...args: any[]) => any>(
     fn: T,
     delay: number
   ): (...args: Parameters<T>) => void {
     // Implementation...
   }
   ```

3. **Document side effects**
   ```typescript
   /**
    * Saves user preferences to localStorage.
    * 
    * @param preferences - User preference object
    * 
    * @sideEffect Writes to localStorage
    * @throws Will throw if localStorage is not available
    */
   function saveUserPreferences(preferences: UserPreferences): void {
     // Implementation...
   }
   ```

## Comment Maintenance

1. **Remove commented-out code**
   - Don't leave dead code commented out
   - Use version control to track code history instead

2. **Use TODO comments with tracking information**
   ```typescript
   // TODO(JIRA-123): Implement pagination for large result sets
   ```

3. **Update comments during code review**
   - Reviewers should ensure comments match implementation
   - Request comment updates when code changes during review
