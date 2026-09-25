import React from 'react';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading EventEase...' }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-primary-900 rounded-full animate-ping"></div>
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      {text && <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
