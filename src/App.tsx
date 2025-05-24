import { ThemeProvider, createTheme, CssBaseline, Box, } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import BigBoard from './features/draft-board/BigBoard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilesPage from './pages/ProfilesPage';
import PlayerProfile from './pages/PlayerProfile';
import PlayerStatProfile from './pages/PlayerStatProfile';
import NavBar from './components/layout/NavBar';
import Stats from './features/stat-board/Stats';
import Home from './pages/Home';
import { TooltipProvider } from './components/onboarding-tooltips/TooltipProvider';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00538C', // Primary Blue - Main brand color
      dark: '#012B5E', // Dark Blue - Used for hover states and emphasis
      contrastText: '#B8C4CA', // Silver/Gray - Text color on primary backgrounds
    },
    secondary: {
      main: '#000000', // Black - Secondary actions and accents
      contrastText: '#B8C4CA', // Silver/Gray - Text color on secondary backgrounds
    },
    background: {
      default: '#0C1E35', // Dark Blue - Main background color
      paper: '#FFFFFF', // White - Background for cards and elevated surfaces
    },
    text: {
      primary: '#012B5E', // Dark Blue - Main text color
      secondary: '#00538C', // Primary Blue - Secondary text color
    },
  },
  typography: {
    // Use Inter as the primary font with system fonts as fallback
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    h5: {
      fontWeight: 500,
      color: '#00538C',
    },
  },
});

/**
 * Main App Component
 * 
 * This is the root component of the application that:
 * 1. Provides the Material UI theme to all child components
 * 2. Sets up the routing structure
 * 3. Implements the basic layout with navigation
 * 4. Wraps the application in necessary providers
 */
function App() {
  return (
    // ThemeProvider makes the theme available throughout the app
    <ThemeProvider theme={theme}>
      {/* CssBaseline provides consistent baseline styles */}
      <CssBaseline />
      {/* TooltipProvider enables interactive tutorials throughout the app */}
      <TooltipProvider>
        {/* Main container with full viewport height and dark background */}
        <Box
          sx={{
            minHeight: '100vh',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'background.default'
          }}
        >
          {/* Navigation bar present on all pages */}
          <NavBar />
          {/* Route definitions for the application */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/draft-board" element={<BigBoard />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/profiles/:playerId" element={<PlayerProfile />} />
            <Route path="/stat-profiles/:playerId" element={<PlayerStatProfile />} />
          </Routes>
        </Box>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
