import React from 'react';
import { FaArrowRotateLeft } from "react-icons/fa6";

interface HandleProps {
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
}

export const RotateHandle: React.FC<HandleProps> = ({ onMouseDown, className }) => (
    <div
        className={`rotate-handle absolute top-0 right-0 w-10 h-10 cursor-pointer opacity-10 hover:opacity-100 transition items-center justify-center hidden lg:flex [.no-touch_&]:flex ${className || ''}`}
        onMouseDown={onMouseDown}
    >
        <FaArrowRotateLeft size={28} />
    </div>
);

export const ResizeHandle: React.FC<HandleProps> = ({ onMouseDown, className }) => (
    <div
        className={`resize-handle absolute bottom-0 right-0 w-10 h-10 cursor-pointer opacity-10 hover:opacity-100 transition items-center justify-center hidden lg:flex [.no-touch_&]:flex ${className || ''}`}
        onMouseDown={onMouseDown}
    >
        <FaArrowRotateLeft size={28} />
    </div>
);
