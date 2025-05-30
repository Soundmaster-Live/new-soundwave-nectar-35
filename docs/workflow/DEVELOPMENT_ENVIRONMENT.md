
# Development Environment Setup

This guide covers the steps needed to set up your local development environment for the SoundMaster Radio application.

## Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Git
- Docker (optional, for local database)

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soundmaster-radio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the required environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` to include your specific configuration values. See the [Environment Setup Guide](../ENVIRONMENT_SETUP.md) for details on required variables.

4. **Configure version control settings**
   Follow our [GitIgnore Recommendations](../GITIGNORE_RECOMMENDATIONS.md) guide to ensure proper file exclusions.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open `http://localhost:8080` in your browser.

## Editor Setup

We recommend using Visual Studio Code with the following extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero

## Troubleshooting Common Setup Issues

### Node Version Mismatch

If you encounter errors related to Node.js version:
```bash
# Check your Node.js version
node --version

# Use nvm to install and use the correct version
nvm install 18
nvm use 18
```

### Package Installation Issues

If you encounter errors during `npm install`:
```bash
# Clear npm cache
npm cache clean --force

# Try with legacy peer deps
npm install --legacy-peer-deps
```

### Environment Configuration

If the application fails to start due to missing environment variables:
1. Check that all required variables in `.env.example` are present in your `.env.local`
2. Ensure values are correctly formatted (no trailing spaces, proper quoting)
3. Restart the development server after making changes
