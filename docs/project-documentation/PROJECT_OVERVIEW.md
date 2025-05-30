
# SoundMaster Radio Project Overview

## Introduction
SoundMaster Radio is a web application for streaming radio content, featuring AI-powered broadcasting, user authentication, and interactive content. It combines modern frontend technologies with cloud backend services to deliver a seamless audio experience.

## Key Features
- Live radio streaming with audio and video support
- AI-powered DJ broadcasting with text-to-speech capabilities
- User authentication and profile management
- Admin dashboard for content management
- Real-time chat and interaction

## Tech Stack Overview
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (currently), with support for alternative backends
- **State Management**: React Context API, TanStack Query
- **Streaming**: Howler.js
- **AI Integration**: OpenRouter, Google Gemini, ElevenLabs

For more detailed information about the tech stack, see the [Tech Stack](./TECH_STACK.md) document.

## High-Level Architecture
The application follows a client-server architecture with:
- Single page application (SPA) frontend
- API-based backend services
- Serverless functions for backend logic
- Database for persistent storage
- Cloud storage for media files

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │◄────┤  Edge Functions │◄────┤    Database     │
│    (React)      │     │  (Serverless)   │     │   (SQL/NoSQL)   │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  External APIs  │     │  File Storage   │
│  (AI, Payments) │     │                 │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

For detailed information about the architecture, see the [Architecture](./ARCHITECTURE.md) document.

