import React from 'react';
import VaulDrawer from '../../../common/ui/Drawer';
import ImageGallery from '../../../features/ImageGallery';

interface ImageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelect?: (imageUrl: string) => void;
}

const ImageDrawer: React.FC<ImageDrawerProps> = ({ open, onOpenChange, onImageSelect }) => {
  return (
    <VaulDrawer open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Galeria de Imagens</h2>
        <ImageGallery onImageSelect={onImageSelect} />
      </div>
    </VaulDrawer>
  );
};

export default ImageDrawer; 