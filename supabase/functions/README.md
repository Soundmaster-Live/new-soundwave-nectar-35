# Supabase Edge Functions

This directory contains Edge Functions that run on Supabase's infrastructure using the Deno runtime.

## Setup for Development

To properly work with these Edge Functions in your development environment, we've added the following configuration files:

1. `deno.d.ts` - Type declarations for Deno runtime and modules
2. `tsconfig.json` - TypeScript configuration for Deno
3. `import_map.json` - Import map for resolving Deno imports

These files help TypeScript understand the Deno environment and prevent type errors during development.

## Available Functions

### ai-broadcaster

This function handles AI-powered broadcasting features for the radio station.

### send-notification

This function sends notifications to users based on various events.

### update-radio-metrics

This function updates metrics for the radio station, such as listener counts.

## Local Development

To run these functions locally, you need to install the Supabase CLI and Deno:

```bash
# Install Supabase CLI
npm install -g supabase

# Start the local development server
supabase start

# Run a specific function locally
supabase functions serve ai-broadcaster
```

## Deployment

To deploy these functions to your Supabase project:

```bash
# Deploy a specific function
supabase functions deploy ai-broadcaster

# Deploy all functions
supabase functions deploy
```

## TypeScript Support

The type errors you might see in your IDE are related to the Deno runtime, which uses a different module system than Node.js. The configuration files we've added should help reduce these errors, but they might still appear in some cases.

These errors won't affect the actual functionality of the Edge Functions when deployed to Supabase, as they run in the Deno runtime which properly supports the import syntax used in the code.
