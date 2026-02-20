import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title, description, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Inbox className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
