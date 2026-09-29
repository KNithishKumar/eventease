import React from 'react';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading...' }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 select-none">
      {/* Up & Down Soundwave Bars */}
      <div className="flex items-center justify-center space-x-2 h-14">
        <span className="w-2 h-8 bg-primary-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0ms] shadow-pink-glow" />
        <span className="w-2 h-12 bg-indigo-600 rounded-full animate-[bounce_1s_ease-in-out_infinite_150ms]" />
        <span className="w-2 h-14 bg-primary-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_300ms] shadow-pink-glow" />
        <span className="w-2 h-12 bg-indigo-600 rounded-full animate-[bounce_1s_ease-in-out_infinite_450ms]" />
        <span className="w-2 h-8 bg-primary-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_600ms] shadow-pink-glow" />
      </div>

      {/* Loading Text */}
      {text && (
        <p className="text-base font-bold tracking-wider text-indigo-900 font-display uppercase">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md transition-all">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;