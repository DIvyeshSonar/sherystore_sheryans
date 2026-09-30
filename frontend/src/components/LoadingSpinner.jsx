import { Loader2 } from 'lucide-react';

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

// A simple animated spinner using Lucide's Loader2 icon
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <Loader2
      className={`${SIZE_MAP[size]} text-primary animate-spin ${className}`}
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;
