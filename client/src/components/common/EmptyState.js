import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ 
  title = 'No items found', 
  message = 'There are no records to show at this moment.', 
  action, 
  icon: Icon = FiInbox 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-neutral-200 my-4">
      <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 flex items-center justify-center text-primary-600 mb-4">
        <Icon size={32} />
      </div>
      
      <h3 className="text-xl font-bold uppercase tracking-wider text-neutral-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-s text-neutral-500 font-[Segoe UI] max-w-md mb-6">
        {message}
      </p>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;