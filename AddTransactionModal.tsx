
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { getCategoryIcon } from '../constants';

interface AddTransactionModalProps {
  isOpen: boolean;
  categories: Category[];
  isSyncing: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, categories, isSyncing, onClose, onSubmit }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || isSyncing) return;
    onSubmit({ amount: Number(amount), type, categoryId, date, note });
    // Модальное окно закроется родителем при успехе, либо мы можем закрыть его сразу
    // Для лучшего UX закрываем сразу, так как индикатор синхронизации теперь глобальный
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-t-[40px] sm:rounded-4xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Новая запись</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[85vh] no-scrollbar safe-bottom">
          <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-[20px]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 text-sm font-black rounded-[15px] transition-all ${type === 'expense' ? 'bg-white dark:bg-white/20 text-red-500 shadow-md' : 'text-gray-400'}`}
            >
              Расход
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-3 text-sm font-black rounded-[15px] transition-all ${type === 'income' ? 'bg-white dark:bg-white/20 text-green-500 shadow-md' : 'text-gray-400'}`}
            >
              Доход
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Сумма</label>
            <div className="relative">
              <span className="absolute left-0 bottom-1 text-5xl font-black text-blue-600 dark:text-blue-400 transition-colors">₽</span>
              <input 
                type="number"
                step="0.01"
                placeholder="0"
                className="w-full bg-transparent border-b-4 border-gray-100 dark:border-white/5 pb-2 pl-12 text-6xl font-black text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-100 dark:placeholder:text-white/5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Категория</label>
            <div className="grid grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-3xl transition-all border-2 ${categoryId === cat.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20' : 'border-transparent bg-gray-50 dark:bg-white/5'}`}
                >
                  <div className={`${cat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {getCategoryIcon(cat.icon, "w-5 h-5")}
                  </div>
                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Дата</label>
              <input 
                type="date"
                className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl py-4 px-4 text-xs font-bold text-gray-900 dark:text-white border-none outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Заметка</label>
              <input 
                type="text"
                placeholder="..."
                className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl py-4 px-4 text-xs font-bold text-gray-900 dark:text-white border-none outline-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSyncing}
            className={`w-full font-black py-5 rounded-3xl shadow-[0_20px_40px_rgba(59,130,246,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg ${isSyncing ? 'bg-gray-400 text-gray-200' : 'bg-blue-600 dark:bg-blue-500 text-white'}`}
          >
            {isSyncing ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} strokeWidth={3} />}
            {isSyncing ? 'Синхронизация...' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
