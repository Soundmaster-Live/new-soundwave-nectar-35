
# Testing

This document outlines the testing strategy and procedures for the SoundMaster Radio application.

## Testing Strategy

The application uses a comprehensive testing approach with:

1. **Unit Tests**: Testing individual functions and components in isolation
2. **Integration Tests**: Testing interactions between components
3. **End-to-End Tests**: Testing complete user flows in the application
4. **Manual Testing**: Final verification of features before release

## Unit Testing

Unit tests focus on individual functions, hooks, and components.

### Testing Technology

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **Mock Service Worker**: Mocking API responses

### Running Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (during development)
npm run test:watch
```

### Writing Unit Tests

#### Testing Components

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct styles for variant', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-primary');
  });
});
```

#### Testing Hooks

```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

describe('useCounter hook', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  test('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  test('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  test('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  test('should reset counter', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

#### Testing Utilities

```typescript
// formatTime.test.ts
import { formatTime } from './formatTime';

describe('formatTime utility', () => {
  test('formats seconds to MM:SS', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(3661)).toBe('61:01');
  });

  test('handles zero and negative values', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(-10)).toBe('00:00');
  });
});
```

## Integration Testing

Integration tests focus on interactions between components and services.

### Testing API Integrations

```typescript
// userApi.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fetchUserProfile, updateUserProfile } from './userApi';

const server = setupServer(
  rest.get('/api/profiles/:id', (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, username: 'testuser' }));
  }),
  
  rest.put('/api/profiles/:id', (req, res, ctx) => {
    return res(ctx.json({ ...req.body }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('User API', () => {
  test('fetchUserProfile returns user data', async () => {
    const result = await fetchUserProfile('123');
    expect(result.data).toEqual({ id: '123', username: 'testuser' });
  });

  test('updateUserProfile sends correct data', async () => {
    const updates = { username: 'newusername' };
    const result = await updateUserProfile('123', updates);
    expect(result.data).toEqual(updates);
  });
});
```

### Testing Component Integrations

```typescript
// LiveRadio.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LiveRadio } from './LiveRadio';
import { RadioProvider } from '../contexts/RadioContext';

jest.mock('../hooks/useAudioStream', () => ({
  useAudioStream: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    playing: false,
    status: 'idle',
  }),
}));

describe('LiveRadio page', () => {
  test('renders station list and player', async () => {
    render(
      <RadioProvider>
        <LiveRadio />
      </RadioProvider>
    );
    
    expect(screen.getByText('Live Radio')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Station 1')).toBeInTheDocument();
    });
    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
  });

  test('selects station when clicked', async () => {
    render(
      <RadioProvider>
        <LiveRadio />
      </RadioProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Station 1')).toBeInTheDocument();
    });
    
    userEvent.click(screen.getByText('Station 1'));
    
    expect(screen.getByTestId('active-station')).toHaveTextContent('Station 1');
  });
});
```

## End-to-End Testing

E2E tests validate complete user workflows using Cypress.

### Setting Up Cypress

```bash
# Install Cypress
npm install cypress --save-dev

# Open Cypress test runner
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

### Writing E2E Tests

```typescript
// cypress/integration/authentication.spec.ts
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows a user to sign up', () => {
    cy.get('[data-cy=nav-signup]').click();
    cy.url().should('include', '/auth');
    
    const email = `test${Date.now()}@example.com`;
    
    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type('Password123!');
    cy.get('[data-cy=signup-button]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=user-menu]').should('exist');
  });

  it('allows a user to log in', () => {
    cy.get('[data-cy=nav-login]').click();
    cy.url().should('include', '/auth');
    
    cy.get('[data-cy=email-input]').type('existing@example.com');
    cy.get('[data-cy=password-input]').type('Password123!');
    cy.get('[data-cy=login-button]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=user-menu]').should('exist');
  });

  it('shows error message for invalid credentials', () => {
    cy.get('[data-cy=nav-login]').click();
    cy.url().should('include', '/auth');
    
    cy.get('[data-cy=email-input]').type('nonexistent@example.com');
    cy.get('[data-cy=password-input]').type('WrongPassword');
    cy.get('[data-cy=login-button]').click();
    
    cy.get('[data-cy=auth-error]').should('be.visible');
    cy.url().should('include', '/auth');
  });
});
```

### E2E Test Organization

Organize E2E tests by feature or user flow:

```
cypress/
  integration/
    authentication.spec.ts
    live-radio.spec.ts
    ai-broadcaster.spec.ts
    admin-dashboard.spec.ts
    user-profile.spec.ts
  fixtures/
    users.json
    stations.json
  support/
    commands.js
    index.js
```

## Manual Testing

Manual testing is used for final verification before releases.

### Manual Testing Checklist

#### Authentication
- [ ] User can sign up with email and password
- [ ] User can log in with email and password
- [ ] User can reset password
- [ ] User can log out
- [ ] Protected routes redirect to login

#### Radio Streaming
- [ ] Radio stations list loads correctly
- [ ] Station can be selected
- [ ] Audio plays when play button is clicked
- [ ] Audio pauses when pause button is clicked
- [ ] Volume control works correctly

#### AI Broadcaster
- [ ] AI DJ responds to user input
- [ ] Text-to-speech plays audio
- [ ] Conversation history is maintained
- [ ] Settings can be configured

#### Admin Dashboard
- [ ] Admin can view list of users
- [ ] Admin can manage radio stations
- [ ] Admin can add/edit/delete content
- [ ] Analytics data loads correctly

#### Responsive Design
- [ ] Application displays correctly on desktop
- [ ] Application displays correctly on tablet
- [ ] Application displays correctly on mobile
- [ ] Interactive elements are usable on touch devices

## Performance Testing

### Lighthouse Audit

Run Lighthouse audits to measure:
- Performance
- Accessibility
- Best Practices
- SEO
- PWA compliance

### React Profiler

Use React Profiler to:
- Identify components that re-render too often
- Measure render times
- Optimize component performance

### Load Testing

Use load testing tools to measure server performance:
- Response times under load
- Maximum concurrent users
- Error rates under stress

## Accessibility Testing

Ensure the application is accessible:
- Use axe or similar tools to identify accessibility issues
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios

## Test Coverage

Monitor test coverage to ensure adequate testing:

```bash
# Generate coverage report
npm run test:coverage
```

Target coverage metrics:
- Lines: 80%+
- Branches: 75%+
- Functions: 80%+
- Statements: 80%+

## Test Documentation

Document test cases in a structured format:

```
Test ID: TC-001
Title: User Login with Valid Credentials
Description: Verify that a user can log in with valid credentials
Preconditions:
  - User account exists
  - User is not logged in
Steps:
  1. Navigate to login page
  2. Enter valid email
  3. Enter valid password
  4. Click login button
Expected Results:
  - User is redirected to dashboard
  - User is authenticated
  - User menu shows username
```

