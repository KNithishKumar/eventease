import React from 'react';

const Badge = ({ variant = 'info', children, className = '' }) => {
  const variants = {
    success: 'bg-white text-black-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-white text-rose-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-white text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    info: 'bg-white text-black-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    purple: 'bg-white text-black-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    neutral: 'bg-white text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xl font-semibold border ${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
