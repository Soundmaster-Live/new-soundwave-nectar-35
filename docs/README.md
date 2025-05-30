
# SoundMaster Project Documentation

## Overview
This document provides a comprehensive overview of the SoundMaster web application, including its architecture, key components, and configurations.

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Key Components](#key-components)
3. [Authentication](#authentication)
4. [Streaming Features](#streaming-features)
5. [Navigation](#navigation)
6. [API Integration](#api-integration)
7. [Database Schema](#database-schema)
8. [Deployment](#deployment)

## Project Architecture
The SoundMaster application is built using:
- React with TypeScript
- Vite as the build tool
- TailwindCSS for styling
- Shadcn UI for component library
- Supabase for backend services
- React Router for navigation
- Tanstack Query for data fetching

The application follows a component-based architecture with the following structure:
- `/src`: Main source code
  - `/components`: Reusable UI components
  - `/hooks`: Custom React hooks
  - `/pages`: Main application pages
  - `/contexts`: React context providers
  - `/lib`: Utility functions
  - `/integrations`: External service integrations
  - `/types`: TypeScript type definitions

## Key Components

### Audio Streaming
The application includes a live radio streaming feature implemented using the Howler.js library. Key components:
- `LiveStreamPlayer`: Main player component with play/pause controls
- `useAudioStream`: Custom hook that handles audio streaming logic
- `KickStreamModal`: Modal component for video streaming
- `StatusIndicator`: Visual indicator for stream status

### Navigation
Navigation is handled by React Router with a responsive navbar that adapts to different screen sizes.

### Authentication
User authentication is implemented using Supabase Auth with features like:
- Sign-in and sign-up forms
- Protected routes for authenticated users
- Admin-only routes

## Streaming Features
The application includes:
- Audio streaming with live metadata updates
- Video streaming integration with Kick.com
- Stream status indicators
- Volume controls

## Known Issues and Fixes
- Audio streaming URLs need to be updated with actual stream sources
- Error handling has been implemented for stream loading failures
- Login and registration navigation has been optimized
