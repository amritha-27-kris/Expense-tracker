export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export type Category = 
  | 'Food'
  | 'Rent'
  | 'Transport'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Utilities'
  | 'Other';

export const categories: Category[] = [
  'Food',
  'Rent',
  'Transport',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Utilities',
  'Other'
];

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
}

export interface RecurringExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  dayOfMonth: number;
  description?: string;
  isActive: boolean;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  description?: string;
}