import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface HeaderProps {
  isLoading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGallery: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoading, onFileUpload, onOpenGallery }) => {
  return (
    <div className="flex justify-between items-center p-4 z-10">
      <h2 className="text-[#5e160f] font-bold text-2xl">Personalize sua camiseta</h2>
      <div className="flex gap-4 justify-end">
        {/* Botão de galeria visível apenas em mobile */}
        <button
          onClick={onOpenGallery}
          className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Abrir Galeria
        </button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
        />
        <label 
          htmlFor="file-upload" 
          className="flex items-center gap-2 px-4 py-2 text-[#5e160f] hover:text-[#5e160f] font-bold cursor-pointer relative"
        >
          <FaPlus /> ENVIAR IMAGEM
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-md">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5e160f]"></div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default Header; 