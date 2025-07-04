import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, AlertTriangle } from 'lucide-react';

// Modal 類型定義
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
};

// 背景遮罩元件
const Backdrop = ({ onClick }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
    onClick={onClick}
  />
);

// 主要 Modal 元件
const Modal = ({ modal, onClose, onConfirm }) => {
  const { icon: Icon, iconColor, confirmColor } = MODAL_TYPES[modal.type];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleConfirm = () => {
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
            {modal.showCancel && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                {modal.cancelText || '取消'}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${confirmColor}`}
            >
              {modal.confirmText || '確認'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Modal Hook
const useModal = () => {
  const [modal, setModal] = useState(null);

  const closeModal = () => {
    setModal(null);
  };

  const showModal = (options) => {
    setModal(options);
  };

  // 成功提示
  const success = (title, message, options = {}) => {
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
  const error = (title, message, options = {}) => {
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
  const warning = (title, message, options = {}) => {
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
  const confirm = (title, message, options = {}) => {
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

// 示範用的主元件
export default function ModalDemo() {
  const { modal, closeModal, success, error, warning, confirm } = useModal();

  const handleCreate = () => {
    success('新增成功', '資料已成功新增到系統中，您可以在列表中查看新增的項目。');
  };

  const handleUpdate = () => {
    success('修改成功', '資料已成功更新，所有變更已儲存。');
  };

  const handleDelete = async () => {
    const result = await confirm(
      '確認刪除',
      '您確定要刪除這筆資料嗎？此動作無法復原。'
    );
    
    if (result) {
      success('刪除成功', '資料已成功刪除。');
    }
  };

  const handleError = () => {
    error('操作失敗', '由於網路連線問題，操作無法完成。請檢查您的網路連線後再試一次。');
  };

  const handleWarning = () => {
    warning('注意事項', '此操作將影響相關聯的資料，請確認您了解可能的影響。');
  };

  const handleConfirmAction = async () => {
    const result = await confirm(
      '確認執行',
      '您確定要執行此操作嗎？這將會影響系統設定。'
    );
    
    if (result) {
      success('執行成功', '操作已成功完成。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">互動式彈跳視窗示範</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">測試不同類型的對話框</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleCreate}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              新增成功提示
            </button>
            
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              修改成功提示
            </button>
            
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              刪除確認對話框
            </button>
            
            <button
              onClick={handleError}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              錯誤提示
            </button>
            
            <button
              onClick={handleWarning}
              className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              警告提示
            </button>
            
            <button
              onClick={handleConfirmAction}
              className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              確認執行對話框
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">使用方法</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">success('標題', '訊息')</code>
              <p className="mt-1">顯示成功提示，只有確認按鈕</p>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">error('標題', '訊息')</code>
              <p className="mt-1">顯示錯誤提示，只有確認按鈕</p>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">const result = await confirm('標題', '訊息')</code>
              <p className="mt-1">顯示確認對話框，返回 true/false</p>
            </div>
          </div>
        </div>
      </div>
      
      {modal && (
        <Modal 
          modal={modal} 
          onClose={closeModal} 
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
}