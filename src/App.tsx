import React, { useState } from 'react';
import ImageEditor from './lib';
import { useLayerManager } from './components/features/ImageEditor/hooks/useLayerManager';
import { handleFileUpload } from './components/features/ImageEditor/utils/imageUtils';
import { FaPlus } from 'react-icons/fa';

function App() {
  const layerManager = useLayerManager();
  const [showMobileGallery, setShowMobileGallery] = useState(false);

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const dataUrl = await handleFileUpload(event);
    if (dataUrl) {
      const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      layerManager.addLayer({
        id: layerId,
        name: 'Camada ' + layerId,
        imgSrc: dataUrl,
      });
    }
  };

  const handleImageSelect = () => {
    setShowMobileGallery(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 z-10">
        <div className="flex gap-4 justify-end">
          {/* Botão de galeria visível apenas em mobile */}
          <button
            onClick={() => setShowMobileGallery(true)}
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
            className="flex items-center gap-2 px-4 py-2 text-[#5e160f] hover:text-[#5e160f] font-bold cursor-pointer"
          >
            <FaPlus /> ENVIAR IMAGEM
          </label>
        </div>
      </div>
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
