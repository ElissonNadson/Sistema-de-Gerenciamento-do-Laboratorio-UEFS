# Deploy Instructions

## Automatic Deployment

This project is configured with GitHub Actions for automatic deployment to Firebase Hosting.

### Prerequisites

1. Firebase Service Account key must be added to GitHub repository secrets as `FIREBASE_SERVICE_ACCOUNT_SISTEMA_HORARIO_LAB_UEFS`
2. Firebase project ID: `sistema-horario-lab-uefs`

### Deployment Process

The deployment happens automatically when:
- Code is pushed to the `main` branch
- Pull requests are created against the `main` branch (preview deployment)

### Manual Deployment

If you need to deploy manually:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run linting:
   ```bash
   npm run lint
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy to Firebase (requires authentication):
   ```bash
   npm run deploy
   ```

### Live URLs

- Production: https://sistema-horario-lab-uefs.web.app
- Alternative: https://sistema-horario-lab-uefs.firebaseapp.com

## Project Structure

- `src/` - Source code
- `dist/` - Built files (auto-generated)
- `public/` - Static assets
- `.github/workflows/` - GitHub Actions configuration