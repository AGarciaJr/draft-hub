import { useEffect } from 'react';
import { useTooltip } from './tooltipContext';
import {
  homeTooltips,
  profilesTooltips,
  playerProfileTooltips,
  adminDashboardTooltips,
  draftBoardTooltips,
  statsTooltips,
  playerStatProfileTooltips,
} from './tooltipConfigs';

export const usePageTooltips = (
  pageName: 'home' | 'profiles' | 'playerProfile' | 'adminDashboard' | 'draftBoard' | 'stats' | 'playerStatProfile'
) => {
  const { startTour } = useTooltip();

  useEffect(() => {
    console.log('[usePageTooltips] Initializing tooltips for page:', pageName);
    
    const tooltips = {
      home: homeTooltips,
      profiles: profilesTooltips,
      playerProfile: playerProfileTooltips,
      adminDashboard: adminDashboardTooltips,
      draftBoard: draftBoardTooltips,
      stats: statsTooltips,
      playerStatProfile: playerStatProfileTooltips,
    }[pageName];

    console.log('[usePageTooltips] Starting tour with steps:', {
      pageName,
      stepsCount: tooltips.length,
      tourId: `tour-${pageName}`
    });

    startTour(tooltips, `tour-${pageName}`);
  }, [pageName, startTour]);
}; 