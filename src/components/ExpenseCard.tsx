import React from 'react';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Expense } from '../types/expense';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Rent: 'bg-blue-100 text-blue-800',
  Transport: 'bg-green-100 text-green-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Healthcare: 'bg-red-100 text-red-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Utilities: 'bg-yellow-100 text-yellow-800',
  Other: 'bg-gray-100 text-gray-800'
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {expense.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category] || categoryColors.Other}`}>
              <Tag className="w-3 h-3" />
              {expense.category}
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ${expense.amount.toFixed(2)}
        </div>
      </div>

      {expense.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {expense.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Calendar className="w-4 h-4" />
          {formatDate(expense.date)}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit expense"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;