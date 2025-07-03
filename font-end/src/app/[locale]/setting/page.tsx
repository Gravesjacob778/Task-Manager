'use client';
import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Clock, 
  Globe, 
  Shield, 
  Download,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ChevronRight,
  Save,
  RotateCcw
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 個人設定
    username: 'DeadpoolUser',
    email: 'test@example.com',
    
    // 外觀設定
    theme: 'dark',
    accentColor: 'cyan',
    animations: true,
    
    // 通知設定
    notifications: true,
    soundEnabled: true,
    emailNotifications: false,
    
    // 日曆設定
    startOfWeek: 'sunday',
    timeFormat: '24h',
    language: 'zh-TW',
    
    // 隱私設定
    dataSharing: false,
    analytics: true
  });

  const [activeSection, setActiveSection] = useState('profile');

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    // 這裡可以重置到預設值
    console.log('重置設定');
  };

  const saveSettings = () => {
    // 這裡可以儲存設定
    console.log('儲存設定', settings);
  };

  const accentColors = {
    cyan: 'from-cyan-400 to-blue-500',
    purple: 'from-purple-400 to-pink-500',
    green: 'from-green-400 to-emerald-500',
    orange: 'from-orange-400 to-red-500'
  };

  const sections = [
    { id: 'profile', label: '個人資料', icon: User },
    { id: 'appearance', label: '外觀', icon: Palette },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'calendar', label: '日曆', icon: Clock },
    { id: 'privacy', label: '隱私', icon: Shield },
    { id: 'data', label: '資料', icon: Download }
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-800/50 rounded-lg transition-colors group">
      <div>
        <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
          {label}
        </div>
        {description && (
          <div className="text-sm text-gray-400 mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          enabled ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gray-700'
        } hover:scale-105`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${
            enabled ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  const SelectOption = ({ value, onChange, options, label, description }) => (
    <div className="p-4 hover:bg-gray-800/50 rounded-lg transition-colors group">
      <div className="font-medium text-white group-hover:text-cyan-400 transition-colors mb-2">
        {label}
      </div>
      {description && (
        <div className="text-sm text-gray-400 mb-3">{description}</div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const InputField = ({ value, onChange, label, description, type = "text" }) => (
    <div className="p-4 hover:bg-gray-800/50 rounded-lg transition-colors group">
      <div className="font-medium text-white group-hover:text-cyan-400 transition-colors mb-2">
        {label}
      </div>
      {description && (
        <div className="text-sm text-gray-400 mb-3">{description}</div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
      />
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">個人資料</h2>
            
            <InputField
              value={settings.username}
              onChange={(value) => updateSetting('username', value)}
              label="使用者名稱"
              description="這會顯示在你的個人檔案中"
            />
            
            <InputField
              value={settings.email}
              onChange={(value) => updateSetting('email', value)}
              label="電子信箱"
              description="用於接收通知和帳戶相關訊息"
              type="email"
            />
            
            <div className="p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
              <div className="font-medium text-white mb-2">大頭貼</div>
              <div className="text-sm text-gray-400 mb-3">上傳你的個人照片</div>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {settings.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">外觀設定</h2>
            
            <SelectOption
              value={settings.theme}
              onChange={(value) => updateSetting('theme', value)}
              label="主題"
              description="選擇你喜歡的介面風格"
              options={[
                { value: 'dark', label: '🌙 深色模式' },
                { value: 'light', label: '☀️ 淺色模式' },
                { value: 'auto', label: '🤖 跟隨系統' }
              ]}
            />
            
            <div className="p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
              <div className="font-medium text-white mb-2">主題色彩</div>
              <div className="text-sm text-gray-400 mb-3">選擇介面的主要顏色</div>
              <div className="flex space-x-3">
                {Object.entries(accentColors).map(([color, gradient]) => (
                  <button
                    key={color}
                    onClick={() => updateSetting('accentColor', color)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradient} transition-all duration-200 hover:scale-110 ${
                      settings.accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <ToggleSwitch
              enabled={settings.animations}
              onChange={() => updateSetting('animations', !settings.animations)}
              label="動畫效果"
              description="啟用介面動畫和過渡效果"
            />
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">通知設定</h2>
            
            <ToggleSwitch
              enabled={settings.notifications}
              onChange={() => updateSetting('notifications', !settings.notifications)}
              label="推播通知"
              description="允許應用程式發送通知"
            />
            
            <ToggleSwitch
              enabled={settings.soundEnabled}
              onChange={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              label="音效"
              description="通知時播放提示音"
            />
            
            <ToggleSwitch
              enabled={settings.emailNotifications}
              onChange={() => updateSetting('emailNotifications', !settings.emailNotifications)}
              label="電子郵件通知"
              description="重要事件透過電子郵件通知"
            />
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">日曆設定</h2>
            
            <SelectOption
              value={settings.startOfWeek}
              onChange={(value) => updateSetting('startOfWeek', value)}
              label="一週開始"
              description="設定日曆的第一天"
              options={[
                { value: 'sunday', label: '週日' },
                { value: 'monday', label: '週一' }
              ]}
            />
            
            <SelectOption
              value={settings.timeFormat}
              onChange={(value) => updateSetting('timeFormat', value)}
              label="時間格式"
              description="選擇時間顯示方式"
              options={[
                { value: '12h', label: '12小時制 (AM/PM)' },
                { value: '24h', label: '24小時制' }
              ]}
            />
            
            <SelectOption
              value={settings.language}
              onChange={(value) => updateSetting('language', value)}
              label="語言"
              description="選擇介面語言"
              options={[
                { value: 'zh-TW', label: '繁體中文' },
                { value: 'zh-CN', label: '简体中文' },
                { value: 'en-US', label: 'English' }
              ]}
            />
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">隱私設定</h2>
            
            <ToggleSwitch
              enabled={settings.dataSharing}
              onChange={() => updateSetting('dataSharing', !settings.dataSharing)}
              label="資料分享"
              description="允許與第三方服務分享匿名使用資料"
            />
            
            <ToggleSwitch
              enabled={settings.analytics}
              onChange={() => updateSetting('analytics', !settings.analytics)}
              label="使用分析"
              description="幫助改善應用程式體驗"
            />
          </div>
        );

      case 'data':
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">資料管理</h2>
            
            <div className="p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
              <div className="font-medium text-white mb-2">匯出資料</div>
              <div className="text-sm text-gray-400 mb-3">下載你的所有日曆資料</div>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                匯出資料
              </button>
            </div>
            
            <div className="p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
              <div className="font-medium text-white mb-2">清除快取</div>
              <div className="text-sm text-gray-400 mb-3">清除應用程式快取資料</div>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all duration-200 hover:scale-105">
                清除快取
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              設定
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={resetSettings}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重置
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              儲存
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {section.label}
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 min-h-96">
              <div className="p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}