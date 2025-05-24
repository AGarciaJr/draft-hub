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
    target: '.profiles-container',
    content: 'Here you can view and manage all player profiles in the system.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.search-profiles',
    content: 'Use the search bar to find specific players by name or other criteria.',
    placement: 'bottom',
    spotlightPadding: 5,
  },
];

export const playerProfileTooltips: Step[] = [
  {
    target: '.player-stats',
    content: 'View detailed statistics and performance metrics for this player.',
    placement: 'bottom',
    disableBeacon: true,
    spotlightPadding: 5,
  },
  {
    target: '.edit-profile',
    content: 'Click here to edit player information and update their profile.',
    placement: 'left',
    spotlightPadding: 5,
  },
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