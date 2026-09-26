import React from 'react';

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-black-800 p-4">
      <div className="flex items-center justify-between">
        <span className="text-l font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{title}</span>
        {Icon && <Icon size={20} className="text-neutral-400" />}
      </div>
      <div className="mt-2">
        <h3 className="text-4xl font-bold text-neutral-900 dark:text-white">{value}</h3>
      </div>
      {description && <p className="mt-1 text-l text-neutral-500 dark:text-neutral-400">{description}</p>}
    </div>
  );
};

export default StatCard;
