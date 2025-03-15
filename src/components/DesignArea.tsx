import React, { useRef, useEffect } from 'react';
import { Layer } from './App';
import {
  getPointer,
  makeDraggable,
  makeResizable,
  makeRotatable,
  makePinchZoomable,
} from '../utils/dragUtils';

interface DesignAreaProps {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  selectedLayerId: string | null;
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>;
}

const DesignArea: React.FC<DesignAreaProps> = ({
  layers,
  setLayers,
  selectedLayerId,
  setSelectedLayerId,
}) => {
  const designAreaRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const layerCounterRef = useRef<number>(1);

  // Upload do arquivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target) {
        createLayerItem(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const createLayerItem = (imgSrc: string) => {
    const container = document.createElement('div');
    container.classList.add('design-item');
    container.dataset.rotateAngle = '0';
    const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    container.dataset.layerId = layerId;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.classList.add('design-image');
    img.style.width = "150px";
    img.style.height = "auto";
    img.draggable = false;

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');

    const rotateHandle = document.createElement('div');
    rotateHandle.classList.add('rotate-handle');

    container.appendChild(img);
    container.appendChild(resizeHandle);
    container.appendChild(rotateHandle);

    if (designAreaRef.current) {
      designAreaRef.current.appendChild(container);
    }

    // Ativando os comportamentos de arrastar, redimensionar, rotacionar e pinch/zoom
    makeDraggable(container, designAreaRef);
    makeResizable(container, img, resizeHandle, designAreaRef);
    makeRotatable(container, rotateHandle);
    makePinchZoomable(container, img, designAreaRef);

    // Eventos de seleção e menu de contexto
    container.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).classList.contains('resize-handle') ||
          (e.target as HTMLElement).classList.contains('rotate-handle')) return;
      selectLayer(layerId);
    });
    container.addEventListener('touchstart', (e) => {
      if ((e.target as HTMLElement).classList.contains('resize-handle') ||
          (e.target as HTMLElement).classList.contains('rotate-handle')) return;
      selectLayer(layerId);
    });
    container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      selectLayer(layerId);
      showContextMenu(e.pageX, e.pageY);
    });

    // Long press para mobile (700ms)
    let longPressTimer: number;
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        longPressTimer = window.setTimeout(() => {
          selectLayer(layerId);
          sendLayerToBack();
        }, 700);
      }
    }, { passive: false });
    container.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    });
    container.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    });

    setLayers(prev => [...prev, {
      id: layerId,
      name: 'Camada ' + (layerCounterRef.current++),
      container: container,
    }]);
  };

  const selectLayer = (layerId: string) => {
    setSelectedLayerId(layerId);
    layers.forEach(l => {
      if (l.id === layerId) {
        l.container.classList.add('selected');
      } else {
        l.container.classList.remove('selected');
      }
    });
  };

  const updateLayerOrderInDOM = () => {
    if (designAreaRef.current) {
      layers.forEach(layer => {
        if (designAreaRef.current) {
          designAreaRef.current.appendChild(layer.container);
        }
      });
    }
  };

  const exportLayers = () => {
    if (!designAreaRef.current) return;
    const scale = 3;
    const designWidth = designAreaRef.current.offsetWidth;
    const designHeight = designAreaRef.current.offsetHeight;
    const canvas = document.createElement('canvas');
    canvas.width = designWidth * scale;
    canvas.height = designHeight * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, designWidth, designHeight);

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

    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'design-highres.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  const sendLayerToBack = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx < 0) return;
    const newLayers = [...layers];
    const [layerObj] = newLayers.splice(idx, 1);
    newLayers.unshift(layerObj);
    setLayers(newLayers);
    updateLayerOrderInDOM();
    hideContextMenu();
  };

  useEffect(() => {
    updateLayerOrderInDOM();
  }, [layers]);

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

  return (
    <div className="design-section">
      <div className="controls">
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <button onClick={exportLayers}>Exportar Imagem</button>
      </div>

      <div className="tshirt-container">
        <img
          src="https://31270.cdn.simplo7.net/static/31270/sku/SGRD_299_001_camisasublimaAAobrancap01.jpg"
          alt="Modelo de Camiseta"
          className="tshirt-base"
        />
        <div id="design-area" ref={designAreaRef} className="design-area"></div>
      </div>

      <div id="context-menu" ref={contextMenuRef} className="context-menu">
        <ul>
          <li onClick={sendLayerToBack}>Enviar para trás</li>
        </ul>
      </div>
    </div>
  );
};

export default DesignArea;
