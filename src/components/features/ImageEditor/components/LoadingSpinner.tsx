import React from 'react';

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10 z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-[#74a451] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-medium">Adicionando na mochila</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 