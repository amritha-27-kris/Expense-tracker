import React, { useState } from 'react';
import { Repeat, Plus, Edit2, Trash2, Play, Pause } from 'lucide-react';
import { RecurringExpense, categories } from '../types/expense';

interface RecurringExpensesProps {
  recurringExpenses: RecurringExpense[];
  onAddRecurring: (expense: Omit<RecurringExpense, 'id'>) => void;
  onUpdateRecurring: (expense: RecurringExpense) => void;
  onDeleteRecurring: (id: string) => void;
  onToggleRecurring: (id: string) => void;
}

const RecurringExpenses: React.FC<RecurringExpensesProps> = ({
  recurringExpenses,
  onAddRecurring,
  onUpdateRecurring,
  onDeleteRecurring,
  onToggleRecurring
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Rent');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount.trim()) return;

    const expenseData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      dayOfMonth: parseInt(dayOfMonth),
      description: description.trim(),
      isActive: true
    };

    if (editingExpense) {
      onUpdateRecurring({ ...expenseData, id: editingExpense.id, isActive: editingExpense.isActive });
      setEditingExpense(null);
    } else {
      onAddRecurring(expenseData);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('Rent');
    setDayOfMonth('1');
    setDescription('');
    setShowForm(false);
  };

  const handleEdit = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDayOfMonth(expense.dayOfMonth.toString());
    setDescription(expense.description || '');
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingExpense(null);
    resetForm();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Repeat className="w-6 h-6" />
          Recurring Expenses
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Recurring
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Expense title"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              step="0.01"
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>Day {day} of month</option>
              ))}
            </select>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {editingExpense ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {recurringExpenses.map((expense) => (
          <div key={expense.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`font-semibold ${expense.isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                  {expense.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  expense.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {expense.isActive ? 'Active' : 'Paused'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>${expense.amount.toFixed(2)} • {expense.category} • Day {expense.dayOfMonth} of month</p>
                {expense.description && <p className="mt-1">{expense.description}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleRecurring(expense.id)}
                className={`p-2 rounded-lg transition-colors ${
                  expense.isActive 
                    ? 'text-orange-600 hover:bg-orange-50' 
                    : 'text-green-600 hover:bg-green-50'
                }`}
                title={expense.isActive ? 'Pause' : 'Resume'}
              >
                {expense.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleEdit(expense)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteRecurring(expense.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {recurringExpenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Repeat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No recurring expenses set up. Add recurring expenses like rent or subscriptions!</p>
        </div>
      )}
    </div>
  );
};

export default RecurringExpenses;