# Portfolio Website - Professional Full Stack Developer

A modern, responsive portfolio website built with React, TypeScript, and Express.js, showcasing professional projects and technical expertise.

![Portfolio Banner](https://img.shields.io/badge/Portfolio-Full%20Stack%20Developer-blueviolet?style=for-the-badge)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## ✨ Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for all devices (mobile, tablet, desktop)
- **Interactive Components**: Dynamic project filtering, terminal animation, contact forms
- **Real-time Updates**: Hot module replacement for development
- **SEO Optimized**: Meta tags and semantic HTML structure
- **Fast Performance**: Optimized builds with Vite and modern web technologies
- **Type Safe**: Full TypeScript implementation
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🚀 Live Demo

Visit the live portfolio: **[https://portfolio.nub-coder.tech](https://portfolio.nub-coder.tech)**

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Fast, minimalist web framework
- **Node.js 20+** - JavaScript runtime
- **TypeScript** - Server-side type safety
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Reliable relational database
- **Session Management** - Express sessions with Redis/Memory store

### Development Tools
- **Vite** - Lightning-fast build tool
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing and optimization
- **Hot Module Replacement** - Instant development updates

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/nub-coders/portfolio-website.git
cd portfolio-website/portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api

## 🔧 Installation & Setup

### Environment Setup

1. **Create Environment File** (optional)
   ```bash
   cp .env.example .env
   ```

2. **Configure Environment Variables** (if needed)
   ```env
   NODE_ENV=development
   PORT=8080
   DATABASE_URL=your_database_url_here
   ```

### Database Setup (Optional)

If using database features:

```bash
# Push database schema
npm run db:push
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
portfolio/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Navbar.tsx  # Navigation component
│   │   │   ├── Projects.tsx # Project showcase
│   │   │   ├── Skills.tsx   # Skills display
│   │   │   ├── ContactForm.tsx # Contact form
│   │   │   └── Terminal.tsx # Interactive terminal
│   │   ├── pages/          # Page components
│   │   │   └── Home.tsx    # Main landing page
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── main.tsx       # Application entry point
│   ├── index.html         # HTML template
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── vite.ts           # Vite development integration
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
├── dist/                # Production build output
├── package.json         # Project dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## 🖥️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build production version |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Apply database schema changes |

## 🎨 Customization

### Updating Content

1. **Personal Information**: Edit `client/src/pages/Home.tsx`
2. **Projects**: Update the projects array in `client/src/components/Projects.tsx`
3. **Skills**: Modify skills data in `client/src/components/Skills.tsx`
4. **Contact Info**: Update contact details in components and footer

### Styling

- **Colors**: Modify CSS variables in `client/src/index.css`
- **Components**: Update Tailwind classes in component files
- **Animations**: Customize Framer Motion animations in components

### Adding New Sections

1. Create new component in `client/src/components/`
2. Import and use in `client/src/pages/Home.tsx`
3. Add navigation links in `client/src/components/Navbar.tsx`

## 🌐 Making It Accessible

### SEO Optimization

1. **Meta Tags**: Update in `client/index.html`
   ```html
   <title>NUB CODER - Full Stack Developer</title>
   <meta name="description" content="Professional portfolio of NUB CODER - Full Stack Developer specializing in React, Node.js, and modern web technologies">
   <meta name="keywords" content="developer, portfolio, react, typescript, nodejs, fullstack">
   ```

2. **Open Graph Tags**: Add social media preview tags
   ```html
   <meta property="og:title" content="NUB CODER - Developer Portfolio">
   <meta property="og:description" content="Professional full-stack developer with 5+ years experience">
   <meta property="og:image" content="/og-image.jpg">
   <meta property="og:url" content="https://portfolio.nub-coder.tech">
   ```

### Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Indicators**: Visible focus states for all interactive elements

### Performance Optimization

- **Lazy Loading**: Images load on scroll
- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Minified CSS and JavaScript
- **Caching**: Production builds include cache headers

## 🚀 Deployment Options

### 1. Replit (Recommended)

Already configured for Replit deployment:
- Automatic builds and deployments
- Built-in database support
- Environment variable management

### 2. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Netlify

```bash
# Build command
npm run build

# Publish directory
dist/public
```

### 4. Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

### 5. Traditional VPS/Server

```bash
# On your server
git clone your-repo
cd portfolio-website/portfolio
npm install
npm run build
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "portfolio" -- start
```

## 🔧 Configuration

### Port Configuration

Default port is 8080. To change:

1. Update `server/index.ts`:
   ```typescript
   const port = process.env.PORT || 8080;
   ```

2. Update any environment configurations

### Database Configuration

If using PostgreSQL:

```typescript
// server/storage.ts
const connection = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'portfolio',
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'password',
};
```

## 🎯 Project Showcase

The portfolio features 11 professional projects across different categories:

### Web Applications (5)
- **E-commerce Platform** - Full-featured online store with payment integration
- **Real Estate Platform** - Property listings with virtual tours
- **Docker PaaS Platform** - Telegram Mini App for container management

### Mobile Applications (3)
- **Fitness Tracker App** - Workout tracking with personalized plans
- **Travel Companion App** - Itinerary planning with offline maps
- **MAGISK Flasher V2** - Android rooting and management tool

### API Services (5)
- **Banking API Service** - Secure RESTful API with JWT authentication
- **Weather Data API** - Comprehensive weather data with forecasting
- **YT-DLP API Service** - YouTube video extraction with Telegram bot
- **Music Bot** - Python-based Telegram music bot
- **Kixer Password Tool** - Security tool for password generation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process using port 8080
npx kill-port 8080
# Or change port in server/index.ts
```

**Build fails:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Run type checking
npm run check
```

**Development server issues:**
```bash
# Restart development server
npm run dev
```

## 📞 Support & Contact

For support and questions:

- **Email**: [nubcoders@gmail.com](mailto:nubcoders@gmail.com)
- **GitHub**: [https://github.com/nub-coders](https://github.com/nub-coders)
- **Telegram**: [https://t.me/nub_coder_s](https://t.me/nub_coder_s)
- **YouTube**: [https://youtube.com/@nub-coder](https://youtube.com/@nub-coder)
- **Portfolio**: [https://portfolio.nub-coder.tech](https://portfolio.nub-coder.tech)

## 🌟 Acknowledgments

- Design inspiration from modern portfolio trends
- Icons from [Lucide React](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Components from [Radix UI](https://www.radix-ui.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Built with love using modern web technologies

---

<div align="center">
  <p>⭐ Star this repository if you found it helpful!</p>
  <p>Made with ❤️ by <a href="https://github.com/nub-coders">NUB CODER</a></p>
  
  [![GitHub](https://img.shields.io/badge/GitHub-nub--coders-blue?logo=github&style=flat-square)](https://github.com/nub-coders/)
  [![YouTube](https://img.shields.io/badge/YouTube-nub--coder-red?logo=youtube&style=flat-square)](https://youtube.com/@nub-coder)
  [![Telegram](https://img.shields.io/badge/Telegram-nub__coder__s-blue?logo=telegram&style=flat-square)](https://t.me/nub_coder_s)
  [![Email](https://img.shields.io/badge/Email-nubcoders%40gmail.com-orange?logo=gmail&style=flat-square)](mailto:nubcoders@gmail.com)
</div>