import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps } from 'react-joyride';

interface TooltipContextType {
  isTooltipEnabled: boolean;
  toggleTooltips: () => void;
  startTour: (steps: any[], tourId: string) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

interface TooltipProviderProps {
  children: ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  const [isTooltipEnabled, setIsTooltipEnabled] = useState(() => {
    const saved = localStorage.getItem('tooltipsEnabled');
    const enabled = saved ? JSON.parse(saved) : true;
    console.log('[TooltipProvider] Initial tooltip state:', enabled);
    return enabled;
  });
  const [steps, setSteps] = useState<any[]>([]);
  const [run, setRun] = useState(false);
  const [currentTourId, setCurrentTourId] = useState<string>('');

  const toggleTooltips = () => {
    const newValue = !isTooltipEnabled;
    console.log('[TooltipProvider] Toggling tooltips:', newValue);
    setIsTooltipEnabled(newValue);
    localStorage.setItem('tooltipsEnabled', JSON.stringify(newValue));
    
    // If enabling tooltips, clear completed tours
    if (newValue) {
      console.log('[TooltipProvider] Clearing completed tours');
      localStorage.removeItem('completedTours');
    }
  };

  const startTour = (newSteps: any[], tourId: string) => {
    console.log('[TooltipProvider] Attempting to start tour:', {
      tourId,
      isTooltipEnabled,
      stepsCount: newSteps.length
    });

    if (isTooltipEnabled) {
      // Check if this tour has been completed
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
      console.log('[TooltipProvider] Completed tours:', completedTours);
      
      if (completedTours.includes(tourId)) {
        console.log('[TooltipProvider] Tour already completed:', tourId);
        return;
      }

      console.log('[TooltipProvider] Starting new tour:', tourId);
      setSteps(newSteps);
      setCurrentTourId(tourId);
      // Add a small delay to ensure elements are mounted
      setTimeout(() => {
        console.log('[TooltipProvider] Setting run to true for tour:', tourId);
        setRun(true);
      }, 500);
    } else {
      console.log('[TooltipProvider] Tooltips are disabled, not starting tour');
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    console.log('[TooltipProvider] Joyride callback:', { status, type, currentTourId });

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('[TooltipProvider] Tour ended:', { status, currentTourId });
      setRun(false);
      // Save the completed tour ID
      if (currentTourId) {
        const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
        if (!completedTours.includes(currentTourId)) {
          completedTours.push(currentTourId);
          localStorage.setItem('completedTours', JSON.stringify(completedTours));
          console.log('[TooltipProvider] Saved completed tour:', currentTourId);
        }
      }
    }
  };

  return (
    <TooltipContext.Provider value={{ isTooltipEnabled, toggleTooltips, startTour }}>
      {children}
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#0070f3',
          },
        }}
        floaterProps={{
          disableAnimation: true,
        }}
      />
    </TooltipContext.Provider>
  );
}; 