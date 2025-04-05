import React, { useState } from 'react';
import ImageEditor from './lib';
import ImageDrawer from './components/features/ImageEditor/components/ImageDrawer';
import { useLayerManager } from './components/features/ImageEditor/hooks/useLayerManager';
import heic2any from 'heic2any';

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

  // Função para converter arquivos HEIC para JPEG e retornar uma Data URL
  const convertHeicFile = async (file: File): Promise<string> => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      // Caso retorne um array de blobs, usamos o primeiro
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter HEIC:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    let dataUrl: string;

    // Verifica se o arquivo é HEIC, seja pelo type ou pela extensão
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        dataUrl = await convertHeicFile(file);
      } catch (error) {
        console.error('Erro na conversão do arquivo HEIC', error);
        return;
      }
    } else {
      // Para outros tipos de arquivo, utiliza o FileReader normalmente
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    layerManager.addLayer({
      id: layerId,
      name: 'Camada ' + layerId,
      imgSrc: dataUrl,
    });
  };
  
  function add() {
    const searchParams = new URLSearchParams(window.location.href);
    var product_variant_id = searchParams.get('product_variant_id');

    if (window.top) {
      window.top.postMessage(`
        addToCartClick(${product_variant_id}).then(i => console.log(i))
      `, '*');
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-md z-10">
        <div className="flex gap-4">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label 
            htmlFor="file-upload" 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Upload
          </label>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Abrir Galeria
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <ImageEditor layerManager={layerManager} />
      </div>
      <ImageDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
        onImageSelect={handleImageSelect}
      />
    </div>
  );
}

export default App;
