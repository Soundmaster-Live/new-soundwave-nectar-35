
# Testing Strategy

This document outlines our approach to testing at different levels in the SoundMaster Radio application.

## Testing Levels

### Unit Testing

- **Focus**: Test individual components, functions, and hooks in isolation
- **Tools**: Jest, React Testing Library
- **Command**: `npm run test:unit`
- **Coverage Target**: 80% for non-UI code

**Examples:**

```tsx
// Component test
test('button click increments counter', () => {
  const { getByText } = render(<Counter />);
  fireEvent.click(getByText('Increment'));
  expect(getByText('Count: 1')).toBeInTheDocument();
});

// Hook test
test('useFormValidation returns error for invalid email', () => {
  const { result } = renderHook(() => useFormValidation());
  act(() => {
    result.current.validateEmail('not-an-email');
  });
  expect(result.current.errors.email).toBe('Invalid email format');
});
```

### Integration Testing

- **Focus**: Test how components work together, API interactions
- **Tools**: Jest, React Testing Library, MSW (Mock Service Worker)
- **Command**: `npm run test:integration`
- **Coverage Target**: Critical user flows

**Examples:**

```tsx
// Feature test with mocked API
test('user can login and see their profile', async () => {
  // Mock API response
  server.use(
    rest.post('/api/login', (req, res, ctx) => {
      return res(ctx.json({ user: { id: '123', name: 'Test User' } }));
    })
  );

  const { getByLabelText, getByText, findByText } = render(<App />);
  
  // Login form
  fireEvent.change(getByLabelText('Email'), { target: { value: 'user@example.com' } });
  fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.click(getByText('Log In'));
  
  // Assert user is logged in
  expect(await findByText('Welcome, Test User')).toBeInTheDocument();
});
```

### End-to-End Testing

- **Focus**: Test complete user flows in a real browser
- **Tools**: Cypress
- **Command**: `npm run test:e2e`
- **Coverage Target**: Critical business paths

**Examples:**

```js
// E2E user registration test
describe('User Registration', () => {
  it('allows a new user to register', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('New User');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('securePassword123');
    cy.get('input[name="confirmPassword"]').type('securePassword123');
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, New User');
  });
});
```

## Test Organization

1. **Co-locate tests with code**
   ```
   src/
     components/
       Button/
         Button.tsx
         Button.test.tsx
   ```

2. **Use descriptive test names**
   ```tsx
   describe('Button component', () => {
     it('renders with default props', () => {
       // ...
     });
     
     it('calls onClick handler when clicked', () => {
       // ...
     });
     
     it('displays loading spinner when isLoading is true', () => {
       // ...
     });
   });
   ```

3. **Group related tests**
   - Use `describe` blocks to group tests
   - Nest `describe` blocks for sub-features
   - Keep test files organized and focused

## Test Data Management

1. **Test fixtures**
   - Create reusable test data
   - Store in separate fixture files
   - Use factories for complex objects

2. **Mocking external dependencies**
   - Mock API responses
   - Mock browser APIs
   - Use consistent mock data

3. **Test environment variables**
   - Use separate environment for testing
   - Configure test-specific settings
   - Reset state between tests

## Continuous Integration

1. **Run tests on each PR**
   - Unit tests
   - Integration tests
   - Linting checks

2. **Run E2E tests on schedule**
   - Nightly runs
   - Pre-release verification
   - Deploy preview testing

3. **Test reporting**
   - Track test coverage trends
   - Report test failures clearly
   - Integrate with PR process
