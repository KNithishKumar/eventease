import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title = 'No items found', message = 'There are no records to show at this moment.', action, icon: Icon = FiInbox }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm my-4">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
