import React, { useState } from 'react';
import ImageEditor from './lib';
import { useLayerManager } from './components/features/ImageEditor/hooks/useLayerManager';
import { handleFileUpload } from './components/features/ImageEditor/utils/imageUtils';
import Header from './components/features/Header';

function App() {
  const layerManager = useLayerManager();
  const [showMobileGallery, setShowMobileGallery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    try {
      const dataUrl = await handleFileUpload(event);
      if (dataUrl) {
        const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        layerManager.addLayer({
          id: layerId,
          name: 'Camada ' + layerId,
          imgSrc: dataUrl,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = () => {
    setShowMobileGallery(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        isLoading={isLoading}
        onFileUpload={onFileUpload}
        onOpenGallery={() => setShowMobileGallery(true)}
      />
      <div className="flex-1 overflow-auto">
        <ImageEditor 
          layerManager={layerManager}
          showMobileGallery={showMobileGallery}
          onImageSelect={handleImageSelect}
        />
      </div>
    </div>
  );
}

export default App;
