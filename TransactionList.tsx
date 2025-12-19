
import React, { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { Transaction, Category } from '../types';
import { getCategoryIcon } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const category = categories.find(c => c.id === t.categoryId)?.name || '';
    return (
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        </div>
        <input 
          type="text"
          placeholder="Поиск..."
          className="w-full bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl py-4 pl-12 pr-4 text-sm font-bold border-none shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all outline-none dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-4xl border border-gray-100 dark:border-white/5">
            <p className="text-gray-400 dark:text-gray-500 text-sm font-bold tracking-tight">Пусто</p>
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const category = categories.find(c => c.id === t.categoryId) || categories[categories.length - 1] || { name: 'Прочее', icon: 'MoreHorizontal', color: 'bg-gray-500' };
            return (
              <div key={t.id} className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-4 flex items-center justify-between shadow-sm border border-gray-100/50 dark:border-white/5 group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`${category.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {getCategoryIcon(category.icon, "w-6 h-6")}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{category.name}</p>
                    <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase">
                      {new Date(t.date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-black ${t.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    {t.note && <p className="text-[10px] text-gray-400 dark:text-gray-500 italic truncate max-w-[100px] font-medium">{t.note}</p>}
                  </div>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-gray-200 dark:text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionList;
