import React from 'react';
import { FaArrowRotateLeft } from "react-icons/fa6";

interface HandleProps {
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}


export const RotateHandle: React.FC<HandleProps> = ({ onMouseDown }) => (
    <div
        className="rotate-handle absolute top-0 right-0 w-10 h-10 cursor-pointer opacity-10 hover:opacity-100 transition flex items-center justify-center"
        onMouseDown={onMouseDown}
    >
        <FaArrowRotateLeft size={28} />
    </div>
);

export const ResizeHandle: React.FC<HandleProps> = ({ onMouseDown }) => (
    <div
        className="resize-handle absolute bottom-0 right-0 w-10 h-10 cursor-pointer opacity-10 hover:opacity-100 transition flex items-center justify-center"
        onMouseDown={onMouseDown}
    >
        <FaArrowRotateLeft size={28} />
    </div>
);
