import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: React.ReactNode;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      id,
      label,
      helperText,
      error,
      leftAddon,
      rightAddon,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-ash mb-1"
          >
            {label}
            {props.required && <span className="text-accent ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative flex rounded-lg group">
          {leftAddon && (
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-hairline bg-overlay text-ash text-xs sm:text-sm select-none font-medium">
              {leftAddon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              block w-full rounded-lg border bg-canvas px-3 py-1.5 h-10 text-xs sm:text-sm text-ink placeholder:text-fog
              transition-all duration-150 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              disabled:bg-overlay/50 disabled:text-fog disabled:cursor-not-allowed
              ${leftAddon ? 'rounded-l-none' : ''} ${rightAddon ? 'rounded-r-none' : ''} ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger/30'
                : 'border-hairline hover:border-accent/40'
            } ${className}`}
            {...props}
          />

          {rightAddon && (
            <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-hairline bg-overlay text-ash text-xs sm:text-sm font-medium">
              {rightAddon}
            </span>
          )}
        </div>

        {error ? (
          <p className="mt-1 text-xs text-danger flex items-center gap-1 font-medium" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-fog">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: React.ReactNode;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, helperText, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-ash mb-1.5"
          >
            {label}
            {props.required && <span className="text-accent ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2 rounded-lg
            bg-canvas border border-hairline
            text-ink placeholder:text-fog
            focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
            transition-colors duration-150
            resize-y min-h-[80px]
            disabled:bg-overlay/50 disabled:text-fog disabled:cursor-not-allowed
            ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? `${textareaId}-helper` : error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-xs text-danger" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-xs text-fog">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface FieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, helperText, error, required, children }: FieldProps) {
  const fieldId = React.useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-xs font-medium text-ash mb-1.5 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-accent" aria-hidden="true">*</span>}
        </label>
      )}
      <div id={fieldId}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                id: child.props.id || fieldId,
                'aria-describedby': [
                  helperText ? `${fieldId}-helper` : '',
                  error ? `${fieldId}-error` : '',
                ]
                  .filter(Boolean)
                  .join(' ') || undefined,
                'aria-invalid': error ? 'true' : 'false',
              })
            : child
        )}
      </div>
      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${fieldId}-helper`} className="mt-1.5 text-xs text-fog">
          {helperText}
        </p>
      )}
    </div>
  );
}