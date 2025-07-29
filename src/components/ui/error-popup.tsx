import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  title?: string;
  message: string;
  details?: string;
}

export function ErrorPopup({ 
  isOpen, 
  onClose, 
  onRetry, 
  title = "Error", 
  message, 
  details 
}: ErrorPopupProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <svg 
            className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <div>
            <p className="text-gray-800">{message}</p>
            {details && (
              <details className="mt-2">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                  Technical Details
                </summary>
                <p className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {details}
                </p>
              </details>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {onRetry && (
            <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}