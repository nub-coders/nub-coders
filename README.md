# Full Stack Developer Portfolio

A modern, responsive portfolio website showcasing web applications, mobile apps, and API services built with React, TypeScript, and Express.js.

![Portfolio Preview](https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)

## 🚀 Live Demo

Visit the live portfolio: [https://portfolio.nub-coder.tech](https://portfolio.nub-coder.tech)

## ✨ Features

- **Responsive Design**: Optimized for all device sizes (mobile, tablet, desktop)
- **Interactive Terminal**: Python code demonstration with typing animation
- **Project Showcase**: 11+ projects across web apps, mobile apps, and APIs
- **GitHub Integration**: Real-time GitHub statistics and repository links
- **Contact Form**: Working contact form with validation
- **Dark/Light Theme**: Modern theme with smooth transitions
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance Optimized**: Fast loading with code splitting and optimization

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and state management
- **Wouter** - Lightweight routing solution

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Server-side type safety
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Production database

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Hot Module Replacement** - Instant development updates

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (for database features)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nub-coders/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit environment variables
   nano .env.local
   ```

4. **Database Setup** (Optional)
   ```bash
   # Set up PostgreSQL database
   npm run db:setup
   
   # Run migrations
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   
   Visit `http://localhost:8080` to view the portfolio

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🏗 Project Structure

```
portfolio/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Terminal.tsx       # Interactive terminal
│   │   │   ├── Projects.tsx       # Project showcase
│   │   │   ├── ContactForm.tsx    # Contact form
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and helpers
│   │   └── styles/         # Global styles
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── database/       # Database configuration
├── shared/                 # Shared types and schemas
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint code linting |
| `npm run db:push` | Run database migrations |
| `npm run db:studio` | Open database GUI |

## ♿ Accessibility Features

This portfolio is built with accessibility as a core principle:

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Color Contrast**: Meets WCAG AA contrast requirements (4.5:1)
- **Focus Management**: Clear focus indicators and logical tab order
- **Alt Text**: Descriptive alternative text for all images

### Inclusive Design
- **Responsive Typography**: Scalable text that respects user preferences
- **Reduced Motion**: Respects `prefers-reduced-motion` settings
- **High Contrast Mode**: Compatible with system high contrast themes
- **Touch Targets**: Minimum 44px touch target size for mobile
- **Error Prevention**: Clear form validation and error messages

### Assistive Technology Support
- **NVDA**: Tested with NVDA screen reader
- **JAWS**: Compatible with JAWS screen reader
- **VoiceOver**: Full VoiceOver support on macOS/iOS
- **Dragon**: Voice control software compatible

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database (Optional)
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio"

# API Keys (Optional)
GITHUB_TOKEN="your_github_token"
EMAIL_SERVICE_KEY="your_email_key"
```

### Customization

1. **Update Personal Information**
   - Edit `client/src/data/personal.ts`
   - Replace contact information and social links

2. **Add Your Projects**
   - Update `client/src/components/Projects.tsx`
   - Add your project details and links

3. **Modify Styling**
   - Edit `tailwind.config.js` for theme customization
   - Update CSS variables in `client/src/styles/globals.css`

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📱 Browser Support

- **Chrome** (last 2 versions)
- **Firefox** (last 2 versions)
- **Safari** (last 2 versions)
- **Edge** (last 2 versions)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Replit Deployment

This project is optimized for Replit deployment:

1. **Fork the repository** to your Replit account
2. **Install dependencies** automatically
3. **Configure environment** variables in Replit Secrets
4. **Deploy** using Replit's one-click deployment

### Other Platforms

- **Vercel**: `npm run build && vercel deploy`
- **Netlify**: Connect repository and deploy
- **Heroku**: Use included `Procfile` for deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nub Coder**
- Website: [nub-coder.tech](https://www.nub-coder.tech)
- GitHub: [@nub-coders](https://github.com/nub-coders)
- Telegram: [@nub_coder_s](https://t.me/nub_coder_s)
- YouTube: [@nub-coder](https://youtube.com/@nub-coder)
- Email: nubcoders@gmail.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Unsplash](https://unsplash.com/) - Beautiful stock photos

---

⭐ Star this repository if you found it helpful!