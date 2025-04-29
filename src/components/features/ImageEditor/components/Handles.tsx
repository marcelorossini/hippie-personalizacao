import React from 'react';
import { FaSync, FaExpand } from 'react-icons/fa';

interface HandleProps {
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
}

export const RotateHandle: React.FC<HandleProps> = ({ onMouseDown, className }) => (
    <div
        className={`rotate-handle ${className || ''}`}
        onMouseDown={onMouseDown}
    >
        <FaSync size={28} className='hidden lg:block'/>
    </div>
);

export const ResizeHandle: React.FC<HandleProps> = ({ onMouseDown, className }) => (
    <div
        className={`resize-handle ${className || ''}`}
        onMouseDown={onMouseDown}
    >
        <FaExpand size={28} className='hidden lg:block'/>
    </div>
);
