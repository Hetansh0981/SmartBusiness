import React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  atmosphere?: boolean;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
  atmosphere = false,
}: EmptyStateProps) {
  return (
    <div
      className={`
        relative text-center py-12 px-4 rounded-xl border border-dashed border-hairline
        bg-canvas ${atmosphere ? 'atmosphere' : 'bg-raised'} ${className}
      `}
    >
      {icon ? (
        <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3 border border-accent/20">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-fog/15 text-fog flex items-center justify-center mx-auto mb-3 border border-hairline">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}

      <h3 className="text-sm sm:text-base font-semibold text-ink tracking-tight">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-ash max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}