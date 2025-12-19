
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart as PieChartIcon, 
  Settings as SettingsIcon,
  Plus,
  CloudCheck,
  Moon,
  Sun,
  Loader2
} from 'lucide-react';
import { Transaction, Category } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import Settings from './components/Settings';
import AddTransactionModal from './components/AddTransactionModal';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdVSTpAvq9FhWyEEPin8837WzNKrGYY253OFEJhgmFFQ8RFK7JIOiNch7mjBw4zXld8Q/exec';
const THEME_KEY = 'fintrack_theme';
const CATEGORIES_KEY = 'fintrack_categories';
const CACHE_KEY = 'fintrack_cache'; // Локальный кэш для быстрой работы

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'charts' | 'settings'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const savedCats = localStorage.getItem(CATEGORIES_KEY);
    setCategories(savedCats ? JSON.parse(savedCats) : DEFAULT_CATEGORIES);
    fetchDataFromCloud();
  }, []);

  const fetchDataFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatus('Загрузка из облака...');
    try {
      const response = await fetch(SCRIPT_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setTransactions(data);
        setSyncStatus('Данные синхронизированы');
      }
    } catch (e) {
      setSyncStatus('Офлайн режим');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, 'id'>) => {
    setIsSyncing(true);
    setSyncStatus('Отправка в Google...');
    
    const transactionWithId: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    };

    // Оптимистичное обновление UI
    setTransactions(prev => [transactionWithId, ...prev]);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(transactionWithId),
        headers: { 'Content-Type': 'application/json' },
      });
      setSyncStatus('Успешно сохранено');
    } catch (error) {
      setSyncStatus('Ошибка синхронизации');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3000);
    }
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const totals = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.reduce((acc, t) => {
      const tDate = new Date(t.date);
      const val = Number(t.amount);
      if (t.type === 'income') {
        acc.balance += val;
        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) acc.income += val;
      } else {
        acc.balance -= val;
        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) acc.expenses += val;
      }
      return acc;
    }, { balance: 0, income: 0, expenses: 0 });
  }, [transactions]);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 dark:bg-black transition-colors duration-500 relative overflow-hidden shadow-2xl">
      {/* Dynamic Status Bar */}
      {(syncStatus || isSyncing) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white/90 dark:bg-white/10 backdrop-blur-2xl text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-full text-[11px] font-bold shadow-2xl border border-white/20 flex items-center gap-3">
            {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <CloudCheck size={14} />}
            {syncStatus || 'Облако...'}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 px-6 py-6 pt-12 flex justify-between items-center bg-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <p className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Cloud Sync</p>
          <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white uppercase">
            {activeTab === 'dashboard' && 'Обзор'}
            {activeTab === 'history' && 'История'}
            {activeTab === 'charts' && 'Графики'}
            {activeTab === 'settings' && 'Опции'}
          </h1>
        </div>
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-700 dark:text-gray-200 border border-white/20 active:scale-90 transition-transform"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 space-y-8 pt-2 pb-36 no-scrollbar page-enter">
        {activeTab === 'dashboard' && <Dashboard categories={categories} totals={totals} transactions={transactions.slice(0, 5)} isDarkMode={isDarkMode} />}
        {activeTab === 'history' && <TransactionList categories={categories} transactions={transactions} onDelete={deleteTransaction} />}
        {activeTab === 'charts' && <Charts categories={categories} transactions={transactions} isDarkMode={isDarkMode} />}
        {activeTab === 'settings' && (
          <Settings 
            transactions={transactions} 
            categories={categories}
            setCategories={setCategories}
            clearData={() => {
              setTransactions([]);
              setCategories(DEFAULT_CATEGORIES);
              localStorage.removeItem(CACHE_KEY);
            }} 
            scriptUrl={SCRIPT_URL}
            onUpdateScriptUrl={() => {}}
          />
        )}
      </main>

      <button 
        disabled={isSyncing}
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-28 right-6 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_20px_50px_rgba(59,130,246,0.5)] transition-all z-50 ${isSyncing ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-blue-600 dark:bg-blue-500 hover:scale-110 active:scale-95'}`}
      >
        {isSyncing ? <Loader2 size={32} className="animate-spin" /> : <Plus size={36} />}
      </button>

      <nav className="fixed bottom-8 left-6 right-6 z-40">
        <div className="glass dark:bg-white/10 dark:border-white/5 border border-white/20 rounded-4xl px-2 py-2 flex justify-around items-center shadow-2xl">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Обзор' },
            { id: 'history', icon: ArrowLeftRight, label: 'История' },
            { id: 'charts', icon: PieChartIcon, label: 'Графики' },
            { id: 'settings', icon: SettingsIcon, label: 'Опции' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex flex-col items-center gap-1 py-3 px-4 rounded-3xl transition-all duration-300 ${activeTab === tab.id ? 'bg-white/80 dark:bg-white/20 shadow-sm text-blue-600 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <tab.icon size={22} />
              <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {isModalOpen && (
        <AddTransactionModal 
          isOpen={isModalOpen} 
          categories={categories}
          isSyncing={isSyncing}
          onClose={() => setIsModalOpen(false)} 
          onSubmit={addTransaction}
        />
      )}
    </div>
  );
};

export default App;
