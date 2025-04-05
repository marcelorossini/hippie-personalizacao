import React from 'react';
import { exportLayers } from '../utils/exportUtils';

interface ExportButtonProps {
  designAreaRef: React.RefObject<HTMLDivElement | null>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ designAreaRef }) => {
  return (
    <div className="mt-4 p-4">
      <button
        onClick={() => exportLayers(designAreaRef)}
        className="border-none bg-[#74a451] rounded-[5px] h-16 flex items-center justify-center w-full px-5 font-bold uppercase cursor-pointer text-white text-[15px]"
      >
        COLOCAR NA MOCHILA
      </button>
    </div>
  );
};

export default ExportButton; 