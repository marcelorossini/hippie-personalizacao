import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface HeaderProps {
  isLoading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGallery: () => void;
  onAddText: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoading, onFileUpload, onOpenGallery, onAddText }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 z-10 gap-3 sm:gap-0">
      <h2 className="text-[#5e160f] font-bold text-xl sm:text-2xl text-center sm:text-left">Personalize sua camiseta</h2>
      <div className="flex gap-2 sm:gap-4 justify-center sm:justify-end w-full sm:w-auto">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
        />
        <label 
          htmlFor="file-upload" 
          className="flex items-center gap-2 px-3 py-2 text-[#5e160f] hover:text-[#5e160f] font-bold cursor-pointer relative text-sm sm:text-base"
        >
          <FaPlus /> ENVIAR IMAGEM
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-md">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5e160f]"></div>
            </div>
          )}
        </label>
        <button
          onClick={onAddText}
          className="flex items-center gap-2 px-3 py-2 text-[#5e160f] hover:text-[#5e160f] font-bold cursor-pointer text-sm sm:text-base"
        >
          <FaPlus /> TEXTO
        </button>
        {/* Botão de galeria visível apenas em mobile */}
        <div className="md:hidden">
          <button
            onClick={onOpenGallery}
            className="flex items-center gap-2 px-3 py-2 text-[#5e160f] hover:text-[#5e160f] font-bold cursor-pointer text-sm sm:text-base"
          >
            <FaPlus /> GALERIA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header; 