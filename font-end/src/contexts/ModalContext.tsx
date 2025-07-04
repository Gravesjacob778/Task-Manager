"use client"
import React, { createContext, useContext, ReactNode } from 'react';
import Modal from '../components/modal/modal';
import { useModal } from '@/hooks/useModal';
// 定義 Modal 選項的型別
interface ModalOptions {
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 定義 Modal 資料的型別
interface ModalData {
  type: 'success' | 'error' | 'warning' | 'confirm';
  title: string;
  message: string;
  showCancel: boolean;
  confirmText: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 定義 Modal 方法的型別
interface ModalMethods {
  modal: ModalData | null;
  closeModal: () => void;
  success: (title: string, message: string, options?: ModalOptions) => void;
  error: (title: string, message: string, options?: ModalOptions) => void;
  warning: (title: string, message: string, options?: ModalOptions) => void;
  confirm: (title: string, message: string, options?: ModalOptions) => Promise<boolean>;
}

// 創建 Context
const ModalContext = createContext<ModalMethods | undefined>(undefined);

// Provider 元件的 Props 型別
interface ModalProviderProps {
  children: ReactNode;
}

// ModalProvider 元件
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const modalMethods = useModal();
  
  return (
    <ModalContext.Provider value={modalMethods}>
      {children}
      <Modal 
        modal={modalMethods.modal} 
        onClose={modalMethods.closeModal} 
        onConfirm={modalMethods.modal?.onConfirm}
      />
    </ModalContext.Provider>
  );
};

// 自定義 Hook
export const useGlobalModal = (): ModalMethods => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within ModalProvider');
  }
  return context;
};
