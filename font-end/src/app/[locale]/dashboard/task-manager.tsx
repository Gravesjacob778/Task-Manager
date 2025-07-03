"use client";
import React, { useState } from 'react';
import { Plus, X, CheckCircle, Clock, Search } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: '完成 React 專案',
      description: '使用 Next.js 和 Tailwind 建立任務管理系統',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-07-03',
      tags: ['React', 'Next.js']
    },
    {
      id: 2,
      title: '學習 TypeScript',
      description: '深入了解 TypeScript 的進階特性',
      priority: 'medium',
      status: 'todo',
      dueDate: '2025-07-05',
      tags: ['TypeScript', '學習']
    },
    {
      id: 3,
      title: '寫技術文章',
      description: '分享最近學到的前端技術',
      priority: 'low',
      status: 'completed',
      dueDate: '2025-06-30',
      tags: ['寫作', '分享']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        status: 'todo',
        tags: []
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowAddForm(false);
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'todo': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              任務管理器 ⚡
            </h1>
            <p className="text-gray-400 mt-2">保持專注，完成目標</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            新增任務
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="搜尋任務..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="todo">待辦</option>
            <option value="in-progress">進行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">新增任務</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="任務標題"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <textarea
                  placeholder="任務描述"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="low">低優先級</option>
                  <option value="medium">中優先級</option>
                  <option value="high">高優先級</option>
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={addTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
                >
                  新增
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-gray-800 rounded-xl p-6 border-l-4 ${getPriorityColor(task.priority)} hover:bg-gray-750 transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{task.description}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`capitalize ${getStatusColor(task.status)}`}>
                  {task.status === 'todo' ? '待辦' : 
                   task.status === 'in-progress' ? '進行中' : '已完成'}
                </span>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} />
                    {task.dueDate}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {task.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, task.status === 'todo' ? 'in-progress' : 'completed')}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  {task.status === 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'todo')}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      重新開始
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">🎯</div>
            <p className="text-gray-400">沒有找到相符的任務</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;