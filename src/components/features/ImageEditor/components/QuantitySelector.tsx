import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Quantidade</label>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:border-[#74a451] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 1) {
              onQuantityChange(value);
            }
          }}
          className="w-16 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:border-[#74a451]"
        />
        <button
          onClick={handleIncrease}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:border-[#74a451]"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector; 