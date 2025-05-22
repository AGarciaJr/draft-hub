import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import { Routes, Route, Link } from 'react-router-dom';
import PlayerCarousel from './components/PlayerCarousel';
import BigBoard from './features/draft-board/BigBoard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilesPage from './pages/ProfilesPage';
import PlayerProfile from './pages/PlayerProfile';
import SummaryPanel from './components/SummaryPanel';
import NavBar from './components/NavBar';
import Hero from './components/Hero';

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

function Home() {
  return (
    <Box sx={{ my: 4 }}>
      <Hero />
      <SummaryPanel />
      <PlayerCarousel />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/draft-board" element={<BigBoard />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/profiles/:playerId" element={<PlayerProfile />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
