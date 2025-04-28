import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Layer } from '../types';

interface LayerOptionsPopoverProps {
  layer: Layer;
  position: { top: number; left: number };
  onEditText?: () => void;
  onSendToFront: () => void;
  onSendToBack: () => void;
  onRemove: () => void;
  onWidthChange?: (width: number) => void;
}

const LayerOptionsPopover: React.FC<LayerOptionsPopoverProps> = ({
  layer,
  position,
  onEditText,
  onSendToFront,
  onSendToBack,
  onRemove,
  onWidthChange
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (popoverRef.current && onWidthChange) {
      onWidthChange(popoverRef.current.offsetWidth);
    }
  }, [layer.type, onWidthChange]);

  // Calcula a posição do popover
  const popoverPosition = {
    top: position.top,
    left: position.left
  };

  return createPortal(
    <div 
      ref={popoverRef}
      className="layer-options-popover"
      style={{
        position: 'fixed',
        top: `${popoverPosition.top - 10}px`,
        left: `${popoverPosition.left}px`,
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        padding: '4px',
        display: 'flex',
        gap: '4px'
      }}
    >
      {layer.type === 'text' && onEditText && (
        <button
          className="layer-option-btn edit"
          onClick={(e) => {
            e.stopPropagation();
            onEditText();
          }}
          title="Editar texto"
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4b5563',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e0f2fe';
            e.currentTarget.style.color = '#0284c7';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#4b5563';
          }}
        >
          <FaEdit />
        </button>
      )}
      <button
        className="layer-option-btn"
        onClick={(e) => {
          e.stopPropagation();
          onSendToFront();
        }}
        title="Trazer para frente"
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          backgroundColor: 'transparent',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#4b5563',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <FaArrowUp />
      </button>
      <button
        className="layer-option-btn"
        onClick={(e) => {
          e.stopPropagation();
          onSendToBack();
        }}
        title="Enviar para trás"
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          backgroundColor: 'transparent',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#4b5563',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <FaArrowDown />
      </button>
      <button
        className="layer-option-btn delete"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title="Excluir camada"
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          backgroundColor: 'transparent',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#4b5563',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#fee2e2';
          e.currentTarget.style.color = '#ef4444';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#4b5563';
        }}
      >
        <FaTrash />
      </button>
    </div>,
    document.body
  );
};

export default LayerOptionsPopover; 