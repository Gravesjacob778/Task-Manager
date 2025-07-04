"use client"
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, AlertTriangle } from 'lucide-react';

// 定義 Modal 類型
type ModalType = 'success' | 'error' | 'warning' | 'confirm';

// 定義 Modal 資料的型別
interface ModalData {
  type: ModalType;
  title: string;
  message: string;
  showCancel: boolean;
  confirmText: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 定義 Modal Props 型別
interface ModalProps {
  modal: ModalData | null;
  onClose: () => void;
  onConfirm?: () => void;
}

// 定義 Backdrop Props 型別
interface BackdropProps {
  onClick: () => void;
}

// Modal 類型設定
const MODAL_TYPES = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    confirmColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-500',
    confirmColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    confirmColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  },
  confirm: {
    icon: AlertCircle,
    iconColor: 'text-blue-500',
    confirmColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
} as const;

// 背景遮罩元件
const Backdrop: React.FC<BackdropProps> = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
    onClick={onClick}
  />
);

// 主要 Modal 元件
const Modal: React.FC<ModalProps> = ({ modal, onClose, onConfirm }) => {
  useEffect(() => {
    if (!modal) return;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // 防止背景滾動

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modal, onClose]);

  if (!modal) return null;

  const { icon: Icon, iconColor, confirmColor } = MODAL_TYPES[modal.type];

  const handleConfirm = (): void => {
    console.log('Modal confirmed');
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
          {/* 標題區域 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Icon className={`${iconColor} w-6 h-6`} />
              <h3 className="text-lg font-semibold text-gray-900">
                {modal.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 內容區域 */}
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              {modal.message}
            </p>
          </div>

          {/* 按鈕區域 */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${confirmColor}`}
            >
              {modal.confirmText || '確認'}
            </button>
            {modal.showCancel && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                {modal.cancelText || '取消'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
