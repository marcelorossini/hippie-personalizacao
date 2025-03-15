import React, { useRef, useState, useEffect } from 'react';

function App() {
  const designAreaRef = useRef(null);
  const contextMenuRef = useRef(null);
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const layerCounterRef = useRef(1);

  // Retorna o objeto do ponteiro (mouse ou toque)
  const getPointer = (e) => (e.touches && e.touches[0]) ? e.touches[0] : e;

  // Manipulador do upload do arquivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      createLayerItem(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Cria uma camada (layer) – aqui usamos criação dinâmica de elemento
  // e depois atualizamos o estado para renderizar a lista lateral.
  const createLayerItem = (imgSrc) => {
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

    // Ativa as funcionalidades
    makeDraggable(container);
    makeResizable(container, img, resizeHandle);
    makeRotatable(container, rotateHandle);
    makePinchZoomable(container, img);

    // Eventos de seleção e menu de contexto
    container.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;
      selectLayer(layerId);
    });
    container.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;
      selectLayer(layerId);
    });
    container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      selectLayer(layerId);
      showContextMenu(e.pageX, e.pageY);
    });

    // Long press para mobile (após 700ms, envia para trás)
    let longPressTimer;
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        longPressTimer = setTimeout(() => {
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

    // Adiciona a nova camada ao estado
    setLayers(prev => [...prev, {
      id: layerId,
      name: 'Camada ' + (layerCounterRef.current++),
      container: container
    }]);
  };

  // Seleciona uma camada e adiciona a classe CSS "selected" no container correspondente
  const selectLayer = (layerId) => {
    setSelectedLayerId(layerId);
    layers.forEach(l => {
      if (l.id === layerId) {
        l.container.classList.add('selected');
      } else {
        l.container.classList.remove('selected');
      }
    });
  };

  // Reordena as camadas na área de design conforme o array "layers"
  const updateLayerOrderInDOM = () => {
    if (designAreaRef.current) {
      layers.forEach(layer => {
        designAreaRef.current.appendChild(layer.container);
      });
    }
  };

  // Torna o elemento "container" arrastável
  const makeDraggable = (container) => {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    const dragStart = (e) => {
      if (e.touches && e.touches.length > 1) return;
      if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;
      e.preventDefault();
      isDragging = true;
      const pointer = getPointer(e);
      startX = pointer.clientX;
      startY = pointer.clientY;
      const computedStyle = window.getComputedStyle(container);
      initialLeft = parseFloat(computedStyle.left) || 0;
      initialTop = parseFloat(computedStyle.top) || 0;

      if (e.type === 'touchstart') {
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd, { passive: false });
      } else {
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
      }
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const pointer = getPointer(e);
      const dx = pointer.clientX - startX;
      const dy = pointer.clientY - startY;
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;
      const maxLeft = designAreaRef.current ? designAreaRef.current.offsetWidth - container.offsetWidth : 0;
      const maxTop = designAreaRef.current ? designAreaRef.current.offsetHeight - container.offsetHeight : 0;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));
      container.style.left = newLeft + 'px';
      container.style.top = newTop + 'px';
    };

    const dragEnd = (e) => {
      isDragging = false;
      if (e.type === 'touchend') {
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('touchend', dragEnd);
      } else {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
      }
    };

    container.addEventListener('mousedown', dragStart);
    container.addEventListener('touchstart', dragStart, { passive: false });
  };

  // Função para redimensionar
  const makeResizable = (container, image, handle) => {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    let aspectRatio = 1;

    const resizeStart = (e) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing = true;
      const pointer = getPointer(e);
      startX = pointer.clientX;
      startWidth = image.offsetWidth;
      const startHeight = image.offsetHeight;
      aspectRatio = startWidth / startHeight;
      container.style.width = startWidth + 'px';
      container.style.height = startHeight + 'px';

      if (e.type === 'touchstart') {
        document.addEventListener('touchmove', resizeMove, { passive: false });
        document.addEventListener('touchend', resizeEnd, { passive: false });
      } else {
        document.addEventListener('mousemove', resizeMove);
        document.addEventListener('mouseup', resizeEnd);
      }
    };

    const resizeMove = (e) => {
      if (!isResizing) return;
      e.preventDefault();
      const pointer = getPointer(e);
      const dx = pointer.clientX - startX;
      let newWidth = startWidth + dx;
      newWidth = Math.max(newWidth, 20);
      const currentLeft = parseFloat(container.style.left) || container.offsetLeft;
      const currentTop = parseFloat(container.style.top) || container.offsetTop;
      const maxWidth = designAreaRef.current ? designAreaRef.current.offsetWidth - currentLeft : newWidth;
      const maxHeight = designAreaRef.current ? designAreaRef.current.offsetHeight - currentTop : 0;
      newWidth = Math.min(newWidth, maxWidth, maxHeight * aspectRatio);
      const newHeight = newWidth / aspectRatio;
      image.style.width = newWidth + 'px';
      image.style.height = newHeight + 'px';
      container.style.width = newWidth + 'px';
      container.style.height = newHeight + 'px';
    };

    const resizeEnd = (e) => {
      isResizing = false;
      if (e.type === 'touchend') {
        document.removeEventListener('touchmove', resizeMove);
        document.removeEventListener('touchend', resizeEnd);
      } else {
        document.removeEventListener('mousemove', resizeMove);
        document.removeEventListener('mouseup', resizeEnd);
      }
    };

    handle.addEventListener('mousedown', resizeStart);
    handle.addEventListener('touchstart', resizeStart, { passive: false });
  };

  // Função para rotacionar
  const makeRotatable = (container, handle) => {
    let isRotating = false;
    let startAngle = 0;
    let initialAngle = 0;
    let center = { x: 0, y: 0 };

    const rotateStart = (e) => {
      e.stopPropagation();
      e.preventDefault();
      isRotating = true;
      initialAngle = parseFloat(container.dataset.rotateAngle) || 0;
      const rect = container.getBoundingClientRect();
      center.x = rect.left + rect.width / 2;
      center.y = rect.top + rect.height / 2;
      const pointer = getPointer(e);
      startAngle = getAngle(pointer.clientX, pointer.clientY, center.x, center.y);

      if (e.type === 'touchstart') {
        document.addEventListener('touchmove', rotateMove, { passive: false });
        document.addEventListener('touchend', rotateEnd, { passive: false });
      } else {
        document.addEventListener('mousemove', rotateMove);
        document.addEventListener('mouseup', rotateEnd);
      }
    };

    const rotateMove = (e) => {
      if (!isRotating) return;
      e.preventDefault();
      const pointer = getPointer(e);
      const currentAngle = getAngle(pointer.clientX, pointer.clientY, center.x, center.y);
      let delta = currentAngle - startAngle;
      let newAngle = initialAngle + delta;
      container.dataset.rotateAngle = String(newAngle);
      container.style.transform = `rotate(${newAngle}deg)`;
    };

    const rotateEnd = (e) => {
      isRotating = false;
      if (e.type === 'touchend') {
        document.removeEventListener('touchmove', rotateMove);
        document.removeEventListener('touchend', rotateEnd);
      } else {
        document.removeEventListener('mousemove', rotateMove);
        document.removeEventListener('mouseup', rotateEnd);
      }
    };

    handle.addEventListener('mousedown', rotateStart);
    handle.addEventListener('touchstart', rotateStart, { passive: false });
  };

  // Função auxiliar para calcular o ângulo
  const getAngle = (mouseX, mouseY, centerX, centerY) => {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const rad = Math.atan2(dy, dx);
    return rad * (180 / Math.PI);
  };

  // Habilita o pinch/zoom com rotação para dispositivos móveis
  const makePinchZoomable = (container, image) => {
    let isPinching = false;
    let initialDistance = 0;
    let initialWidth = 0;
    let initialHeight = 0;
    let aspectRatio = 1;
    let initialPinchAngle = 0;
    let initialRotateAngle = 0;

    const pinchStart = (e) => {
      if (e.touches.length === 2) {
        isPinching = true;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialWidth = image.offsetWidth;
        initialHeight = image.offsetHeight;
        aspectRatio = initialWidth / initialHeight;
        initialPinchAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        ) * (180 / Math.PI);
        initialRotateAngle = parseFloat(container.dataset.rotateAngle) || 0;
      }
    };

    const pinchMove = (e) => {
      if (!isPinching || e.touches.length !== 2) return;
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scale = currentDistance / initialDistance;
      let newWidth = initialWidth * scale;
      let newHeight = initialHeight * scale;
      newWidth = Math.max(newWidth, 20);
      newHeight = Math.max(newHeight, 20);
      let currentLeft = parseFloat(container.style.left) || container.offsetLeft;
      let currentTop = parseFloat(container.style.top) || container.offsetTop;
      const maxWidth = designAreaRef.current ? designAreaRef.current.offsetWidth - currentLeft : newWidth;
      const maxHeight = designAreaRef.current ? designAreaRef.current.offsetHeight - currentTop : newHeight;
      newWidth = Math.min(newWidth, maxWidth, maxHeight * aspectRatio);
      newHeight = newWidth / aspectRatio;
      image.style.width = newWidth + 'px';
      image.style.height = newHeight + 'px';
      container.style.width = newWidth + 'px';
      container.style.height = newHeight + 'px';

      const currentPinchAngle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * (180 / Math.PI);
      const deltaAngle = currentPinchAngle - initialPinchAngle;
      const newRotation = initialRotateAngle + deltaAngle;
      container.dataset.rotateAngle = newRotation;
      container.style.transform = `rotate(${newRotation}deg)`;
    };

    const pinchEnd = (e) => {
      if (e.touches.length < 2) {
        isPinching = false;
      }
    };

    container.addEventListener('touchstart', pinchStart, { passive: false });
    container.addEventListener('touchmove', pinchMove, { passive: false });
    container.addEventListener('touchend', pinchEnd, { passive: false });
  };

  // Exporta a imagem combinada das camadas (high resolution)
  const exportLayers = () => {
    if (!designAreaRef.current) return;
    const scale = 3;
    const designWidth = designAreaRef.current.offsetWidth;
    const designHeight = designAreaRef.current.offsetHeight;
    const canvas = document.createElement('canvas');
    canvas.width = designWidth * scale;
    canvas.height = designHeight * scale;
    const ctx = canvas.getContext('2d');

    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, designWidth, designHeight);

    const items = designAreaRef.current.getElementsByClassName('design-item');
    Array.from(items).forEach(item => {
      const left = parseFloat(item.style.left) || 0;
      const top = parseFloat(item.style.top) || 0;
      const angle = parseFloat(item.dataset.rotateAngle) || 0;
      const img = item.querySelector('.design-image');
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

  // Mostra o menu de contexto na posição x, y
  const showContextMenu = (x, y) => {
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

  // Envia a camada selecionada para trás (alterando a ordem no array e na DOM)
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

  // Sempre que "layers" mudar, reordena as camadas na área de design
  useEffect(() => {
    updateLayerOrderInDOM();
  }, [layers]);

  // Eventos globais para esconder o menu de contexto
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
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
    <div>
      {/* Estilos inline (tudo em uma página) */}
      <style>{`
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 0;
        }
        .container {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .container {
            flex-direction: column;
          }
          .layers-panel {
            width: 100%;
            margin-bottom: 10px;
          }
          .design-section {
            width: 100%;
          }
          .tshirt-base, .design-area {
            width: 100%;
            max-width: 300px;
          }
          .design-area {
            height: auto;
            position: relative;
          }
        }
        .layers-panel {
          width: 200px;
          border: 1px solid #ccc;
          padding: 10px;
          box-sizing: border-box;
        }
        .layers-panel h2 {
          margin-top: 0;
          font-size: 18px;
        }
        .layers-panel ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .layers-panel ul li {
          padding: 5px 8px;
          margin-bottom: 4px;
          border: 1px solid #ddd;
          cursor: pointer;
        }
        .layers-panel ul li.selected {
          background-color: #f0f0f0;
          border-color: #aaa;
        }
        .design-section {
          flex: 1;
          text-align: center;
        }
        .controls {
          margin-bottom: 10px;
        }
        .tshirt-container {
          position: relative;
          display: inline-block;
          margin-top: 10px;
        }
        .tshirt-base {
          width: 300px;
        }
        .design-area {
          position: absolute;
          top: 0;
          left: 0;
          width: 300px;
          height: 400px;
          border: 1px solid red;
        }
        .design-item {
          position: absolute;
          display: inline-block;
          cursor: move;
          top: 50px;
          left: 50px;
          transform-origin: 50% 50%;
          border: 1px dashed transparent;
        }
        .design-item.selected {
          border: 1px dashed #3498db;
        }
        .design-image {
          display: block;
          -webkit-user-drag: none;
        }
        .resize-handle {
          width: 14px;
          height: 14px;
          position: absolute;
          bottom: 0;
          right: 0;
          cursor: se-resize;
          background-color: #3498db;
          border: 2px solid #fff;
          box-sizing: border-box;
        }
        .rotate-handle {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 0;
          right: 0;
          cursor: ne-resize;
          background-color: #e74c3c;
          border: 2px solid #fff;
          box-sizing: border-box;
        }
        .context-menu {
          position: absolute;
          background-color: #fff;
          border: 1px solid #ccc;
          display: none;
          z-index: 9999;
        }
        .context-menu ul {
          list-style: none;
          margin: 0;
          padding: 5px;
        }
        .context-menu ul li {
          padding: 5px 10px;
          cursor: pointer;
        }
        .context-menu ul li:hover {
          background-color: #eee;
        }
      `}</style>

      <div className="container">
        {/* Painel lateral para listar as camadas */}
        <div className="layers-panel">
          <h2>Camadas</h2>
          <ul>
            {layers
              .slice() // para não modificar o array original
              .reverse()
              .map(layer => (
                <li
                  key={layer.id}
                  className={layer.id === selectedLayerId ? 'selected' : ''}
                  onClick={() => selectLayer(layer.id)}
                >
                  {layer.name}
                </li>
              ))}
          </ul>
        </div>

        {/* Seção principal com controles e visualização da camiseta */}
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
        </div>
      </div>

      {/* Menu de contexto */}
      <div id="context-menu" ref={contextMenuRef} className="context-menu">
        <ul>
          <li onClick={sendLayerToBack}>Enviar para trás</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
