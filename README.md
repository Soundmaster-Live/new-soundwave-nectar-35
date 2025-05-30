
# SoundMaster Radio

A modern web application for streaming radio content, providing AI-powered broadcasting, and interactive content management.

![SoundMaster Radio]()

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

SoundMaster Radio is a comprehensive web application for streaming radio content, featuring AI-powered broadcasting, user authentication, and interactive content. It combines modern frontend technologies with cloud backend services to deliver a seamless audio experience.

## Features

- **Live Radio Streaming**: Audio and video streaming with real-time metadata updates
- **AI-Powered DJ**: AI broadcaster with text-to-speech capabilities
- **User Authentication**: Complete user authentication and profile management
- **Admin Dashboard**: Content management, booking management, and analytics
- **Interactive Content**: Live chat and user engagement features
- **Booking System**: Comprehensive event booking system for weddings, parties, and karaoke events
- **Multi-Environment Support**: Deploy to various cloud providers or run locally
- **Responsive Design**: Fully responsive UI for all device sizes

## Tech Stack

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: UI component library
- **Vite**: Build tool and development server
- **React Router**: Routing library
- **TanStack Query**: Data fetching and state management
- **Howler.js**: Audio playback library
- **Mapbox**: Map integration for location features

### Backend Options
- **Supabase**: Current backend (Auth, Database, Storage, Edge Functions)
- **Firebase**: Alternative backend option
- **Cloudflare**: Alternative backend option

### AI Services
- **Google Gemini**: Primary AI provider for text generation
- **OpenRouter**: Secondary AI provider
- **ElevenLabs**: Text-to-speech service

## Project Structure

```
/src
  /components     # Reusable UI components
  /contexts       # React context providers
  /hooks          # Custom React hooks
  /integrations   # External service integrations
  /lib            # Utility functions
  /pages          # Main application pages
  /types          # TypeScript type definitions
  /utils          # Helper functions
/docs             # Project documentation
/supabase         # Supabase configuration and functions
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd soundmaster-radio
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Git: Review the [.gitignore recommendations](docs/GITIGNORE_RECOMMENDATIONS.md) and initialize the repository.

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to: http://localhost:8080

## Deployment Options

### Lovable Deployment
1. Open your Lovable project
2. Click on the "Share" button
3. Select "Publish"
4. Follow the instructions to complete deployment

### Alternative Deployment Options
- **Firebase**: See [Firebase Deployment Guide](docs/DEPLOYMENT.md#firebase-deployment)
- **Cloudflare**: See [Cloudflare Deployment Guide](docs/DEPLOYMENT.md#cloudflare-deployment)
- **Docker**: See [Docker Deployment Guide](docs/DEPLOYMENT.md#docker-deployment)
- **Netlify/Vercel**: See [Netlify/Vercel Deployment Guide](docs/DEPLOYMENT.md#netlify-vercel-deployment)

## Environment Configuration

See the [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md) for detailed instructions on setting up the application in different environments.

## API Reference

See the [API Documentation](docs/API_DOCUMENTATION.md) for detailed information on the application's API endpoints.

## Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Components Documentation](docs/COMPONENTS.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md)
- [Migration Guide](docs/MIGRATION_GUIDE.md)
- [Map Integration Guide](docs/MAP_INTEGRATION.md)
- [Contact Map Integration](docs/CONTACT_MAP_INTEGRATION.md)
- [Project Documentation](docs/PROJECT_DOCUMENTATION.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [GitIgnore Recommendations](docs/GITIGNORE_RECOMMENDATIONS.md)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Set up .gitignore: Follow our [.gitignore guidelines](docs/GITIGNORE_RECOMMENDATIONS.md)
4. Commit your changes: `git commit -am 'Add my feature'`
5. Push to the branch: `git push origin feature/my-feature`
6. Submit a pull request

## Roadmap

### Q3 2023
- [x] Initial project setup
- [x] Basic UI components
- [x] Authentication system
- [x] Live radio streaming

### Q4 2023
- [x] Admin dashboard
- [x] User profiles
- [x] AI broadcaster integration
- [x] Content management system

### Q1 2024
- [x] Enhanced AI capabilities
- [x] Live lesson features
- [x] Map integration
- [x] Multi-environment support

### Q2 2024
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Recommendation system

### Future Plans
- [ ] Offline mode
- [ ] Push notifications
- [ ] Social features
- [ ] Podcasts support
- [ ] Advanced DJ tools

## License

This project is licensed under the MIT License - see the LICENSE file for details.
