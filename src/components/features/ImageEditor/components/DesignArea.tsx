import React, { useRef, useEffect, useState } from 'react';
import DesignItem from './DesignItem';
import heic2any from 'heic2any';


export interface Layer {
  id: string;
  name: string;
  imgSrc: string;
}

interface DesignAreaProps {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  selectedLayerId: string | null;
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>;
}

const DesignArea: React.FC<DesignAreaProps> = ({ layers, setLayers, selectedLayerId, setSelectedLayerId }) => {
  const designAreaRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const layerCounterRef = useRef<number>(1);
  const templateImageRef = useRef<HTMLImageElement>(null);
  const [templateSize, setTemplateSize] = useState({ width: 0, height: 0 });


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

  // Função de upload adaptada para tratar arquivos HEIC separadamente
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    let dataUrl: string;

    // Verifica se o arquivo é HEIC, seja pelo type ou pela extensão
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        dataUrl = await convertHeicFile(file);
      } catch (error) {
        // Caso ocorra algum erro na conversão, você pode tratar aqui
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

    // Chama a função que cria o layer/item passando a Data URL da imagem
    createLayerItem(dataUrl);
  };

  const createLayerItem = (imgSrc: string) => {
    const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const newLayer: Layer = {
      id: layerId,
      name: 'Camada ' + layerCounterRef.current++,
      imgSrc,
    };
    setLayers(prev => [...prev, newLayer]);
  };

  const selectLayer = (layerId: string) => {
    setSelectedLayerId(layerId);
    // A renderização condicional em DesignItem já cuida da atualização visual da borda
  };

  const sendLayerToBack = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx < 0) return;
    const newLayers = [...layers];
    const [layerObj] = newLayers.splice(idx, 1);
    newLayers.unshift(layerObj);
    setLayers(newLayers);
    hideContextMenu();
  };

  const sendLayerToFront = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx < 0) return;
    const newLayers = [...layers];
    const [layerObj] = newLayers.splice(idx, 1);
    newLayers.push(layerObj);
    setLayers(newLayers);
    hideContextMenu();
  };

  const moveLayerForward = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx < 0 || idx === layers.length - 1) return;
    const newLayers = [...layers];
    const temp = newLayers[idx];
    newLayers[idx] = newLayers[idx + 1];
    newLayers[idx + 1] = temp;
    setLayers(newLayers);
  };

  const moveLayerBackward = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx <= 0) return;
    const newLayers = [...layers];
    const temp = newLayers[idx];
    newLayers[idx] = newLayers[idx - 1];
    newLayers[idx - 1] = temp;
    setLayers(newLayers);
  };

  const removeLayer = () => {
    if (!selectedLayerId) return;
    setLayers(prev => prev.filter(layer => layer.id !== selectedLayerId));
    setSelectedLayerId(null);
    hideContextMenu();
  };

  const showContextMenu = (x: number, y: number) => {
    if (contextMenuRef.current) {
      contextMenuRef.current.style.left = x + 'px';
      contextMenuRef.current.style.top = y + 'px';
      contextMenuRef.current.style.display = 'block';
    }
  };

  const hideContextMenu = () => {
    if (contextMenuRef.current) {
      contextMenuRef.current.style.display = 'none';
    }
  };

  const exportLayers = () => {
    if (!designAreaRef.current) return;

    // Define tamanho fixo do canvas em 4096x4096
    const canvasSize = 4096;
    const designWidth = designAreaRef.current.offsetWidth;
    const designHeight = designAreaRef.current.offsetHeight;

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calcula os fatores de escala para que o design caiba no canvas mantendo a proporção
    const scaleX = canvasSize / designWidth;
    const scaleY = canvasSize / designHeight;
    const scale = Math.min(scaleX, scaleY);

    // Calcula deslocamentos para centralizar o design no canvas
    const offsetX = (canvasSize - designWidth * scale) / 2;
    const offsetY = (canvasSize - designHeight * scale) / 2;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const items = designAreaRef.current.getElementsByClassName('design-item');
    Array.from(items).forEach(item => {
      const left = parseFloat((item as HTMLElement).style.left) || 0;
      const top = parseFloat((item as HTMLElement).style.top) || 0;
      const angle = parseFloat((item as HTMLElement).dataset.rotateAngle || '0') || 0;
      const img = (item as HTMLElement).querySelector('.design-image') as HTMLImageElement;
      if (!img) return;

      const imgWidth = img.offsetWidth;
      const imgHeight = img.offsetHeight;
      const centerX = left + imgWidth / 2;
      const centerY = top + imgHeight / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * Math.PI / 180);
      ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      ctx.restore();
    });

    ctx.restore();

    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'design-highres.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        hideContextMenu();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('scroll', hideContextMenu);
    window.addEventListener('resize', hideContextMenu);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('scroll', hideContextMenu);
      window.removeEventListener('resize', hideContextMenu);
    };
  }, []);

  useEffect(() => {
    const updateDesignAreaSize = () => {
      if (templateImageRef.current && designAreaRef.current) {
        const templateImg = templateImageRef.current;
        const designArea = designAreaRef.current;
        
        // Obtém as dimensões do container pai
        const containerWidth = designArea.parentElement?.clientWidth || 0;
        const containerHeight = designArea.parentElement?.clientHeight || 0;
        
        // Calcula a proporção da imagem template
        const templateAspectRatio = templateImg.naturalWidth / templateImg.naturalHeight;
        
        // Calcula as dimensões máximas permitidas (80% do container)
        const maxWidth = containerWidth * 0.8;
        const maxHeight = containerHeight * 0.8;
        
        // Calcula as dimensões mantendo a proporção
        let newWidth = maxWidth;
        let newHeight = newWidth / templateAspectRatio;
        
        // Se a altura exceder o máximo, recalcula baseado na altura
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = newHeight * templateAspectRatio;
        }
        
        // Atualiza o tamanho da área de design
        designArea.style.width = `${newWidth}px`;
        designArea.style.height = `${newHeight}px`;
        
        // Atualiza o estado com as novas dimensões
        setTemplateSize({
          width: newWidth,
          height: newHeight
        });
      }
    };

    // Observa mudanças no tamanho da imagem template
    const resizeObserver = new ResizeObserver(updateDesignAreaSize);
    if (templateImageRef.current) {
      resizeObserver.observe(templateImageRef.current);
    }

    // Adiciona um listener para redimensionamento da janela
    window.addEventListener('resize', updateDesignAreaSize);

    // Atualiza o tamanho inicial
    updateDesignAreaSize();

    // Limpa os listeners quando o componente for desmontado
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDesignAreaSize);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 relative border-2 border-red-500 h-full overflow-hidden">
      <div>
        <div className="mb-3 flex gap-3">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer border p-1 rounded">
            Upload
          </label>
          <button
            onClick={exportLayers}
            className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600"
          >
            Exportar Imagem
          </button>
        </div>
      </div>
      <div className="flex-1 relative border-2 border-blue-500 overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center border-2 border-green-500 overflow-hidden">
          <img
            draggable={false}
            ref={templateImageRef}
            src="./image.png"
            alt="Modelo de Camiseta"
            className="max-h-full max-w-full object-contain border-2 border-yellow-500"
          />
          <div
            id="design-area"
            ref={designAreaRef}
            className="design-area absolute overflow-hidden select-none border-2 border-purple-500"
            style={{
              width: `${templateSize.width}px`,
              height: `${templateSize.height}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedLayerId(null);
              }
            }}
          >
            {layers.map(layer => (
              <DesignItem
                key={layer.id}
                id={layer.id}
                imgSrc={layer.imgSrc}
                designAreaRef={designAreaRef}
                isSelected={selectedLayerId === layer.id}
                selectLayer={selectLayer}
                showContextMenu={showContextMenu}
                sendLayerToBack={sendLayerToBack}
                sendLayerToFront={sendLayerToFront}
                removeLayer={removeLayer}
              />
            ))}
          </div>
        </div>
        <div
          id="context-menu"
          ref={contextMenuRef}
          className="absolute bg-white border border-gray-300 hidden z-50"
        >
          <ul className="py-1">
            <li onClick={sendLayerToFront} className="py-1 px-3 cursor-pointer hover:bg-gray-100">
              Enviar para frente
            </li>
            <li onClick={sendLayerToBack} className="py-1 px-3 cursor-pointer hover:bg-gray-100">
              Enviar para trás
            </li>
            <li onClick={removeLayer} className="py-1 px-3 cursor-pointer hover:bg-gray-100 text-red-600">
              Remover camada
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DesignArea;
