
import React, { useState } from 'react';
import { Download, Trash2, ExternalLink, ShieldCheck, Link2, Plus, LayoutGrid, X, Cloud } from 'lucide-react';
import { Transaction, Category } from '../types';
import { AVAILABLE_ICONS, AVAILABLE_COLORS, getCategoryIcon } from '../constants';

interface SettingsProps {
  transactions: Transaction[];
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  clearData: () => void;
  scriptUrl: string;
  onUpdateScriptUrl: (url: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  transactions, 
  categories, 
  setCategories, 
  clearData, 
  scriptUrl
}) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState(AVAILABLE_ICONS[0]);
  const [newCatColor, setNewCatColor] = useState(AVAILABLE_COLORS[0]);

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("Нет данных для экспорта!");
      return;
    }
    const headers = ['Дата', 'Тип', 'Категория', 'Сумма', 'Заметка'];
    const rows = transactions.map(t => [
      t.date,
      t.type === 'income' ? 'Доход' : 'Расход',
      categories.find(c => c.id === t.categoryId)?.name || 'Прочее',
      t.amount,
      `"${t.note.replace(/"/g, '""')}"`
    ]);
    const csvContent = ['\uFEFF' + headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fintrack_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleClearData = () => {
    if (window.confirm("Удалить все данные локально? В Google Sheets данные останутся.")) clearData();
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor
    };
    setCategories(prev => [...prev, newCat]);
    setNewCatName('');
    setShowAddCategory(false);
  };

  const removeCategory = (id: string) => {
    if (categories.length <= 1) {
      alert("Нельзя удалить последнюю категорию!");
      return;
    }
    if (window.confirm("Удалить эту категорию?")) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {/* Cloud Status Display */}
      <div className="bg-blue-600 dark:bg-blue-600 rounded-4xl p-6 text-white shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
          <Cloud size={24} />
        </div>
        <div>
          <h4 className="font-black text-lg tracking-tight leading-none">Облако активно</h4>
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Данные сохраняются в Sheets</p>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-4xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <LayoutGrid size={22} />
            </div>
            <h4 className="font-black text-lg text-gray-900 dark:text-white tracking-tight">Категории</h4>
          </div>
          <button 
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            {showAddCategory ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>

        {showAddCategory && (
          <div className="p-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 space-y-4 animate-in slide-in-from-top duration-300">
            <input 
              type="text" 
              placeholder="Название категории"
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Иконка</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ICONS.map(icon => (
                  <button 
                    key={icon}
                    onClick={() => setNewCatIcon(icon)}
                    className={`p-2 rounded-xl transition-all ${newCatIcon === icon ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/10 text-gray-400'}`}
                  >
                    {getCategoryIcon(icon, "w-5 h-5")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Цвет</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLORS.map(color => (
                  <button 
                    key={color}
                    onClick={() => setNewCatColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${color} ${newCatColor === color ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={addCategory}
              className="w-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-black py-3 rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              Создать категорию
            </button>
          </div>
        )}

        <div className="divide-y divide-gray-50 dark:divide-white/5 max-h-[300px] overflow-y-auto no-scrollbar">
          {categories.map(cat => (
            <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`${cat.color} w-9 h-9 rounded-xl flex items-center justify-center text-white`}>
                  {getCategoryIcon(cat.icon, "w-5 h-5")}
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</span>
              </div>
              <button 
                onClick={() => removeCategory(cat.id)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-4xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <ShieldCheck size={22} />
          </div>
          <h4 className="font-black text-lg text-gray-900 dark:text-white tracking-tight">Система</h4>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-white/5">
          <button onClick={exportToCSV} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className="text-left">
              <p className="text-sm font-black text-gray-900 dark:text-white">Экспорт данных</p>
              <p className="text-[11px] font-bold text-gray-400">Скачать текущую сессию</p>
            </div>
            <ExternalLink size={18} className="text-gray-300" />
          </button>
          <button onClick={handleClearData} className="w-full flex items-center justify-between p-6 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <div className="text-left">
              <p className="text-sm font-black text-red-500">Очистить локальный кэш</p>
              <p className="text-[11px] font-bold text-red-400/50">Удаляет данные только из памяти браузера</p>
            </div>
            <Trash2 size={18} className="text-red-300" />
          </button>
        </div>
      </div>

      <div className="text-center pb-10">
        <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">
          FinTrack Pro v2.0.0 • Cloud Force
        </p>
      </div>
    </div>
  );
};

export default Settings;
