# NextGen: NBA Draft Hub

NextGen is a modern, data-driven NBA Draft Hub designed for front office decision makers. This application helps teams evaluate and select the next generation of basketball superstars, providing a comprehensive big board, player profiles, and scouting tools—all in a sleek, responsive interface.

## 🚀 Features

### Core Features
- **Interactive Landing Page:** Features a dynamic 3D carousel showcasing top prospects with smooth animations
- **Comprehensive Big Board:** 
  - Data-driven player rankings based on multiple scout evaluations
  - Visual indicators for high/low rankings
  - Sortable and filterable player list
- **Detailed Player Profiles:**
  - Complete player information and statistics
  - Interactive scouting report system
  - Historical performance data visualization
- **Statistical Analysis:**
  - Advanced stats dashboard
  - Comparative analysis tools
  - Performance trends visualization

### Technical Features
- **Responsive Design:** Optimized for all devices (desktop, tablet, mobile)
- **Modern UI/UX:** Built with Material UI for a professional, accessible interface
- **Data-Driven Architecture:** Flexible data structure for easy updates
- **Interactive Tutorials:** Built-in onboarding with react-joyride
- **Performance Optimized:** Built with Vite for fast development and production builds

## 🛠 Tech Stack

### Frontend
- **React 18** - Core UI library
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **Material UI** - Component library and theming
- **React Router** - Client-side routing
- **React Slick** - 3D Carousel implementation
- **Recharts** - Data visualization
- **React Joyride** - Interactive tutorials

### Development Tools
- ESLint - Code linting
- TypeScript - Static type checking
- Vite - Development server and build tool

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific components and logic
├── pages/         # Page components and routing
├── services/      # API and data services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── data/          # Static data and mock data
```

## 🚀 Getting Started

1. **Prerequisites**
   - Node.js (v18 or higher)
   - npm (v9 or higher)

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd draft-hub

   # Install dependencies
   npm install
   ```

3. **Development**
   ```bash
   # Start development server
   npm run dev
   ```
   The application will be available at [http://localhost:5173](http://localhost:5173)

4. **Building for Production**
   ```bash
   # Create production build
   npm run build
   ```

## 📊 Data Management

The application uses a data-driven approach with the following key data files:
- `src/data/intern_project_data.json` - Main data source for player and scout information
- Player data can be easily updated by replacing or modifying this file

## 🎨 Customization

### Theme Customization
The application uses Material UI's theming system. The main theme configuration can be found in `src/App.tsx`. You can customize:
- Color palette
- Typography
- Component styles
- Layout settings

### Adding New Features
1. Create new components in the appropriate directory
2. Add new routes in `src/App.tsx`
3. Update types in `src/types` if needed
4. Add any new data to the data files