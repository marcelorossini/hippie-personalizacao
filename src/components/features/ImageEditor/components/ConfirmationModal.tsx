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
  disabled?: boolean;
}

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  buttons: ButtonProps[];
  children?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  buttons,
  children,
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const renderButtons = () => (
    <div className={`flex ${isDesktop ? 'flex-row gap-4' : 'flex-col gap-4'} w-full ${isDesktop ? 'max-w-none' : 'max-w-full'}`}>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.disabled}
          className={`${isDesktop ? 'flex-1' : 'w-full'} py-4 px-6 font-bold rounded-md transition-colors ${
            button.variant === 'primary'
              ? 'bg-[#74a451] text-white hover:bg-[#5d8a40] disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-white text-[#74a451] border-2 border-[#74a451] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
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
        <DialogOverlay className="" />
        <DialogContent className="sm:max-w-[600px] bg-white shadow-lg rounded-lg flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
          <div className="border-t border-gray-200 pt-4">
            {renderButtons()}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <VaulDrawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <div className="flex flex-col h-full bg-white/80 backdrop-blur-sm">
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {title}
          </h2>
          {children}
        </div>
        <div className="border-t border-gray-200 pt-4 px-4">
          {renderButtons()}
        </div>
      </div>
    </VaulDrawer>
  );
};

export default ConfirmationModal; 