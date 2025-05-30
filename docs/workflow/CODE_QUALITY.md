
# Code Quality Standards

This document outlines our standards for maintaining high code quality in the SoundMaster Radio application.

## Code Style and Formatting

- **Linting**: Run `npm run lint` to ensure code style compliance
- **Formatting**: Run `npm run format` to automatically format code
- **TypeScript**: Ensure type safety with strict mode enabled
- **Component Structure**: 
  - Keep components small and focused
  - Use custom hooks for complex logic
  - Follow the separation of concerns principle

## Testing Requirements

- **Unit Tests**:
  - Required for all utility functions
  - Required for custom hooks
  - Required for complex components
  - Aim for 80%+ coverage of non-UI code

- **Integration Tests**:
  - Required for critical user flows
  - Required for API interactions
  - Focus on happy paths and common edge cases

- **End-to-End Tests**:
  - Required for critical business flows
  - Cover authentication and core user journeys

## Code Review Checklist

Before submitting a PR:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New code has appropriate test coverage
- [ ] No unnecessary console logs in production code
- [ ] No hardcoded values that should be configuration
- [ ] Types are properly defined
- [ ] Comments explain "why" not just "what"
- [ ] Appropriate error handling
- [ ] Accessibility considerations addressed
- [ ] Performance implications considered

When reviewing a PR:

- [ ] Code is understandable and maintainable
- [ ] Logic is correct and efficient
- [ ] Edge cases are handled appropriately
- [ ] Consistent naming conventions
- [ ] No code smells (duplicated code, overly complex functions)
- [ ] Proper separation of concerns
- [ ] UI components follow design system guidelines

## Definition of Done

A feature is considered "done" when:

1. Implementation is complete
2. Tests are written and passing
3. Code is reviewed and approved
4. Documentation is updated
5. Acceptance criteria are met
6. The feature works in all target environments
7. Accessibility requirements are met
8. Performance requirements are met
