import { createContext, useContext } from 'react';
import type { Step } from 'react-joyride';

export interface TooltipContextType {
  isTooltipEnabled: boolean;
  toggleTooltips: () => void;
  startTour: (steps: Step[], tourId: string) => void;
}

export const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const useTooltip = (): TooltipContextType => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};
