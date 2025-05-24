import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTooltip } from '../onboarding-tooltips/tooltipContext';

const NavBar: React.FC = () => {
  const { isTooltipEnabled, toggleTooltips } = useTooltip();

  return (
    <AppBar position="static" color="primary">
      <Toolbar className="nav-menu">
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/draft-board">Draft Board</Button>
        <Button color="inherit" component={Link} to="/profiles">Profiles</Button>
        <Button color="inherit" component={Link} to="/stats">Stats</Button>
        <div style={{ marginLeft: 'auto' }}>
          <Button color="inherit" component={Link} to="/admin">Admin</Button>
          <Tooltip title={isTooltipEnabled ? "Disable Tutorials" : "Enable Tutorials"}>
            <IconButton color="inherit" onClick={toggleTooltips}>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
