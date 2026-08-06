# Contributing to nub-coders Portfolio

Thanks for your interest in contributing! This portfolio is a full-stack TypeScript application showcasing projects and GitHub stats.

## Local Development

### Prerequisites

- Node.js 18+ and npm
- A GitHub personal access token with `repo` and `read:user` scopes

### Setup

```bash
# Clone the repository
git clone https://github.com/nub-coders/nub-coders.git
cd nub-coders

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

Edit `.env` and add your `GITHUB_TOKEN`. Create one at https://github.com/settings/tokens with these scopes:
- `repo` — access private repo metadata
- `read:user` — read user profile data

### Run Locally

```bash
npm run dev
```

Visit http://localhost:5173

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── client/          React + Vite frontend
│   ├── src/
│   └── public/
├── server/          Express API backend
│   ├── index.ts     API routes
│   ├── github.ts    GitHub stats fetching
│   └── contact.ts   Contact form handler
├── .env.example     Environment template
└── vite.config.ts   Build configuration
```

## Architecture

- **Client:** React 18, Vite, Tailwind CSS
- **Server:** Express API with in-memory caching (no database)
- **Deployment:** Both client and server deployed together

The server provides:
- `/api/github/*` — GitHub stats endpoints (streak, contributions, profile)
- `/api/contact` — Contact form submission

## Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm run dev`
4. Build with `npm run build` to verify production works
5. Open a PR describing what changed and why

## Code Style

- TypeScript strict mode
- Prettier for formatting (runs automatically)
- ESLint for linting
- Keep components small and focused
- Match existing patterns before introducing new ones
