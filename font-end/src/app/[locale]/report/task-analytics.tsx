"use client";

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Target, Calendar, Award, Activity } from 'lucide-react';

const TaskAnalytics = () => {
  // 模擬任務數據 - 實際使用時可以從 props 或 API 取得
  const [tasks] = useState([
    {
      id: 1,
      title: '完成 React 專案',
      priority: 'high',
      status: 'completed',
      dueDate: '2025-07-01',
      completedDate: '2025-06-30',
      createdDate: '2025-06-25'
    },
    {
      id: 2,
      title: '學習 TypeScript',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2025-07-05',
      createdDate: '2025-06-28'
    },
    {
      id: 3,
      title: '寫技術文章',
      priority: 'low',
      status: 'completed',
      dueDate: '2025-06-30',
      completedDate: '2025-06-29',
      createdDate: '2025-06-20'
    },
    {
      id: 4,
      title: '優化網站效能',
      priority: 'high',
      status: 'todo',
      dueDate: '2025-07-08',
      createdDate: '2025-07-01'
    },
    {
      id: 5,
      title: '準備面試',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2025-07-10',
      createdDate: '2025-06-26'
    },
    {
      id: 6,
      title: '整理筆記',
      priority: 'low',
      status: 'completed',
      dueDate: '2025-06-28',
      completedDate: '2025-06-27',
      createdDate: '2025-06-22'
    }
  ]);

  // 計算統計數據
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const overdue = tasks.filter(t => 
      t.status !== 'completed' && new Date(t.dueDate) < new Date()
    ).length;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);

  // 狀態分佈數據
  const statusData = [
    { name: '已完成', value: stats.completed, color: '#10B981' },
    { name: '進行中', value: stats.inProgress, color: '#3B82F6' },
    { name: '待辦', value: stats.todo, color: '#6B7280' }
  ];

  // 優先級分佈數據
  const priorityData = [
    { 
      name: '高優先級', 
      value: tasks.filter(t => t.priority === 'high').length,
      color: '#EF4444'
    },
    { 
      name: '中優先級', 
      value: tasks.filter(t => t.priority === 'medium').length,
      color: '#F59E0B'
    },
    { 
      name: '低優先級', 
      value: tasks.filter(t => t.priority === 'low').length,
      color: '#10B981'
    }
  ];

  // 每日完成趨勢數據（最近7天）
  const trendData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completedCount = tasks.filter(t => 
        t.completedDate === dateStr
      ).length;
      
      const createdCount = tasks.filter(t => 
        t.createdDate === dateStr
      ).length;

      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString('zh-TW', { weekday: 'short' }),
        completed: completedCount,
        created: createdCount
      });
    }
    return last7Days;
  }, [tasks]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            任務統計報表 📊
          </h1>
          <p className="text-gray-400 mt-2">深入了解你的任務執行狀況</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Target}
            title="總任務數"
            value={stats.total}
            subtitle="所有任務"
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="完成率"
            value={`${stats.completionRate}%`}
            subtitle={`${stats.completed}/${stats.total} 已完成`}
            color="green"
          />
          <StatCard
            icon={Activity}
            title="進行中"
            value={stats.inProgress}
            subtitle="正在執行的任務"
            color="blue"
          />
          <StatCard
            icon={AlertCircle}
            title="逾期任務"
            value={stats.overdue}
            subtitle="需要立即處理"
            color="red"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-400" size={20} />
              任務狀態分佈
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="text-yellow-400" size={20} />
              優先級分佈
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={20} />
            7天趨勢分析
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
                name="已完成"
              />
              <Area 
                type="monotone" 
                dataKey="created" 
                stackId="2"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.6}
                name="新建任務"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
            <h4 className="font-semibold text-green-400 mb-2">🎉 表現優異</h4>
            <p className="text-gray-300 text-sm">
              你的完成率達到 {stats.completionRate}%，繼續保持這個節奏！
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <h4 className="font-semibold text-blue-400 mb-2">⚡ 進行中任務</h4>
            <p className="text-gray-300 text-sm">
              目前有 {stats.inProgress} 個任務正在進行，專注完成它們吧！
            </p>
          </div>
          
          {stats.overdue > 0 && (
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
              <h4 className="font-semibold text-red-400 mb-2">⚠️ 需要注意</h4>
              <p className="text-gray-300 text-sm">
                有 {stats.overdue} 個任務已逾期，建議優先處理！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;