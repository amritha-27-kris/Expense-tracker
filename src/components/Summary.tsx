import React from 'react';
import { DollarSign, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { Expense } from '../types/expense';

interface SummaryProps {
  expenses: Expense[];
}

const Summary: React.FC<SummaryProps> = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalTransactions = expenses.length;
  const averageExpense = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
  
  // Get current month's expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-100',
      change: totalAmount > 0 ? '+' : ''
    },
    {
      title: 'Total Transactions',
      value: totalTransactions.toString(),
      icon: CreditCard,
      color: 'text-green-600 bg-green-100',
      change: ''
    },
    {
      title: 'Average Expense',
      value: `$${averageExpense.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
      change: ''
    },
    {
      title: 'This Month',
      value: `$${monthlyTotal.toFixed(2)}`,
      icon: Calendar,
      color: 'text-orange-600 bg-orange-100',
      change: ''
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Summary;