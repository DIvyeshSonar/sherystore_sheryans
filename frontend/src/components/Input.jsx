import { forwardRef } from 'react';

// Reusable Input component with label, error message, and icon support
const Input = forwardRef(({
  label,
  error,
  id,
  className = '',
  leftIcon: LeftIcon,
  rightElement,
  required,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none">
            <LeftIcon size={16} />
          </div>
        )}

        <input
          ref={ref}
          id={id}
          className={`input ${LeftIcon ? 'pl-9' : ''} ${rightElement ? 'pr-10' : ''} ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
