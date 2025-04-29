import React, { useRef, useEffect, useState } from 'react';
import { ResizeHandle, RotateHandle } from './Handles';
import {
    makeDraggable,
    makeResizable,
    makeRotatable,
    makePinchZoomable
} from '../utils/dragUtils';
import { Layer } from '../types';
import './DesignItem.css';
import LayerOptionsPopover from './LayerOptionsPopover';

interface DesignItemProps {
    id: string;
    layer: Layer;
    designAreaRef: React.RefObject<HTMLDivElement | null>;
    isSelected: boolean;
    selectLayer: (layerId: string) => void;
    sendLayerToBack: () => void;
    sendLayerToFront: () => void;
    removeLayer: () => void;
    onEditText?: () => void;
}

const DesignItem: React.FC<DesignItemProps> = ({
    id,
    layer,
    designAreaRef,
    isSelected,
    selectLayer,
    sendLayerToBack,
    sendLayerToFront,
    removeLayer,
    onEditText
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const longPressTimerRef = useRef<number | null>(null);
    const [designAreaSize, setDesignAreaSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const [originalSize, setOriginalSize] = useState<{ width: number, height: number } | null>(null);
    const [userDefinedSize, setUserDefinedSize] = useState<{ width: number, height: number } | null>(null);
    const [userDefinedPosition, setUserDefinedPosition] = useState<{ top: number, left: number } | null>(null);
    const [isUserModified, setIsUserModified] = useState(false);
    const [currentScale, setCurrentScale] = useState(1);
    const [popoverPosition, setPopoverPosition] = useState<{ top: number, left: number } | null>(null);
    const [popoverWidth, setPopoverWidth] = useState(0);

    // Função para calcular o tamanho ideal do elemento
    const calculateIdealSize = (designWidth: number, designHeight: number, elementWidth: number, elementHeight: number) => {
        const aspectRatio = elementWidth / elementHeight;
        
        // Define o tamanho máximo como 70% da área de design
        const maxWidth = designWidth * 0.7;
        const maxHeight = designHeight * 0.7;
        
        // Calcula as dimensões mantendo o aspect ratio
        let finalWidth = maxWidth;
        let finalHeight = finalWidth / aspectRatio;
        
        // Se a altura exceder o máximo, recalcula baseado na altura
        if (finalHeight > maxHeight) {
            finalHeight = maxHeight;
            finalWidth = finalHeight * aspectRatio;
        }
        
        // Se ainda assim a largura exceder o máximo, reduz para 50% da área de design
        if (finalWidth > maxWidth) {
            finalWidth = designWidth * 0.5;
            finalHeight = finalWidth / aspectRatio;
            
            // Se a altura ainda exceder o máximo, recalcula baseado na altura
            if (finalHeight > maxHeight) {
                finalHeight = designHeight * 0.5;
                finalWidth = finalHeight * aspectRatio;
            }
        }
        
        return { width: finalWidth, height: finalHeight };
    };

    // Efeito para carregar o elemento e calcular dimensões iniciais
    useEffect(() => {
        if (designAreaRef.current) {
            const designArea = designAreaRef.current;
            const newWidth = designArea.clientWidth;
            const newHeight = designArea.clientHeight;
            
            if (layer.type === 'text') {
                // Para texto, usamos um tamanho inicial padrão
                const initialSize = {
                    width: 200,
                    height: 50
                };
                
                setOriginalSize(initialSize);
                
                // Calcula a posição central
                const topPosition = (newHeight - initialSize.height) / 2;
                const leftPosition = (newWidth - initialSize.width) / 2;
                
                setDesignAreaSize({
                    width: newWidth,
                    height: newHeight
                });
                
                setPosition({
                    top: topPosition,
                    left: leftPosition
                });
                
                // Atualiza o tamanho do elemento
                const textElement = containerRef.current?.querySelector('.design-text') as HTMLDivElement;
                if (textElement) {
                    textElement.style.height = `${initialSize.height}px`;
                    textElement.style.width = `${initialSize.width}px`;
                }
            } else if (layer.imgSrc) {
                // Para imagens, carregamos a imagem e calculamos o tamanho
                const img = new Image();
                img.src = layer.imgSrc;
                
                img.onload = () => {
                    setOriginalSize({ width: img.width, height: img.height });
                    
                    const idealSize = calculateIdealSize(newWidth, newHeight, img.width, img.height);
                    
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
                    
                    const imageElement = containerRef.current?.querySelector('.design-image') as HTMLImageElement;
                    if (imageElement) {
                        imageElement.style.height = `${idealSize.height}px`;
                        imageElement.style.width = `${idealSize.width}px`;
                    }
                };
            }
        }
    }, [designAreaRef, layer]);

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
                    
                    // Calcula o aspect ratio original da imagem
                    const imageAspectRatio = userDefinedSize.width / userDefinedSize.height;
                    
                    // Aplica as mesmas proporções à nova área de design
                    let newImageWidth = newWidth * widthRatio;
                    let newImageHeight = newHeight * heightRatio;
                    
                    // Garante que o aspect ratio seja mantido
                    if (Math.abs(newImageWidth / newImageHeight - imageAspectRatio) > 0.01) {
                        // Se o aspect ratio foi perdido, recalcula baseado na largura
                        newImageHeight = newImageWidth / imageAspectRatio;
                        
                        // Se a altura exceder o limite, recalcula baseado na altura
                        if (newImageHeight > newHeight * 0.8) {
                            newImageHeight = newHeight * 0.8;
                            newImageWidth = newImageHeight * imageAspectRatio;
                        }
                    }
                    
                    // Atualiza o tamanho da imagem
                    image.style.width = `${newImageWidth}px`;
                    image.style.height = `${newImageHeight}px`;
                    
                    // Atualiza o tamanho definido pelo usuário
                    setUserDefinedSize({
                        width: newImageWidth,
                        height: newImageHeight
                    });
                } else if (originalSize) {
                    // Se o usuário não modificou, calcula o tamanho ideal
                    const idealSize = calculateIdealSize(
                        newWidth, 
                        newHeight, 
                        originalSize.width, 
                        originalSize.height
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
    }, [designAreaRef, designAreaSize, originalSize, isUserModified, userDefinedSize, userDefinedPosition]);

    // Efeito para aplicar as funcionalidades de drag, resize, rotate e pinch-zoom
    useEffect(() => {
        if (containerRef.current) {
            // Aplica as funcionalidades de drag e pinch-zoom
            makeDraggable(containerRef.current, designAreaRef);
            const imgEl = containerRef.current.querySelector('img');
            if (imgEl instanceof HTMLImageElement) {
                makePinchZoomable(containerRef.current, imgEl, designAreaRef);
            }
            
            // Aplica as funcionalidades de resize e rotate
            const resizeHandle = containerRef.current.querySelector('.resize-handle');
            const rotateHandle = containerRef.current.querySelector('.rotate-handle');
            
            if (resizeHandle instanceof HTMLElement && imgEl instanceof HTMLImageElement) {
                makeResizable(containerRef.current, imgEl, resizeHandle, designAreaRef);
            }
            
            if (rotateHandle instanceof HTMLElement) {
                makeRotatable(containerRef.current, rotateHandle);
            }
        }
    }, [designAreaRef, isSelected]);

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
                if (originalSize && 
                    (currentWidth !== originalSize.width || 
                     currentHeight !== originalSize.height)) {
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
    }, [containerRef, originalSize, position]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        e.preventDefault();
        e.stopPropagation();
        
        // Não seleciona a camada se o clique foi em um dos controles
        if (
            target.classList.contains('resize-handle') ||
            target.classList.contains('rotate-handle')
        ) {
            return;
        }
        
        selectLayer(id);
        
        // Adiciona listeners para atualizar a posição do popover durante o arrasto
        const handleMouseMove = () => {
            updatePopoverPosition();
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
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
            
            // Adiciona listeners para atualizar a posição do popover durante o arrasto
            const handleTouchMove = () => {
                updatePopoverPosition();
            };
            
            const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        } else if (e.touches.length === 2) {
            // Toque duplo para enviar para frente
            longPressTimerRef.current = window.setTimeout(() => {
                selectLayer(id);
                sendLayerToFront();
            }, 300);
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

    // Adicionando função para remover camada com atalho de teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSelected && e.key === 'Delete') {
                removeLayer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSelected, removeLayer]);

    // Função para atualizar a posição do popover
    const updatePopoverPosition = () => {
        if (containerRef.current && isSelected) {
            const rect = containerRef.current.getBoundingClientRect();
            setPopoverPosition({
                top: rect.top - 40, // 40px acima da layer
                left: rect.left + (rect.width / 2) - (popoverWidth / 2) // Centralizado horizontalmente
            });
        } else {
            setPopoverPosition(null);
        }
    };

    // Atualiza a posição do popover quando o item é selecionado ou movido
    useEffect(() => {
        if (isSelected) {
            updatePopoverPosition();
            
            // Adiciona um listener para atualizar a posição quando a janela é redimensionada
            window.addEventListener('resize', updatePopoverPosition);
            window.addEventListener('scroll', updatePopoverPosition);
            
            // Adiciona um MutationObserver para detectar mudanças no estilo do elemento
            if (containerRef.current) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            (mutation.attributeName === 'style' || 
                             mutation.attributeName === 'class')) {
                            updatePopoverPosition();
                        }
                    });
                });
                
                observer.observe(containerRef.current, { 
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
                
                return () => {
                    observer.disconnect();
                    window.removeEventListener('resize', updatePopoverPosition);
                    window.removeEventListener('scroll', updatePopoverPosition);
                };
            }
        } else {
            setPopoverPosition(null);
        }
    }, [isSelected, position]);

    // Atualiza a posição quando a largura do popover mudar
    useEffect(() => {
        updatePopoverPosition();
    }, [popoverWidth]);

    return (
        <div
            ref={containerRef}
            className={`design-item ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: `scale(${currentScale})`,
                transformOrigin: 'center center'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
        >
            {layer.type === 'text' ? (
                <div className="design-text" style={{ 
                    fontSize: `${layer.fontSize}px`,
                    fontFamily: layer.fontFamily,
                    color: layer.color
                }}>
                    {layer.text}
                </div>
            ) : (
                <img
                    src={layer.imgSrc}
                    alt={layer.name}
                    className="design-image"
                    draggable={false}
                />
            )}

            {isSelected && (
                <>
                    <ResizeHandle />
                    <RotateHandle />
                </>
            )}
            
            {/* Renderiza o popover como um portal fora do design-area */}
            {isSelected && popoverPosition && (
                <LayerOptionsPopover
                    layer={layer}
                    position={popoverPosition}
                    onEditText={onEditText}
                    onSendToFront={sendLayerToFront}
                    onSendToBack={sendLayerToBack}
                    onRemove={removeLayer}
                    onWidthChange={setPopoverWidth}
                />
            )}
        </div>
    );
};

export default DesignItem;
