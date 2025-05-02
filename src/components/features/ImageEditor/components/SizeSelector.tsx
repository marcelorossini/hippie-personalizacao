import React from 'react';
import QuantitySelector from './QuantitySelector';

interface SizeSelectorProps {
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
  showError?: boolean;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ 
  selectedSize, 
  onSizeChange, 
  showError,
  quantity,
  onQuantityChange 
}) => {
  const sizes = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Tamanho da Camiseta</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`px-4 py-2 rounded-md border transition-colors ${selectedSize === size
                  ? 'bg-[#74a451] text-white border-[#74a451]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#74a451]'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
        {showError && !selectedSize && (
          <p className="text-sm text-red-500">Por favor, selecione um tamanho</p>
        )}
      </div>
      
      <QuantitySelector 
        quantity={quantity}
        onQuantityChange={onQuantityChange}
      />
    </div>
  );
};

export default SizeSelector; 