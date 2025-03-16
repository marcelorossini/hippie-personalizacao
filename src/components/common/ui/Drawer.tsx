'use client';

import { Drawer } from 'vaul';
import { ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';

interface VaulDrawerProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VaulDrawer({ children, open, onOpenChange }: VaulDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9999]" />
        <Drawer.Content className="bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none z-[9999]">
          <div className="p-4 bg-white relative">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Fechar drawer"
            >
              <IoClose size={24} className="text-gray-600" />
            </button>
            <div className="h-[90vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}