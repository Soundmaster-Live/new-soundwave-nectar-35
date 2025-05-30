
# Branching Strategy

We follow a simplified Git Flow branching model for our development workflow.

## Branch Types

1. **main**
   - Production-ready code
   - Protected branch, requires approvals for merges
   - Always deployable

2. **develop**
   - Integration branch for features
   - Used for development deployments
   - Contains the latest development changes

3. **feature/***
   - Individual feature branches
   - Created from and merged back into develop
   - Example: `feature/auth-improvements`

4. **bugfix/***
   - Bug fix branches
   - Created from develop for non-critical fixes
   - Example: `bugfix/streaming-error`

5. **hotfix/***
   - Critical fix branches
   - Created from main for urgent production fixes
   - Merged to both main and develop
   - Example: `hotfix/critical-auth-issue`

6. **release/***
   - Release preparation branches
   - Created from develop when preparing a new release
   - Example: `release/v1.2.0`

## Branch Structure Visualization

```
main
 ├── develop
 │    ├── feature/auth-improvements
 │    ├── feature/new-player-ui
 │    └── bugfix/streaming-error
 └── release/v1.2.0
```

## Branch Naming Convention

- Use lowercase with hyphens for separating words
- Prefix with the branch type
- Be descriptive but concise
- Include issue/ticket references when applicable

**Examples:**
- `feature/user-profile-settings`
- `bugfix/playlist-loading-error`
- `hotfix/authentication-token-fix`
- `release/v2.1.0`

## Branch Lifecycle

1. **Creation**
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/my-feature
   ```

2. **Regular Updates**
   ```bash
   # Keep branch updated with develop
   git checkout develop
   git pull
   git checkout feature/my-feature
   git merge develop
   ```

3. **Completion**
   ```bash
   # Create pull request to develop
   # After approval and merge, delete branch
   git branch -d feature/my-feature
   ```

## Pull Request Process

1. Create a pull request to the appropriate target branch
2. Fill out the pull request template completely
3. Request reviews from appropriate team members
4. Address all review comments
5. Ensure CI checks pass
6. Merge only after receiving required approvals
