'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar, Clock } from 'lucide-react';

export default function DarkCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({ title: '', time: '', priority: 'normal' });
  const [animateMonth, setAnimateMonth] = useState(false);

  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  
  const priorityColors = {
    high: 'bg-red-500 border-red-400',
    medium: 'bg-yellow-500 border-yellow-400',
    normal: 'bg-blue-500 border-blue-400',
    low: 'bg-green-500 border-green-400'
  };

  const priorityLabels = {
    high: '🔥 緊急',
    medium: '⚡ 重要',
    normal: '📅 一般',
    low: '🌱 待辦'
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    setAnimateMonth(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setAnimateMonth(false);
    }, 150);
  };

  const goToNextMonth = () => {
    setAnimateMonth(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setAnimateMonth(false);
    }, 150);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const getDateKey = (day) => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
  };

  const getDayEvents = (day) => {
    const dateKey = getDateKey(day);
    return events[dateKey] || [];
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    
    const dateKey = getDateKey(selectedDate);
    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      title: newEvent.title.trim()
    };
    
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventWithId]
    }));
    
    setNewEvent({ title: '', time: '', priority: 'normal' });
    setShowEventModal(false);
  };

  const deleteEvent = (day, eventId) => {
    const dateKey = getDateKey(day);
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter(event => event.id !== eventId) || []
    }));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 前面的空白日子
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-2"></div>
      );
    }

    // 實際的日子
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getDayEvents(day);
      const hasEvents = dayEvents.length > 0;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`aspect-square p-2 border border-gray-800 cursor-pointer transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg group ${
            isToday(day)
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25'
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          <div className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium ${
                isToday(day) ? 'text-white' : 'text-gray-300'
              } group-hover:text-white transition-colors`}>
                {day}
              </span>
              {hasEvents && (
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div className="space-y-1 mt-1">
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className={`text-xs px-1 py-0.5 rounded truncate ${priorityColors[event.priority]} text-white font-medium transform hover:scale-105 transition-transform`}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-400 font-medium">
                  +{dayEvents.length - 2} 更多
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              智能日曆
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-3 hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
            
            <h2 className={`text-2xl font-bold transition-all duration-300 ${
              animateMonth ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {currentDate.getFullYear()}年 {months[currentDate.getMonth()]}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-3 hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            今天 {new Date().toLocaleDateString('zh-TW')}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-px mb-px">
          {weekdays.map((day) => (
            <div
              key={day}
              className="bg-gray-800 p-4 text-center text-sm font-semibold text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className={`grid grid-cols-7 gap-px transition-all duration-300 ${
          animateMonth ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          {renderCalendarDays()}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-700 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {currentDate.getMonth() + 1}月{selectedDate}日 的活動
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* 現有事件 */}
            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
              {getDayEvents(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 ${priorityColors[event.priority]} bg-gray-800/50 group hover:bg-gray-800 transition-all duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-white">{event.title}</div>
                      {event.time && (
                        <div className="text-sm text-gray-400 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {priorityLabels[event.priority]}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEvent(selectedDate, event.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 新增事件 */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="活動標題..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
              
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
              
              <select
                value={newEvent.priority}
                onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              >
                <option value="low">🌱 待辦</option>
                <option value="normal">📅 一般</option>
                <option value="medium">⚡ 重要</option>
                <option value="high">🔥 緊急</option>
              </select>
              
              <button
                onClick={addEvent}
                disabled={!newEvent.title.trim()}
                className="w-full p-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-600 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                新增活動
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}