import React, { useState } from 'react';
import Joyride, { STATUS, type Step, type CallBackProps } from 'react-joyride';
import { TooltipContext } from './tooltipContext';

interface TooltipProviderProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  const [isTooltipEnabled, setIsTooltipEnabled] = useState(() => {
    const saved = localStorage.getItem('tooltipsEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(false);
  const [currentTourId, setCurrentTourId] = useState<string>('');

  const toggleTooltips = () => {
    const newValue = !isTooltipEnabled;
    setIsTooltipEnabled(newValue);
    localStorage.setItem('tooltipsEnabled', JSON.stringify(newValue));
    if (newValue) localStorage.removeItem('completedTours');
  };

  const startTour = (newSteps: Step[], tourId: string) => {
    if (isTooltipEnabled) {
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
      if (completedTours.includes(tourId)) return;
      setSteps(newSteps);
      setCurrentTourId(tourId);
      setTimeout(() => setRun(true), 500);
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
      if (!completedTours.includes(currentTourId)) {
        completedTours.push(currentTourId);
        localStorage.setItem('completedTours', JSON.stringify(completedTours));
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
        styles={{ options: { zIndex: 10000, primaryColor: '#0070f3' } }}
        floaterProps={{ disableAnimation: true }}
      />
    </TooltipContext.Provider>
  );
};
