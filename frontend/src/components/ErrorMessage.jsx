import { AlertCircle } from 'lucide-react';

// Displayed when an API request fails
const ErrorMessage = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-danger" />
      </div>
      <h3 className="text-base font-semibold text-main-text mb-1">Something went wrong</h3>
      <p className="text-sm text-secondary-text max-w-sm leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
