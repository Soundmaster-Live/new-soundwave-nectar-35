
# Tech Stack

This document provides details about the technologies used in the SoundMaster Radio application.

## Frontend

### Core Technologies
- **React**: Frontend library for building user interfaces
- **TypeScript**: Typed superset of JavaScript for enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library built on Radix UI primitives

### State Management
- **React Context API**: For global state management
- **TanStack Query**: For server state management and data fetching

### Audio/Video
- **Howler.js**: Audio library for handling streaming and audio playback
- **Embedded Video Players**: Support for embedded video streams

## Backend

### Current Implementation
- **Supabase**: Backend-as-a-Service platform providing:
  - Authentication
  - PostgreSQL database
  - Edge functions (serverless)
  - Storage

### Alternative Options
- **Firebase**: Alternative BaaS option with similar capabilities
- **Cloudflare**: Alternative for hosting and serverless functionality

## AI Services

### Text Generation
- **Google Gemini API**: Primary AI provider for text generation
  - Models: `gemini-1.5-flash`
- **OpenRouter**: Fallback AI provider
  - Models: `mistralai/mistral-7b-instruct`
- **OpenAI (Server-side)**: Used in edge functions
  - Models: `gpt-4o-mini`

### Text-to-Speech
- **ElevenLabs**: High-quality voice synthesis for the AI broadcaster

## Development Tools

### Build Tools
- **Vite**: Frontend build tool and development server
- **npm**: Package manager

### Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **Cypress**: End-to-end testing framework

## Deployment

### Hosting Options
- **Lovable**: Current deployment platform
- **Cloudflare Pages**: Alternative static site hosting
- **Firebase Hosting**: Alternative hosting option
- **Docker**: Containerization for custom deployments

## Version Control and Collaboration

- **Git**: Version control system
- **GitHub**: Repository hosting and collaboration
