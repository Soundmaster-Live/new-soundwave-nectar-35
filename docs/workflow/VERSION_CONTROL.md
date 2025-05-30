
# Version Control Best Practices

This document outlines our best practices for using Git and version control in the SoundMaster Radio application.

## Repository Hygiene

1. **Keep the repository clean**
   - Follow the [.gitignore guidelines](../GITIGNORE_RECOMMENDATIONS.md)
   - Don't commit build artifacts, logs, or environment-specific files
   - Regularly update your `.gitignore` file as project requirements evolve

2. **Protect sensitive information**
   - Never commit API keys, passwords, or other secrets
   - Use environment variables for sensitive information
   - If you accidentally commit sensitive data, follow the [security guide](../best-practices/SECURITY.md)

## Commit Practices

1. **Use meaningful commit messages**
   - Follow conventional commits standard
   ```
   <type>(<scope>): <description>

   [optional body]

   [optional footer(s)]
   ```
   - Types: feat, fix, docs, style, refactor, test, chore
   - Include issue references when applicable
   - Be descriptive but concise

   **Examples:**
   ```
   feat(auth): add password reset functionality
   fix(player): resolve issue with playlist not advancing
   docs: update installation instructions
   ```

2. **Keep commits focused**
   - Each commit should represent one logical change
   - Avoid mixing unrelated changes in a single commit
   - Use `git add -p` to selectively stage changes

3. **Commit frequently**
   - Make small, frequent commits rather than large, infrequent ones
   - This makes code review easier and history more useful
   - Use rebase/squash before PR if needed to create coherent commits

## Working with Remote Repositories

1. **Keep branches updated**
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

2. **Resolve conflicts properly**
   - Understand the changes causing the conflict
   - Consult with other developers when necessary
   - Test thoroughly after conflict resolution

3. **Force push with caution**
   - Avoid force pushing to shared branches
   - Use `--force-with-lease` instead of `--force` when necessary
   ```bash
   git push --force-with-lease origin feature/my-feature
   ```

4. **Clean up after merging**
   - Delete branches after they're merged
   - Keep the remote repository tidy
   ```bash
   git branch -d feature/completed-feature
   git push origin --delete feature/completed-feature
   ```

## Advanced Git Techniques

1. **Using interactive rebase**
   ```bash
   git rebase -i HEAD~3
   ```

2. **Creating useful aliases**
   ```bash
   git config --global alias.st status
   git config --global alias.co checkout
   git config --global alias.br branch
   ```

3. **Utilizing git hooks**
   - Use pre-commit hooks for linting and formatting
   - Use pre-push hooks for running tests
   - Set up in the project using Husky
