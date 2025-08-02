import { AlertTriangle, X } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'warning' | 'info' | 'error';
}

export function AlertBanner({ message, onDismiss, variant = 'warning' }: AlertBannerProps) {
  if (!message.trim()) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          bg: 'bg-red-100',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600'
        };
      case 'info':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`rounded-lg border p-4 ${styles.bg} ${styles.border} mb-6`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />
        <div className="flex-1">
          <h4 className={`font-semibold ${styles.text}`}>
            Aviso Especial
          </h4>
          <p className={`mt-1 text-sm ${styles.text}`}>
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition-opacity`}
            aria-label="Fechar aviso"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}