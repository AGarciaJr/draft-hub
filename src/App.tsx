import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import { Routes, Route, Link } from 'react-router-dom';
import PlayerCarousel from './components/PlayerCarousel';
import BigBoard from './features/draft-board/BigBoard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilesPage from './pages/ProfilesPage';
import PlayerProfile from './pages/PlayerProfile';

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
      default: '#F4F6F8', // Light background for modern look
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
      <Typography variant="h2" component="h1" gutterBottom align="center" color="primary.main">
        NextGen
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center" color="secondary.main">
        The Next Generation of Basketball Superstars
      </Typography>
      <PlayerCarousel />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/draft-board">Draft Board</Button>
          <Button color="inherit" component={Link} to="/profiles">Profiles</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/draft-board" element={<BigBoard />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/profiles/:playerId" element={<PlayerProfile />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
