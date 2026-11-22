'use client';

import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  id,
  className = '',
}: SwitchProps) {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
          disabled:cursor-not-allowed disabled:opacity-50
          ${checked ? 'bg-accent' : 'bg-fog/40'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-ink shadow-xs
            ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5
            ${checked ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </button>

      {label && (
        <label
          htmlFor={switchId}
          onClick={() => !disabled && onChange(!checked)}
          className="text-xs font-medium text-ash select-none cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
}