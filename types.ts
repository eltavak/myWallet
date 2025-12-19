
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  note: string;
}

export interface FinanceState {
  transactions: Transaction[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
