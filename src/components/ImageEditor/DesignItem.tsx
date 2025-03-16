import React, { useRef, useEffect, useState } from 'react';
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

    useEffect(() => {
        if (designAreaRef.current) {
            const designArea = designAreaRef.current;
            const newWidth = designArea.clientWidth;
            const newHeight = designArea.clientHeight;
            
            setDesignAreaSize({
                width: newWidth,
                height: newHeight
            });

            // Calcula a posição central
            setPosition({
                top: (newHeight - (newWidth * 0.7)) / 2,
                left: newWidth / 4  // Centraliza horizontalmente considerando que a imagem terá width: auto
            });
        }
    }, [designAreaRef]);

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
                className="design-image select-none w-auto h-auto"
                style={{ height: `${designAreaSize.width * 0.7}px`, width: 'auto' }}
            />
            <ResizeHandle />
            <RotateHandle />
        </div>
    );
};

export default DesignItem;
