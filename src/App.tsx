import React, { useState } from 'react';
import ImageEditor from './lib';
import ImageDrawer from './components/features/ImageEditor/components/ImageDrawer';
import { useLayerManager } from './components/features/ImageEditor/hooks/useLayerManager';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const layerManager = useLayerManager();

  const handleImageSelect = (imageUrl: string) => {
    const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    layerManager.addLayer({
      id: layerId,
      name: 'Camada ' + layerId,
      imgSrc: imageUrl,
    });
    setIsDrawerOpen(false);
  };

  function add() {
    const searchParams = new URLSearchParams(window.location.href);
    var product_variant_id = searchParams.get('product_variant_id');

    window.top.postMessage(`
      addToCartClick(${product_variant_id})
    `, '*')
  }


  return (
    <div className="relative">
      <button onClick={() => add()}>TESTE</button>
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Abrir Galeria
        </button>
      </div>
      <ImageEditor layerManager={layerManager} />
      <ImageDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
        onImageSelect={handleImageSelect}
      />
    </div>
  );
}

export default App;
