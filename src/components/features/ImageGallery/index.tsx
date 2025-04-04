import React from 'react';

interface ImageGalleryProps {
  onImageSelect?: (imageUrl: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ onImageSelect }) => {
  const images = [
    './1.png',
    './2.png',
    'https://placehold.co/400x400/png',
    'https://placehold.co/400x400/png',
    'https://placehold.co/400x400/png',
    'https://placehold.co/400x400/png',
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {images.map((imageUrl, index) => (
        <div
          key={`${imageUrl}-${index}`}
          className="relative aspect-square cursor-pointer hover:opacity-80 transition-opacity bg-gray-50 rounded-lg p-2"
          onClick={() => onImageSelect?.(imageUrl)}
        >
          <img
            src={imageUrl}
            alt={`Imagem ${index + 1}`}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery; 