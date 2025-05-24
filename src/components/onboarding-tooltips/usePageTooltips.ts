import { useEffect } from 'react';
import { useTooltip } from './TooltipProvider';
import {
  homeTooltips,
  profilesTooltips,
  playerProfileTooltips,
  adminDashboardTooltips,
} from './tooltipConfigs';

export const usePageTooltips = (pageName: 'home' | 'profiles' | 'playerProfile' | 'adminDashboard') => {
  const { startTour } = useTooltip();

  useEffect(() => {
    console.log('[usePageTooltips] Initializing tooltips for page:', pageName);
    
    const tooltips = {
      home: homeTooltips,
      profiles: profilesTooltips,
      playerProfile: playerProfileTooltips,
      adminDashboard: adminDashboardTooltips,
    }[pageName];

    console.log('[usePageTooltips] Starting tour with steps:', {
      pageName,
      stepsCount: tooltips.length,
      tourId: `tour-${pageName}`
    });

    startTour(tooltips, `tour-${pageName}`);
  }, [pageName, startTour]);
}; 