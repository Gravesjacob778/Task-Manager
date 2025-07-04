import { useState } from 'react';

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

// 定義回傳型別
interface UseModalReturn {
  modal: ModalData | null;
  closeModal: () => void;
  success: (title: string, message: string, options?: ModalOptions) => void;
  error: (title: string, message: string, options?: ModalOptions) => void;
  warning: (title: string, message: string, options?: ModalOptions) => void;
  confirm: (title: string, message: string, options?: ModalOptions) => Promise<boolean>;
}

const useModal = (): UseModalReturn => {
  const [modal, setModal] = useState<ModalData | null>(null);

  const closeModal = (): void => {
    setModal(null);
  };

  const showModal = (options: ModalData): void => {
    setModal(options);
  };

  // 成功提示
  const success = (title: string, message: string, options: ModalOptions = {}): void => {
    showModal({
      type: 'success',
      title,
      message,
      showCancel: false,
      confirmText: '確認',
      ...options
    });
  };

  // 錯誤提示
  const error = (title: string, message: string, options: ModalOptions = {}): void => {
    showModal({
      type: 'error',
      title,
      message,
      showCancel: false,
      confirmText: '確認',
      ...options
    });
  };

  // 警告提示
  const warning = (title: string, message: string, options: ModalOptions = {}): void => {
    showModal({
      type: 'warning',
      title,
      message,
      showCancel: false,
      confirmText: '確認',
      ...options
    });
  };

  // 確認對話框
  const confirm = (title: string, message: string, options: ModalOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      showModal({
        type: 'confirm',
        title,
        message,
        showCancel: true,
        confirmText: '確認',
        cancelText: '取消',
        ...options,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  };

  return {
    modal,
    closeModal,
    success,
    error,
    warning,
    confirm
  };
};

export { useModal };