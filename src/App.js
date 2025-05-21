import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Box, { sx: { my: 4 }, children: [_jsx(Typography, { variant: "h2", component: "h1", gutterBottom: true, align: "center", color: "primary.main", children: "NextGen" }), _jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, align: "center", color: "secondary.main", children: "The Next Generation of Basketball Superstars" }), _jsx(PlayerCarousel, {})] }));
}
function App() {
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(AppBar, { position: "static", color: "primary", children: _jsxs(Toolbar, { children: [_jsx(Button, { color: "inherit", component: Link, to: "/", children: "Home" }), _jsx(Button, { color: "inherit", component: Link, to: "/draft-board", children: "Draft Board" }), _jsx(Button, { color: "inherit", component: Link, to: "/profiles", children: "Profiles" })] }) }), _jsx(Container, { maxWidth: "xl", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/draft-board", element: _jsx(BigBoard, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/profiles", element: _jsx(ProfilesPage, {}) }), _jsx(Route, { path: "/profiles/:playerId", element: _jsx(PlayerProfile, {}) })] }) })] }));
}
export default App;
