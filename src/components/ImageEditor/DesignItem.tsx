import React, { useRef, useEffect } from 'react';
import { ResizeHandle, RotateHandle } from './Handles';
import {
    makeDraggable,
    makeResizable,
    makeRotatable,
    makePinchZoomable,
} from './utils/dragUtils';

interface DesignItemProps {
    id: string;
    imgSrc: string;
    designAreaRef: React.RefObject<HTMLDivElement>;
    isSelected: boolean;
    selectLayer: (layerId: string) => void;
    showContextMenu: (x: number, y: number) => void;
    sendLayerToBack: () => void;
}

const DesignItem: React.FC<DesignItemProps> = ({
    id,
    imgSrc,
    designAreaRef,
    isSelected,
    selectLayer,
    showContextMenu,
    sendLayerToBack,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const longPressTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Aplica as funcionalidades de drag, resize, rotate e pinch‑zoom
            makeDraggable(containerRef.current, designAreaRef);
            const imgEl = containerRef.current.querySelector('img') as HTMLImageElement;
            const resizeHandleEl = containerRef.current.querySelector('.resize-handle') as HTMLElement;
            if (imgEl && resizeHandleEl) {
                makeResizable(containerRef.current, imgEl, resizeHandleEl, designAreaRef);
            }
            const rotateHandleEl = containerRef.current.querySelector('.rotate-handle') as HTMLElement;
            if (rotateHandleEl) {
                makeRotatable(containerRef.current, rotateHandleEl);
            }
            if (imgEl) {
                makePinchZoomable(containerRef.current, imgEl, designAreaRef);
            }
        }
    }, [designAreaRef]);

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
            className="design-item absolute cursor-move top-12 left-12 transform origin-center"
            data-rotate-angle="0"
            data-layer-id={id}
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
        >
            {/* Borda de seleção */}
            <div className={`absolute inset-0 border-3 border-dashed pointer-events-none ${isSelected ? 'border-blue-500 z-50' : 'border-transparent'}`} />
            
            {/* Conteúdo da camada */}
            <div className="relative">
                <img
                    src={imgSrc}
                    alt="Design"
                    draggable={false}
                    className="design-image select-none"
                    style={{ height: '200px', width: 'auto' }}
                />
                {isSelected && (
                    <>
                        <ResizeHandle />
                        <RotateHandle />
                    </>
                )}
            </div>
        </div>
    );
};

export default DesignItem;
