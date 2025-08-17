"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Plus,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Image as ImageIcon
} from 'lucide-react';
import aiChatService from '@/services/aiChatService';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
  avatar: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts = [
    { id: 1, name: 'AI助手', status: 'online', avatar: '🤖', lastMessage: '謝謝誇獎！😎' },
    { id: 2, name: '開發團隊', status: 'online', avatar: '👥', lastMessage: '新功能上線了！' },
    { id: 3, name: '設計師', status: 'away', avatar: '🎨', lastMessage: '設計稿已完成' },
    { id: 4, name: '產品經理', status: 'offline', avatar: '📊', lastMessage: '明天開會討論' }
  ];

  const emojis = ['😀', '😂', '😍', '🤔', '😎', '🔥', '👍', '❤️', '🎉', '🚀'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'DeadpoolUser',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      type: 'sent',
      avatar: 'D'
    };

    const currentMessage = newMessage;
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

      // 呼叫後端 AI API，傳入對話歷史
      aiChatService.sendMessage(currentMessage, messages.slice(-10))
      .then(res => {
        const response = res;
        if (!response) {
          throw new Error('AI 回應錯誤');
        }
        
        const aiResponse: Message = {
          id: messages.length + 2,
          sender: 'AI助手',
          content: response || '抱歉，我無法回應這個問題。',
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
          type: 'received',
          avatar: '🤖'
        };

        setMessages(prev => [...prev, aiResponse]);
      }).catch(error => {
        console.error('AI API 錯誤:', error);
        const errorResponse: Message = {
          id: messages.length + 2,
          sender: 'AI助手',
          content: '抱歉，發生錯誤，請稍後再試。',
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
          type: 'received',
          avatar: '🤖'
        };
        setMessages(prev => [...prev, errorResponse]);
      }).finally(() => {
        setIsTyping(false);
        scrollToBottom();
      });
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} mb-4 group`}>
      {message.type === 'received' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0">
          {message.avatar}
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${message.type === 'sent' ? 'order-1' : 'order-2'}`}>
        <div className={`px-4 py-2 rounded-2xl ${
          message.type === 'sent'
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
            : 'bg-gray-800 text-gray-100'
        } shadow-lg transform transition-all duration-200 hover:scale-105`}>
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${
          message.type === 'sent' ? 'text-right' : 'text-left'
        }`}>
          {message.timestamp}
        </div>
      </div>
      
      {message.type === 'sent' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm ml-3 flex-shrink-0">
          {message.avatar}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              聊天室
            </h1>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋聊天..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 hover:bg-gray-800 cursor-pointer transition-colors border-l-4 border-transparent hover:border-cyan-400"
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {contact.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                    contact.status === 'online' ? 'bg-green-500' :
                    contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="font-medium text-white">{contact.name}</div>
                  <div className="text-sm text-gray-400 truncate">{contact.lastMessage}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                🤖
              </div>
              <div>
                <h2 className="font-bold text-white">AI助手</h2>
                <p className="text-sm text-green-400">線上</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-500' : 'hover:bg-gray-800'
                }`}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-gray-400" />}
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-black to-gray-900">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                🤖
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          {showEmojiPicker && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-gray-700 p-2 rounded-lg transition-colors hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="輸入訊息..."
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                rows={1}
              />
            </div>
            
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-lg transition-colors ${
                showEmojiPicker ? 'bg-cyan-600' : 'hover:bg-gray-800'
              }`}
            >
              <Smile className="w-5 h-5 text-gray-400" />
            </button>
            
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2 rounded-lg transition-colors ${
                isMicOn ? 'bg-red-600 hover:bg-red-500' : 'hover:bg-gray-800'
              }`}
            >
              {isMicOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-gray-400" />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-600 rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}