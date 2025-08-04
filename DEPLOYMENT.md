# Sistema de Gerenciamento do Laboratório UEFS - Deployment Guide

## Environment Setup

### Firebase Configuration

To run this application, you need to set up Firebase environment variables. 

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase project configuration values in `.env.local`:

   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### For Production Deployment

When deploying to production (Firebase Hosting, Vercel, etc.), make sure to set these environment variables in your deployment platform:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Tailwind CSS v4

This project uses Tailwind CSS v4 with the new configuration format:

- Custom theme colors are defined in `src/index.css` using the `@theme` directive
- The project uses the new `@tailwindcss/postcss` plugin
- Custom UEFS colors and styling are properly configured

### Available Custom Classes

- **Colors**: `bg-uefs-primary`, `text-uefs-primary`, `border-uefs-primary`, etc.
- **Gray Scale**: `bg-uefs-gray-50` through `bg-uefs-gray-900`
- **Shadows**: `shadow-uefs`, `shadow-uefs-lg`

## Common Issues

### Firebase Authentication Error

If you see `Firebase: Error (auth/invalid-api-key)`, it means:

1. The Firebase API key is missing or incorrect
2. Environment variables are not being loaded properly
3. The environment variables are not set in your deployment platform

**Solution**: Verify that all Firebase environment variables are correctly set and accessible.

### Styling Not Appearing

If custom UEFS styling is not appearing:

1. Make sure you're using the correct Tailwind v4 configuration
2. Verify that the build process is generating the CSS correctly
3. Check that `src/index.css` contains the `@theme` directive with custom colors

**Solution**: The Tailwind configuration has been updated to v4 format, and this should resolve styling issues.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
npm run deploy
```

## Build Requirements

- Node.js 18+
- npm or yarn
- Proper Firebase environment variables
- Tailwind CSS v4 compatible setup