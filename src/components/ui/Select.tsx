import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: React.ReactNode;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = '',
      id,
      label,
      helperText,
      error,
      options,
      placeholder,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-ash mb-1.5"
          >
            {label}
            {props.required && <span className="text-accent ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`
              block w-full appearance-none rounded-lg border bg-canvas px-3 py-2 h-10 pr-9 text-xs sm:text-sm text-ink
              transition-all duration-150 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              disabled:bg-overlay/50 disabled:text-fog disabled:cursor-not-allowed
              ${error
                ? 'border-danger focus:border-danger focus:ring-danger/30'
                : 'border-hairline hover:border-accent/40'
              } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-fog">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-ink bg-canvas">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-fog">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error ? (
          <p id={`${selectId}-error`} className="mt-1.5 text-xs text-danger" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-fog">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';