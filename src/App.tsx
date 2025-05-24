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
      main: '#00538C', // Primary Blue
      dark: '#012B5E', // Dark Blue
      contrastText: '#B8C4CA', // Silver/Gray for text
    },
    secondary: {
      main: '#000000', // Black
      contrastText: '#B8C4CA', // Silver/Gray
    },
    background: {
      default: '#0C1E35', // Dark Blue
      paper: '#FFFFFF',
    },
    text: {
      primary: '#012B5E', // Dark Blue
      secondary: '#00538C', // Primary Blue
    },
  },
  typography: {
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TooltipProvider>
        <Box
          sx={{
            minHeight: '100vh',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'background.default'
          }}
        >
          <NavBar />
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
