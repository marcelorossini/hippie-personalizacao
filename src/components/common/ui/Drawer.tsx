'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cva } from 'class-variance-authority';
import { IoClose } from 'react-icons/io5';
import { ReactNode } from 'react';

const DrawerContext = React.createContext<{ direction?: 'right' | 'top' | 'bottom' | 'left' }>({
  direction: 'right',
});

interface VaulDrawerProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  direction?: 'right' | 'top' | 'bottom' | 'left';
}

const drawerContentVariants = cva('fixed z-[9999] flex h-auto flex-col bg-white', {
  variants: {
    direction: {
      right: 'ml-0 right-0 rounded-l-[10px] inset-y-0 w-[400px]',
      top: 'mb-0 top-0 rounded-b-[10px] inset-x-0 h-[80vh]',
      bottom: 'mt-0 rounded-t-[10px] bottom-0 inset-x-0 h-[80vh]',
      left: 'mr-0 left-0 rounded-r-[10px] inset-y-0 w-[400px]',
    },
  },
  defaultVariants: {
    direction: 'right',
  },
});

export default function VaulDrawer({ children, open, onOpenChange, direction = 'right' }: VaulDrawerProps) {
  return (
    <DrawerContext.Provider value={{ direction }}>
      <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} direction={direction}>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay className="fixed inset-0 bg-black/40 z-[9999]" />
          <DrawerPrimitive.Content className={drawerContentVariants({ direction })}>
            <div className={`p-4 relative ${direction === 'bottom' || direction === 'top' ? 'h-[80vh]' : 'h-full'} overflow-y-auto`}>
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Fechar drawer"
              >
                <IoClose size={24} className="text-gray-600" />
              </button>
              {children}
            </div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    </DrawerContext.Provider>
  );
}