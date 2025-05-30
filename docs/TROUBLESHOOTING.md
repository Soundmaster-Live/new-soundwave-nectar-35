
# Troubleshooting Guide

## Common Issues and Solutions

### Audio Streaming Issues

#### Stream Not Playing

**Symptoms:**
- Play button doesn't start the stream
- Console shows stream loading errors
- Toast notifications about stream failures

**Possible Causes:**
1. Invalid stream URL
2. CORS restrictions
3. Network connectivity issues
4. Browser audio restrictions

**Solutions:**
1. Verify the stream URL is correct and accessible
2. Check for CORS headers on the streaming server
3. Test network connectivity to the streaming server
4. Check if the browser requires user interaction before playing audio
5. Try using a different browser or device

**Code to Check:**
```javascript
// src/components/streaming/hooks/useAudioStream.ts
// Update the actual stream URL
const streamUrl = "https://example.com/stream.mp3"; // Replace with actual working URL
```

### Authentication Issues

#### Can't Sign In or Register

**Symptoms:**
- Sign-in form submits but nothing happens
- Console shows authentication errors
- User remains unauthenticated after sign-in

**Possible Causes:**
1. Supabase configuration issues
2. Network connectivity problems
3. Invalid credentials
4. Email confirmation required

**Solutions:**
1. Verify Supabase credentials in the configuration
2. Check network connectivity to Supabase
3. Reset password if necessary
4. Check if email confirmation is required in Supabase settings

### Navigation Issues

#### Buttons Not Working As Expected

**Symptoms:**
- Clicking navigation buttons doesn't navigate to the expected page
- URL changes but page doesn't update
- Console shows React Router warnings

**Possible Causes:**
1. Incorrect route definitions
2. Missing or misconfigured routes
3. Navigation events being prevented

**Solutions:**
1. Check route definitions in `AppRoutes.tsx`
2. Verify that click handlers are using the correct navigation functions
3. Ensure that event propagation isn't being stopped incorrectly

### Layout and Styling Issues

#### Responsive Design Problems

**Symptoms:**
- Content overflows on mobile devices
- Elements misaligned on certain screen sizes
- Unexpected spacing or margins

**Possible Causes:**
1. Missing responsive Tailwind classes
2. Hardcoded dimensions
3. Overflow properties not set correctly

**Solutions:**
1. Add appropriate Tailwind responsive classes (sm:, md:, lg:, etc.)
2. Replace hardcoded dimensions with responsive values
3. Check overflow properties on containers

## Debugging Techniques

### Console Logging

Add strategic console logs to track application flow:

```javascript
console.log("Component mounted with props:", props);
console.log("State updated:", newState);
console.log("Function called with args:", args);
```

### React DevTools

Use React DevTools Chrome extension to:
- Inspect component hierarchy
- Monitor state and props changes
- Profile performance issues

### Network Monitoring

Use browser DevTools Network tab to:
- Monitor API requests
- Check for failed requests
- Verify request/response payloads

### Error Boundaries

The application uses ErrorBoundary components to catch and display errors gracefully. Check these for captured errors.
