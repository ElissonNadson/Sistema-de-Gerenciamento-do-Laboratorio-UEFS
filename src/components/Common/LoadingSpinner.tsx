import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-uefs-primary`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-uefs-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full screen loading spinner for page-level loading
export function FullScreenLoadingSpinner({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5 flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}