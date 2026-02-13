import React from 'react';

import CheckCircle from '@/assets/icons/check-circle.svg';

const STATUS_STYLES = {
  completed: {
    dot: 'bg-green-600 text-green-600 border-green-200',
    connector: 'border-green-200',
    card: 'border-green-50',
  },
  pending: {
    dot: 'bg-gray-300 text-gray-400 border-gray-200',
    connector: 'border-gray-200',
    card: 'border-gray-100',
  },
};

const ActivityTimeline = ({ items = [], className = '' }) => {
  if (!items.length) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const status = STATUS_STYLES[item.status] ? item.status : 'pending';
        const styles = STATUS_STYLES[status];
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id ?? `${item.title}-${index}`}
            className={`rounded-2xl border ${styles.card} bg-white px-4 py-3 shadow-sm`}
          >
            <div className="flex items-stretch gap-3">
              <div className="relative flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border ${styles.dot}`}
                >
                  <img
                    src={CheckCircle}
                    alt="Status Icon"
                    className="h-4 w-4"
                  />
                </div>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-8 left-1/2 w-px -translate-x-1/2 border-l border-dashed ${styles.connector}`}
                    style={{ height: 'calc(100% + 1rem)' }}
                  ></span>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
