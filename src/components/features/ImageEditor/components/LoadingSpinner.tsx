import React from 'react';
import ConfirmationModal from './ConfirmationModal';

interface LoadingSpinnerProps {
  isLoading: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading, message = 'Adicionando na mochila' }) => {
  if (!isLoading) return null;

  return (
    <ConfirmationModal
      open={isLoading}
      onOpenChange={() => {}}
      title=""
      buttons={[]}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-t-[#74a451] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-medium text-center">{message}</p>
      </div>
    </ConfirmationModal>
  );
};

export default LoadingSpinner; 