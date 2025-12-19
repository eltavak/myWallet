
import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Transaction, Category, TransactionType } from '../types';

interface ChartsProps {
  transactions: Transaction[];
  categories: Category[];
  isDarkMode: boolean;
}

const Charts: React.FC<ChartsProps> = ({ transactions, categories, isDarkMode }) => {
  const [pieType, setPieType] = useState<TransactionType>('expense');

  const categoryData = transactions
    .filter(t => t.type === pieType)
    .reduce((acc: any[], t) => {
      const category = categories.find(c => c.id === t.categoryId);
      const categoryName = category?.name || 'Прочее';
      const existing = acc.find(item => item.name === categoryName);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({ 
          name: categoryName, 
          value: Number(t.amount),
          color: category?.color.replace('bg-', '') || 'gray-500' 
        });
      }
      return acc;
    }, []);

  const colorMap: Record<string, string> = {
    'orange-500': '#f97316',
    'blue-500': '#3b82f6',
    'indigo-500': '#6366f1',
    'purple-500': '#a855f7',
    'green-500': '#22c55e',
    'pink-500': '#ec4899',
    'yellow-500': '#eab308',
    'red-500': '#ef4444',
    'gray-500': '#6b7280',
    'teal-500': '#14b8a6'
  };

  const monthlyData = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (4 - i));
    const monthName = d.toLocaleDateString('ru-RU', { month: 'short' });
    const monthNum = d.getMonth();
    const yearNum = d.getFullYear();

    const stats = transactions.reduce((acc, t) => {
      const tDate = new Date(t.date);
      if (tDate.getMonth() === monthNum && tDate.getFullYear() === yearNum) {
        if (t.type === 'income') acc.income += Number(t.amount);
        else acc.expense += Number(t.amount);
      }
      return acc;
    }, { income: 0, expense: 0 });

    return { name: monthName, Доход: stats.income, Расход: stats.expense };
  });

  const chartTextColor = isDarkMode ? '#888' : '#9ca3af';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Category Analysis Card */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-4xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex flex-col gap-4 mb-6">
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Анализ категорий</h3>
          
          {/* iOS Style Segmented Control */}
          <div className="flex p-1 bg-gray-100 dark:bg-white/10 rounded-2xl w-full">
            <button
              onClick={() => setPieType('expense')}
              className={`flex-1 py-2 text-[11px] font-black rounded-xl transition-all ${pieType === 'expense' ? 'bg-white dark:bg-white/20 text-red-500 shadow-sm' : 'text-gray-400'}`}
            >
              РАСХОДЫ
            </button>
            <button
              onClick={() => setPieType('income')}
              className={`flex-1 py-2 text-[11px] font-black rounded-xl transition-all ${pieType === 'income' ? 'bg-white dark:bg-white/20 text-green-500 shadow-sm' : 'text-gray-400'}`}
            >
              ДОХОДЫ
            </button>
          </div>
        </div>

        <div className="h-[280px]">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorMap[entry.color] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', 
                    backgroundColor: isDarkMode ? '#1c1c1e' : 'white',
                    color: isDarkMode ? 'white' : 'black'
                  }} 
                  formatter={(value: number) => [`${value.toLocaleString('ru-RU')} ₽`, '']}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <p className="text-sm font-bold">Нет данных для этого типа</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trends Card */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-4xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Тренды месяца</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#f3f4f6'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartTextColor, fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartTextColor, fontWeight: 'bold' }} />
              <Tooltip 
                cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                contentStyle={{ 
                  borderRadius: '24px', 
                  border: 'none', 
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  backgroundColor: isDarkMode ? '#1c1c1e' : 'white'
                }} 
              />
              <Bar dataKey="Доход" fill="#22c55e" radius={[10, 10, 10, 10]} barSize={10} />
              <Bar dataKey="Расход" fill="#f43f5e" radius={[10, 10, 10, 10]} barSize={10} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
