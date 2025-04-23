import React from 'react';
import VaulDrawer from '../../../common/ui/Drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useMediaQuery } from '@/hooks/use-media-query';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  buttons: ButtonProps[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  buttons,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const renderButtons = () => (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`w-full py-4 px-6 font-bold rounded-md transition-colors ${
            button.variant === 'primary'
              ? 'bg-[#74a451] text-white hover:bg-[#5d8a40]'
              : 'bg-white text-[#74a451] border-2 border-[#74a451] hover:bg-gray-50'
          }`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="bg-white/80 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            {renderButtons()}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <VaulDrawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <div className="flex flex-col items-center gap-6 p-6 bg-white/80 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {title}
        </h2>
        {renderButtons()}
      </div>
    </VaulDrawer>
  );
};

export default ConfirmationModal; 