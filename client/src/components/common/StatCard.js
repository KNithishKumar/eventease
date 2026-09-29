import React from 'react';

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white border border-neutral-200 p-5">
      <div className="flex items-center justify-between">
        <span className="text-l font-bold uppercase tracking-wider text-neutral-500">
          {title}
        </span>
        {Icon && <Icon size={24} className="text-primary-600" />}
      </div>
      <div className="mt-2">
        <h3 className="text-4xl font-bold text-neutral-900 font-display">
          {value}
        </h3>
      </div>
      {description && (
        <p className="mt-1 text-s text-neutral-500 font-[Segoe UI]">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;