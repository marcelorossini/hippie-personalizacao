// Função para retornar o objeto de ponteiro (mouse ou toque)
export const getPointer = (e: MouseEvent | TouchEvent): MouseEvent | Touch => {
  if ('touches' in e && e.touches.length) {
    return e.touches[0];
  }
  return e as MouseEvent;
};

export const makeDraggable = (container: HTMLElement, designAreaRef: React.RefObject<HTMLElement | null>) => {
  let isDragging = false;
  let startX = 0, startY = 0;
  let startContainerWidth = 0;
  let initialLeft = 0, initialTop = 0;

  const dragStart = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 1) return;
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle') || target.classList.contains('rotate-handle')) return;
    e.preventDefault();
    isDragging = true;
    const pointer = getPointer(e);
    startX = pointer.clientX;
    startY = pointer.clientY;
    startContainerWidth = container.offsetWidth;
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

  const dragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pointer = getPointer(e);
    const dx = pointer.clientX - startX;
    const dy = pointer.clientY - startY;
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;
    if (designAreaRef.current) {
      // Adiciona um pequeno padding para garantir que a borda de seleção permaneça visível
      const padding = 2; // Largura da borda de seleção
      const limitLeft = designAreaRef.current.offsetWidth - startContainerWidth - padding;
      const auxLeft = designAreaRef.current.offsetWidth - container.offsetWidth - padding;
      const maxLeft = auxLeft >= limitLeft ? limitLeft : auxLeft;
      const maxTop = designAreaRef.current.offsetHeight - container.offsetHeight - padding;
      newLeft = Math.max(padding, Math.min(newLeft, maxLeft));
      newTop = Math.max(padding, Math.min(newTop, maxTop));
    }
    container.style.left = newLeft + 'px';
    container.style.top = newTop + 'px';
  };

  const dragEnd = (e: MouseEvent | TouchEvent) => {
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

export const makeResizable = (container: HTMLElement, image: HTMLImageElement, handle: HTMLElement, designAreaRef: React.RefObject<HTMLElement | null>) => {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  let aspectRatio = 1;

  const resizeStart = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing = true;
    const pointer = getPointer(e);
    startX = pointer.clientX;
    startWidth = image.offsetWidth;
    const startHeight = image.offsetHeight;
    aspectRatio = startWidth / startHeight;

    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', resizeMove, { passive: false });
      document.addEventListener('touchend', resizeEnd, { passive: false });
    } else {
      document.addEventListener('mousemove', resizeMove);
      document.addEventListener('mouseup', resizeEnd);
    }
  };

  const resizeMove = (e: MouseEvent | TouchEvent) => {
    if (!isResizing) return;
    e.preventDefault();
    const pointer = getPointer(e);
    const dx = pointer.clientX - startX;
    let newWidth = startWidth + dx;
    newWidth = Math.max(newWidth, 20);
    
    const currentLeft = parseFloat(container.style.left) || container.offsetLeft;
    const currentTop = parseFloat(container.style.top) || container.offsetTop;
    
    // Calcula as dimensões máximas permitidas
    let maxWidth = newWidth;
    let maxHeight = newWidth;
    
    if (designAreaRef.current) {
      // Adiciona um pequeno padding para garantir que a borda de seleção permaneça visível
      const padding = 2; // Largura da borda de seleção
      maxWidth = designAreaRef.current.offsetWidth - currentLeft - padding;
      maxHeight = designAreaRef.current.offsetHeight - currentTop - padding;
    }
    
    // Garante que a largura não exceda o máximo permitido
    newWidth = Math.min(newWidth, maxWidth);
    
    // Calcula a altura mantendo o aspect ratio
    let newHeight = newWidth / aspectRatio;
    
    // Se a altura exceder o máximo permitido, recalcula baseado na altura
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }
    
    // Aplica as novas dimensões mantendo o aspect ratio
    image.style.width = `${newWidth}px`;
    image.style.height = `${newHeight}px`;
  };

  const resizeEnd = (e: MouseEvent | TouchEvent) => {
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

export const makeRotatable = (container: HTMLElement, handle: HTMLElement) => {
  let isRotating = false;
  let startAngle = 0;
  let initialAngle = 0;
  let center = { x: 0, y: 0 };

  const rotateStart = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isRotating = true;
    initialAngle = parseFloat(container.dataset.rotateAngle || '0');
    const rect = container.getBoundingClientRect();
    center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
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

  const rotateMove = (e: MouseEvent | TouchEvent) => {
    if (!isRotating) return;
    e.preventDefault();
    const pointer = getPointer(e);
    const currentAngle = getAngle(pointer.clientX, pointer.clientY, center.x, center.y);
    const delta = currentAngle - startAngle;
    const newAngle = initialAngle + delta;
    container.dataset.rotateAngle = String(newAngle);
    container.style.transform = `rotate(${newAngle}deg)`;
  };

  const rotateEnd = (e: MouseEvent | TouchEvent) => {
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

export const makePinchZoomable = (container: HTMLElement, image: HTMLImageElement, designAreaRef: React.RefObject<HTMLElement | null>) => {
  let isPinching = false;
  let initialDistance = 0;
  let initialWidth = 0;
  let initialHeight = 0;
  let aspectRatio = 1;
  let initialPinchAngle = 0;
  let initialRotateAngle = 0;

  const pinchStart = (e: TouchEvent) => {
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
      initialRotateAngle = parseFloat(container.dataset.rotateAngle || '0');
    }
  };

  const pinchMove = (e: TouchEvent) => {
    if (!isPinching || e.touches.length !== 2) return;
    e.preventDefault();
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    const scale = currentDistance / initialDistance;
    
    // Calcula as novas dimensões mantendo o aspect ratio
    let newWidth = initialWidth * scale;
    let newHeight = initialHeight * scale;
    
    // Define o tamanho mínimo
    newWidth = Math.max(newWidth, 20);
    newHeight = Math.max(newHeight, 20);
    
    // Obtém a posição atual
    const currentLeft = parseFloat(container.style.left) || container.offsetLeft;
    const currentTop = parseFloat(container.style.top) || container.offsetTop;
    
    // Calcula as dimensões máximas permitidas
    let maxWidth = newWidth;
    let maxHeight = newHeight;
    
    if (designAreaRef.current) {
      // Adiciona um pequeno padding para garantir que a borda de seleção permaneça visível
      const padding = 2; // Largura da borda de seleção
      maxWidth = designAreaRef.current.offsetWidth - currentLeft - padding;
      maxHeight = designAreaRef.current.offsetHeight - currentTop - padding;
    }
    
    // Garante que a largura não exceda o máximo permitido
    newWidth = Math.min(newWidth, maxWidth);
    
    // Calcula a altura mantendo o aspect ratio
    newHeight = newWidth / aspectRatio;
    
    // Se a altura exceder o máximo permitido, recalcula baseado na altura
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }
    
    // Aplica as novas dimensões
    image.style.width = `${newWidth}px`;
    image.style.height = `${newHeight}px`;

    // Calcula a rotação
    const currentPinchAngle = Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    ) * (180 / Math.PI);
    const deltaAngle = currentPinchAngle - initialPinchAngle;
    const newRotation = initialRotateAngle + deltaAngle;
    container.dataset.rotateAngle = String(newRotation);
    container.style.transform = `rotate(${newRotation}deg)`;
  };

  const pinchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      isPinching = false;
    }
  };

  container.addEventListener('touchstart', pinchStart, { passive: false });
  container.addEventListener('touchmove', pinchMove, { passive: false });
  container.addEventListener('touchend', pinchEnd, { passive: false });
};

const getAngle = (mouseX: number, mouseY: number, centerX: number, centerY: number): number => {
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const rad = Math.atan2(dy, dx);
  return rad * (180 / Math.PI);
};
