import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/draft-board">Draft Board</Button>
        <Button color="inherit" component={Link} to="/profiles">Profiles</Button>
        <Button color="inherit" component={Link} to="/stats">Stats</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
