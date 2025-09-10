import React, { useState } from 'react';
import { Target, AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';
import { Budget, Expense, categories } from '../types/expense';

interface BudgetTrackerProps {
  budgets: Budget[];
  expenses: Expense[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  budgets,
  expenses,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);

  const getCurrentMonthExpenses = (category: string) => {
    return expenses.filter(expense => {
      const expenseMonth = expense.date.slice(0, 7);
      return expenseMonth === currentMonth && expense.category === category;
    }).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount.trim()) return;

    const budgetData = {
      category,
      amount: parseFloat(amount),
      month: currentMonth
    };

    if (editingBudget) {
      onUpdateBudget({ ...budgetData, id: editingBudget.id });
      setEditingBudget(null);
    } else {
      onAddBudget(budgetData);
    }

    setAmount('');
    setCategory('Food');
    setShowForm(false);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setAmount(budget.amount.toString());
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
    setAmount('');
    setCategory('Food');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Budget Tracker
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Budget amount"
              step="0.01"
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingBudget ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.filter(budget => budget.month === currentMonth).map((budget) => {
          const spent = getCurrentMonthExpenses(budget.category);
          const percentage = (spent / budget.amount) * 100;
          const isOverBudget = spent > budget.amount;
          const isNearLimit = percentage > 80 && !isOverBudget;

          return (
            <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                <div className="flex items-center gap-1">
                  {(isOverBudget || isNearLimit) && (
                    <AlertTriangle className={`w-4 h-4 ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`} />
                  )}
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(budget.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>${spent.toFixed(2)} spent</span>
                  <span>${budget.amount.toFixed(2)} budget</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <p className={`text-sm ${isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}>
                {isOverBudget 
                  ? `Over budget by $${(spent - budget.amount).toFixed(2)}`
                  : `$${(budget.amount - spent).toFixed(2)} remaining`
                }
              </p>
            </div>
          );
        })}
      </div>

      {budgets.filter(budget => budget.month === currentMonth).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No budgets set for this month. Add your first budget to start tracking!</p>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;