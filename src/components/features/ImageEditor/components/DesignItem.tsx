import React, { useRef, useEffect, useState } from 'react';
import { ResizeHandle, RotateHandle } from './Handles';
import {
    makeDraggable,
    makeResizable,
    makeRotatable,
    makePinchZoomable
} from '../utils/dragUtils';

interface DesignItemProps {
    id: string;
    imgSrc: string;
    designAreaRef: React.RefObject<HTMLDivElement | null>;
    isSelected: boolean;
    selectLayer: (layerId: string) => void;
    showContextMenu: (x: number, y: number) => void;
    sendLayerToBack: () => void;
    sendLayerToFront: () => void;
    removeLayer: () => void;
}

const DesignItem: React.FC<DesignItemProps> = ({
    id,
    imgSrc,
    designAreaRef,
    isSelected,
    selectLayer,
    showContextMenu,
    sendLayerToBack,
    sendLayerToFront,
    removeLayer,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const longPressTimerRef = useRef<number | null>(null);
    const [designAreaSize, setDesignAreaSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const [originalImageSize, setOriginalImageSize] = useState<{ width: number, height: number } | null>(null);
    const [userDefinedSize, setUserDefinedSize] = useState<{ width: number, height: number } | null>(null);
    const [userDefinedPosition, setUserDefinedPosition] = useState<{ top: number, left: number } | null>(null);
    const [isUserModified, setIsUserModified] = useState(false);
    const [currentScale, setCurrentScale] = useState(1);

    // Função para calcular o tamanho ideal da imagem
    const calculateIdealImageSize = (designWidth: number, designHeight: number, imgWidth: number, imgHeight: number) => {
        const imageAspectRatio = imgWidth / imgHeight;
        const maxHeight = designHeight * 0.7;
        let finalHeight = maxHeight;
        let finalWidth = finalHeight * imageAspectRatio;
        
        if (finalWidth > designWidth) {
            finalWidth = designWidth;
            finalHeight = finalWidth / imageAspectRatio;
            
            if (finalHeight > maxHeight) {
                finalHeight = designHeight * 0.5;
                finalWidth = finalHeight * imageAspectRatio;
            }
        }
        
        return { width: finalWidth, height: finalHeight };
    };

    // Efeito para carregar a imagem e calcular dimensões iniciais
    useEffect(() => {
        if (designAreaRef.current) {
            const designArea = designAreaRef.current;
            const newWidth = designArea.clientWidth;
            const newHeight = designArea.clientHeight;
            
            const img = new Image();
            img.src = imgSrc;
            
            img.onload = () => {
                // Armazena as dimensões originais da imagem
                setOriginalImageSize({ width: img.width, height: img.height });
                
                // Calcula o tamanho ideal inicial
                const idealSize = calculateIdealImageSize(newWidth, newHeight, img.width, img.height);
                
                // Calcula a posição central
                const topPosition = (newHeight - idealSize.height) / 2;
                const leftPosition = (newWidth - idealSize.width) / 2;
                
                setDesignAreaSize({
                    width: newWidth,
                    height: newHeight
                });
                
                setPosition({
                    top: topPosition,
                    left: leftPosition
                });
                
                // Atualiza o tamanho da imagem
                const imageElement = containerRef.current?.querySelector('.design-image') as HTMLImageElement;
                if (imageElement) {
                    imageElement.style.height = `${idealSize.height}px`;
                    imageElement.style.width = `${idealSize.width}px`;
                }
            };
        }
    }, [designAreaRef, imgSrc]);

    // Efeito para lidar com o redimensionamento da janela
    useEffect(() => {
        const handleResize = () => {
            if (designAreaRef.current && containerRef.current) {
                const designArea = designAreaRef.current;
                const container = containerRef.current;
                const image = container.querySelector('.design-image') as HTMLImageElement;
                
                if (!image) return;
                
                const newWidth = designArea.clientWidth;
                const newHeight = designArea.clientHeight;
                
                // Se o usuário já modificou a imagem, mantém as proporções relativas
                if (isUserModified && userDefinedSize) {
                    // Calcula a proporção relativa da largura e altura em relação à área de design
                    const widthRatio = userDefinedSize.width / designAreaSize.width;
                    const heightRatio = userDefinedSize.height / designAreaSize.height;
                    
                    // Aplica as mesmas proporções à nova área de design
                    const newImageWidth = newWidth * widthRatio;
                    const newImageHeight = newHeight * heightRatio;
                    
                    // Atualiza o tamanho da imagem
                    image.style.width = `${newImageWidth}px`;
                    image.style.height = `${newImageHeight}px`;
                    
                    // Atualiza o tamanho definido pelo usuário
                    setUserDefinedSize({
                        width: newImageWidth,
                        height: newImageHeight
                    });
                } else if (originalImageSize) {
                    // Se o usuário não modificou, calcula o tamanho ideal
                    const idealSize = calculateIdealImageSize(
                        newWidth, 
                        newHeight, 
                        originalImageSize.width, 
                        originalImageSize.height
                    );
                    
                    // Atualiza o tamanho da imagem
                    image.style.width = `${idealSize.width}px`;
                    image.style.height = `${idealSize.height}px`;
                }
                
                // Ajusta a posição para manter a proporção relativa
                const currentLeft = parseFloat(container.style.left) || 0;
                const currentTop = parseFloat(container.style.top) || 0;
                
                const relativeLeft = currentLeft / designAreaSize.width;
                const relativeTop = currentTop / designAreaSize.height;
                
                const newLeft = relativeLeft * newWidth;
                const newTop = relativeTop * newHeight;
                
                container.style.left = `${newLeft}px`;
                container.style.top = `${newTop}px`;
                
                // Se o usuário já modificou a posição, atualiza a posição definida pelo usuário
                if (isUserModified && userDefinedPosition) {
                    setUserDefinedPosition({
                        top: newTop,
                        left: newLeft
                    });
                }
                
                setDesignAreaSize({
                    width: newWidth,
                    height: newHeight
                });
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [designAreaRef, designAreaSize, originalImageSize, isUserModified, userDefinedSize, userDefinedPosition]);

    // Efeito para aplicar as funcionalidades de drag, resize, rotate e pinch-zoom
    useEffect(() => {
        if (containerRef.current) {
            // Aplica as funcionalidades de drag, resize, rotate e pinch‑zoom
            makeDraggable(containerRef.current, designAreaRef);
            const imgEl = containerRef.current.querySelector('img');
            const resizeHandleEl = containerRef.current.querySelector('.resize-handle');
            if (imgEl instanceof HTMLImageElement && resizeHandleEl instanceof HTMLElement) {
                makeResizable(containerRef.current, imgEl, resizeHandleEl, designAreaRef);
            }
            const rotateHandleEl = containerRef.current.querySelector('.rotate-handle');
            if (rotateHandleEl instanceof HTMLElement) {
                makeRotatable(containerRef.current, rotateHandleEl);
            }
            if (imgEl instanceof HTMLImageElement) {
                makePinchZoomable(containerRef.current, imgEl, designAreaRef);
            }
        }
    }, [designAreaRef]);

    // Efeito para detectar mudanças na posição e tamanho definidos pelo usuário
    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const image = container.querySelector('.design-image') as HTMLImageElement;
            
            if (!image) return;
            
            // Observa mudanças no tamanho e posição
            const resizeObserver = new ResizeObserver(() => {
                const currentWidth = image.offsetWidth;
                const currentHeight = image.offsetHeight;
                const currentLeft = parseFloat(container.style.left) || 0;
                const currentTop = parseFloat(container.style.top) || 0;
                
                // Verifica se houve mudança em relação ao tamanho inicial
                if (originalImageSize && 
                    (currentWidth !== originalImageSize.width || 
                     currentHeight !== originalImageSize.height)) {
                    setIsUserModified(true);
                    setUserDefinedSize({
                        width: currentWidth,
                        height: currentHeight
                    });
                }
                
                // Verifica se houve mudança na posição
                if (position && 
                    (currentLeft !== position.left || 
                     currentTop !== position.top)) {
                    setIsUserModified(true);
                    setUserDefinedPosition({
                        top: currentTop,
                        left: currentLeft
                    });
                }
            });
            
            resizeObserver.observe(container);
            
            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [containerRef, originalImageSize, position]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        e.preventDefault();
        e.stopPropagation();
        console.log(e)
        if (
            target.classList.contains('resize-handle') ||
            target.classList.contains('rotate-handle')
        ) {
            return;
        }
        selectLayer(id);
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        selectLayer(id);
        showContextMenu(e.pageX, e.pageY);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        e.stopPropagation();
        if (
            target.classList.contains('resize-handle') ||
            target.classList.contains('rotate-handle')
        ) {
            return;
        }
        selectLayer(id);
        if (e.touches.length === 1) {
            longPressTimerRef.current = window.setTimeout(() => {
                selectLayer(id);
                sendLayerToBack();
            }, 700);
        }
    };

    const clearLongPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const handleTouchEnd = () => clearLongPress();
    const handleTouchMove = () => clearLongPress();

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
            className={`design-item cursor-move transform origin-center border-3 border-dashed inline-flex ${
                isSelected ? 'border-blue-500 z-50' : 'border-transparent'
            }`}
            data-rotate-angle="0"
            data-layer-id={id}
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
        >
            <img
                src={imgSrc}
                alt="Design"
                draggable={false}
                className="design-image select-none"
            />
            <ResizeHandle />
            <RotateHandle />
        </div>
    );
};

export default DesignItem;
