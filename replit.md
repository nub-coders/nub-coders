# Portfolio Website Project

## Overview
This is a full-stack portfolio website for a Full Stack Developer (Nub Coder) built with React, TypeScript, and Express. The project showcases professional skills, projects, and provides an interactive terminal animation.

## Current State
- ✅ Project successfully set up and running
- ✅ Development server running on port 5000
- ✅ React frontend with TypeScript
- ✅ Express backend API
- ✅ Vite hot module replacement working
- ✅ Fixed JSX warning in Terminal component

## Architecture
### Frontend (client/)
- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI components for enhanced UI
- Framer Motion for animations
- React Query for state management
- Wouter for routing

### Backend (server/)
- Express.js server
- Development/production mode support
- API endpoints for portfolio data
- Static file serving in production

### Key Components
- **Terminal.tsx**: Interactive Python code terminal with typing animation
- **Navbar.tsx**: Navigation component
- **Projects.tsx**: Project showcase
- **Skills.tsx**: Skills display
- **ContactForm.tsx**: Contact form
- **GitHubStats.tsx**: GitHub statistics
- **Testimonials.tsx**: Client testimonials

## Recent Changes (September 12, 2025)
- Changed server port configuration to 8080 as requested
- Installed all npm dependencies
- Set up Portfolio Server workflow
- Fixed JSX attribute warning in Terminal component (jsx={true} → jsx="true")
- Verified hot module replacement is working correctly

## Technologies Used
### Frontend
- React, Next.js, TypeScript
- Tailwind CSS, HTML5
- Radix UI components
- Framer Motion animations
- React Hook Form

### Backend
- Node.js, Express.js
- PostgreSQL database support (Drizzle ORM)
- Session management (Express-session)
- Authentication ready (Passport.js)

### DevOps & Tools
- Vite for development
- ESBuild for production builds
- TypeScript compilation
- Hot module replacement

## User Preferences
- Clean, modern design aesthetic
- Performance-focused development
- Professional portfolio presentation
- Interactive elements (terminal animation)
- Responsive design for all devices

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
├── shared/                # Shared types/schemas
└── package.json          # Dependencies and scripts
```

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript checking
- `npm run db:push` - Database migrations