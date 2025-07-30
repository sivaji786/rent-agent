import { useState, useEffect } from 'react';

export function useTour() {
  const [showTour, setShowTour] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if user has completed the tour
    const tourCompleted = localStorage.getItem('prolits-tour-completed');
    const tourSkipped = localStorage.getItem('prolits-tour-skipped');
    
    if (!tourCompleted && !tourSkipped) {
      // This is a first visit, show tour after a short delay
      setIsFirstVisit(true);
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500); // 1.5 second delay to let the page load
      
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = (fromStep: number = 0) => {
    setShowTour(true);
  };

  const closeTour = () => {
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem('prolits-tour-completed');
    localStorage.removeItem('prolits-tour-skipped');
    localStorage.removeItem('prolits-tour-completed-date');
    setIsFirstVisit(true);
    setShowTour(true);
  };

  return {
    showTour,
    isFirstVisit,
    startTour,
    closeTour,
    resetTour
  };
}