
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction, Category } from '../types';
import { getCategoryIcon } from '../constants';

interface DashboardProps {
  totals: { balance: number; income: number; expenses: number };
  transactions: Transaction[];
  categories: Category[];
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ totals, transactions, categories, isDarkMode }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* iOS 26 Mesh Gradient Balance Card */}
      <div className="mesh-gradient rounded-4xl p-8 text-white shadow-[0_32px_64px_-16px_rgba(59,130,246,0.5)] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <p className="text-white/70 text-[13px] font-bold tracking-widest uppercase">Твой баланс</p>
            <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black border border-white/10 uppercase">PRO</div>
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-8">{formatCurrency(totals.balance)}</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-green-300" />
                <p className="text-[10px] text-white/60 font-black uppercase tracking-wider">Приход</p>
              </div>
              <p className="font-extrabold text-lg">{formatCurrency(totals.income)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={14} className="text-red-300" />
                <p className="text-[10px] text-white/60 font-black uppercase tracking-wider">Расход</p>
              </div>
              <p className="font-extrabold text-lg">{formatCurrency(totals.expenses)}</p>
            </div>
          </div>
        </div>
        
        {/* Animated Orbs for iOS 26 feel */}
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/20 blur-[60px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-blue-400/30 blur-[40px] rounded-full"></div>
      </div>

      <section className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Активность</h3>
        </div>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-white/5 rounded-4xl border border-gray-100 dark:border-white/5">
              <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Нет недавних записей</p>
            </div>
          ) : (
            transactions.map((t) => {
              const category = categories.find(c => c.id === t.categoryId) || categories[categories.length - 1] || { name: 'Неизвестно', icon: 'MoreHorizontal', color: 'bg-gray-500' };
              return (
                <div key={t.id} className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-4 flex items-center justify-between shadow-sm border border-gray-100/50 dark:border-white/5 active:scale-95 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`${category.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {getCategoryIcon(category.icon, "w-6 h-6")}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-base leading-tight">{category.name}</p>
                      <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {new Date(t.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black tracking-tight ${t.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    {t.note && <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium italic truncate max-w-[100px]">{t.note}</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
