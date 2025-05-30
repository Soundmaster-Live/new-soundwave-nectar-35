
# Release Process

This document outlines our process for releasing new versions of the SoundMaster Radio application.

## Release Preparation

1. **Create a release branch**
   ```bash
   git checkout develop
   git pull
   git checkout -b release/v1.2.0
   ```

2. **Version bump and change log**
   - Update version in package.json
   ```bash
   npm version 1.2.0 --no-git-tag-version
   ```
   - Update CHANGELOG.md with all significant changes
   ```markdown
   # Changelog

   ## [1.2.0] - YYYY-MM-DD

   ### Added
   - New feature 1
   - New feature 2

   ### Changed
   - Changed feature 1
   - Changed feature 2

   ### Fixed
   - Fixed issue 1
   - Fixed issue 2
   ```

3. **Final testing and bug fixes**
   - Perform regression testing
   - Fix any issues found directly in the release branch
   - Run full test suite
   ```bash
   npm run test:all
   ```

4. **Release candidate deployments**
   - Deploy to staging environment
   - Perform UAT (User Acceptance Testing)
   - Fix any issues found directly in the release branch

## Release Execution

1. **Merge to main**
   ```bash
   git checkout main
   git pull
   git merge release/v1.2.0 --no-ff
   ```

2. **Create and push tag**
   ```bash
   git tag v1.2.0
   git push origin main --tags
   ```

3. **Merge back to develop**
   ```bash
   git checkout develop
   git pull
   git merge release/v1.2.0 --no-ff
   git push origin develop
   ```

4. **Clean up**
   ```bash
   git branch -d release/v1.2.0
   git push origin --delete release/v1.2.0
   ```

## Production Deployment

1. **Deploy to production**
   - Follow the [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
   - Monitor the deployment process
   - Verify successful deployment

2. **Post-release verification**
   - Smoke test critical paths
   - Monitor error rates and performance
   - Check for any unexpected issues

3. **Communicate release**
   - Announce to internal stakeholders
   - Update release notes for users
   - Document any known issues or workarounds

## Hotfix Process

If critical issues are discovered in production:

1. **Create hotfix branch from main**
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/critical-fix
   ```

2. **Implement and test fix**
   - Make minimal changes needed to fix the issue
   - Add tests to prevent regression
   - Test thoroughly

3. **Update version and changelog**
   - Increment patch version (e.g., 1.2.0 → 1.2.1)
   - Update changelog with fix details

4. **Merge to main and develop**
   ```bash
   # Merge to main
   git checkout main
   git pull
   git merge hotfix/critical-fix --no-ff
   git tag v1.2.1
   git push origin main --tags

   # Merge to develop
   git checkout develop
   git pull
   git merge hotfix/critical-fix --no-ff
   git push origin develop
   ```

5. **Deploy hotfix to production**
   - Follow expedited deployment process
   - Verify fix in production
   - Communicate hotfix to stakeholders
