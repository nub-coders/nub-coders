# Portfolio Website Project

A modern, responsive full-stack portfolio website built with React, TypeScript, and Express. This project showcases professional skills, projects, and provides an interactive experience with animated terminal and project filtering.

![Portfolio Website](https://img.shields.io/badge/Portfolio-Website-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blueviolet?style=for-the-badge)

## 🚀 Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Terminal**: Python code terminal with typing animation
- **Project Showcase**: Filterable project gallery with categories (Web Apps, Mobile Apps, API Services)
- **Responsive Design**: Optimized for all device sizes
- **Real-time Updates**: Hot module replacement for development
- **Fast Loading**: Vite build system for optimal performance
- **TypeScript**: Full type safety across frontend and backend
- **Component Library**: Radix UI components with custom styling

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Query** - Data fetching and state management
- **Wouter** - Lightweight routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend code

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Database (ready for integration)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/nub-coders/nub-coders/
cd nub-coders
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
The project is configured to run without additional environment variables for basic functionality.

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:8080**

## 📁 Project Structure

```
portfolio/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Radix UI components
│   │   │   ├── ContactForm.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Terminal.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   └── index.html        # HTML template
├── server/               # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage utilities
│   └── vite.ts          # Vite integration
├── shared/              # Shared TypeScript types
│   └── schema.ts        # Data schemas
├── package.json         # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🚦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## 🎯 Key Components

### Terminal Component
Interactive Python code terminal with typing animation:
- Simulates real Python REPL experience
- Animated typing effect
- Syntax highlighting
- Professional coding demonstration

### Projects Component  
Dynamic project showcase with filtering:
- **11 Real Projects** from GitHub repositories
- **3 Categories**: Web Apps, Mobile Apps, API Services
- Live demo links and GitHub repository links
- Responsive grid layout with hover effects

### Skills Component
Technical skills display with:
- Frontend technologies (React, TypeScript, etc.)
- Backend technologies (Node.js, Python, etc.)
- Database technologies (PostgreSQL, MongoDB)
- DevOps tools and methodologies

## 🌐 Deployment

### Development
```bash
npm run dev
```
Runs on port 8080 with hot module replacement.

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment

#### Update and Build
```bash
git reset --hard && git stash && git pull && rm -f package-lock.json && npm install && npm run dev
```

#### Build Docker Image
```bash
docker build -t portfolio .
```

#### Run Docker Container
```bash
docker run -d \
  --name portfolio \
  --network web \
  -e VIRTUAL_HOST=dev.nubcoder.com \
  -e LETSENCRYPT_HOST=dev.nubcoder.com \
  portfolio
```

This setup assumes you have an nginx-proxy with Let's Encrypt companion running on the `web` network for automatic SSL certificate generation and reverse proxy handling.

### Docker Compose

You can also use Docker Compose (recommended):

1. Build and start
```bash
docker compose up -d --build
```

2. Stop
```bash
docker compose down
```

Notes:
- The service joins the external `web` network used by `nginx-proxy`.
- The compose file is pre-configured with `VIRTUAL_HOST` and `LETSENCRYPT_HOST` set to `dev.nubcoder.com`.

### Replit Deployment
This project is optimized for Replit deployment:
- Configured workflows for automatic server management  
- Port 8080 configuration for Replit environment
- No additional setup required

## 🔍 Configuration

### Port Configuration
The server runs on port **8080** as configured in `server/index.ts`. This is optimized for Replit deployment.

### Vite Configuration
Hot module replacement and build optimizations are configured in `vite.config.ts` with:
- React plugin for JSX support
- TypeScript support
- Asset optimization
- Development server proxy

### Tailwind Configuration
Custom styling and theme configuration in `tailwind.config.ts` with:
- Custom color palette
- Responsive breakpoints
- Animation utilities
- Component-specific styles

## 🎨 Customization

### Adding New Projects
Edit `client/src/components/Projects.tsx`:
```typescript
{
  title: "Your Project Name",
  description: "Short description of your project",
  category: "web" | "mobile" | "api",
  image: "https://your-image-url.com",
  tags: ["Technology", "Stack"],
  demoLink: "https://your-demo.com",
  codeLink: "https://github.com/nub-coders/",
  badgeText: "Web App",
  badgeClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
}
```

### Updating Skills
Modify `client/src/components/Skills.tsx` to add or update technical skills.

### Changing Theme
Update colors and styling in:
- `tailwind.config.ts` - Theme configuration
- `client/src/index.css` - Global styles
- `theme.json` - Component theme settings

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Ensure port 8080 is available
- Check Node.js version (18+)
- Verify all dependencies are installed

**Hot reload not working:**
- Restart the development server
- Clear browser cache
- Check console for build errors

**TypeScript errors:**
- Run `npm run check` to identify issues
- Update type definitions if needed
- Ensure all imports have proper extensions

**Docker Issues:**

*Build fails:*
- Ensure Docker is installed and running
- Check available disk space
- Verify Dockerfile syntax

*Container won't start:*
- Check container logs: `docker logs portfolio`
- Verify port 8080 is not in use: `docker ps`
- Restart Docker service if needed

*Permission errors:*
- The Dockerfile creates a non-root user for security
- Check file permissions on host system
- Use `docker exec -it portfolio sh` to debug

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Portfolio Website](https://nubcoder.com)
- **GitHub**: [github.com/nub-coders](https://github.com/nub-coders/- **YouTube**: [youtube.com/@nub-coder](https://youtube.com/@nub-coder)
- **Telegram**: [t.me/nub_coder_s](https://t.me/nub_coder_s)

## 📞 Support

If you have any questions or need assistance:

- **Email**: [dev@nubcoder.com](mailto:dev@nubcoder.com)
- **GitHub Issues**: [Create an issue](https://github.com/nub-coders/portfolio-website/issues)
- **Telegram**: [t.me/nub_coder_s](https://t.me/nub_coder_s)

---

<div align="center">
  
**⭐ Give this project a star if you found it helpful!**

Made with ❤️ by [nub-coders](https://github.com/nub-coders/</div>