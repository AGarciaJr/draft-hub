import type { Step } from 'react-joyride';

export const homeTooltips: Step[] = [
  {
    target: 'body',
    content: 'Welcome to Draft Hub! This is your central place for managing player drafts and profiles.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.nav-menu',
    content: 'Use the navigation menu to access different sections of the application.',
    placement: 'bottom',
    spotlightClicks: true,
    disableBeacon: true,
    spotlightPadding: 5,
  },
];

export const draftBoardTooltips: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the Draft Board! Here you can view and analyze player rankings from various scouts.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.draft-board-controls',
    content: 'Use these controls to filter and sort players by different criteria like position, school, and scout rankings.',
    placement: 'bottom',
    spotlightClicks: true,
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.player-card',
    content: 'Click on any player card to expand and see detailed information about their rankings and statistics.',
    placement: 'bottom',
    spotlightClicks: true,
    disableBeacon: true,
    spotlightPadding: 5,
  },
];

export const statsTooltips: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the Stats page! Here you can view statistical leaders across different categories.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.stat-card',
    content: 'Each card shows the top performers in a specific statistical category. Hover over players to see more details.',
    placement: 'bottom',
    spotlightClicks: true,
    disableBeacon: true,
    spotlightPadding: 5,
  },
];

export const profilesTooltips: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the Player Profiles page! Here you can browse and view detailed information about all players.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.MuiCard-root',
    content: 'Click on any player\'s image to view their detailed profile, including statistics and scouting reports.',
    placement: 'bottom',
    spotlightClicks: true,
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.MuiCardMedia-root',
    content: 'Each player card shows their photo, name, team, and basic information.',
    placement: 'bottom',
    spotlightClicks: true,
    disableBeacon: true,
    spotlightPadding: 5,
  }
];

export const playerProfileTooltips: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the Player Profile page! Here you can view detailed information about this player.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.MuiBox-root:first-of-type',
    content: 'View the player\'s basic information, including their position, team, and physical attributes.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.MuiBox-root:nth-of-type(2)',
    content: 'Check out the player\'s current season statistics and performance metrics.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.MuiTypography-h5',
    content: 'Read and add scouting reports to track player development and performance.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  }
];

export const playerStatProfileTooltips: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the Player Statistics page! Here you can view detailed game and season statistics.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.MuiToggleButtonGroup-root',
    content: 'Switch between Game Logs and Season Logs to view different types of statistics.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.MuiTable-root',
    content: 'View detailed statistics for each game or season, including points, rebounds, assists, and more.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  }
];

export const adminDashboardTooltips: Step[] = [
  {
    target: '.admin-controls',
    content: 'Welcome to the Admin Dashboard. Here you can manage all aspects of the system.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.user-management',
    content: 'Manage user accounts and permissions here.',
    placement: 'right',
    spotlightPadding: 5,
  },
  {
    target: '.system-settings',
    content: 'Configure system-wide settings and preferences.',
    placement: 'left',
    spotlightPadding: 5,
  },
]; 