import React, { useState } from 'react';
import { Target, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { SavingsGoal } from '../types/expense';

interface SavingsGoalsProps {
  savingsGoals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onAddToGoal: (id: string, amount: number) => void;
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  savingsGoals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onAddToGoal
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [addAmount, setAddAmount] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount.trim() || !targetDate.trim()) return;

    const goalData = {
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: editingGoal?.currentAmount || 0,
      targetDate,
      description: description.trim()
    };

    if (editingGoal) {
      onUpdateGoal({ ...goalData, id: editingGoal.id });
      setEditingGoal(null);
    } else {
      onAddGoal(goalData);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setTargetAmount('');
    setTargetDate('');
    setDescription('');
    setShowForm(false);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setTargetAmount(goal.targetAmount.toString());
    setTargetDate(goal.targetDate);
    setDescription(goal.description || '');
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingGoal(null);
    resetForm();
  };

  const handleAddToGoal = (goalId: string) => {
    const amount = parseFloat(addAmount[goalId] || '0');
    if (amount > 0) {
      onAddToGoal(goalId, amount);
      setAddAmount(prev => ({ ...prev, [goalId]: '' }));
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Savings Goals
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title (e.g., Emergency Fund)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Target amount"
              step="0.01"
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {editingGoal ? 'Update' : 'Add'} Goal
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {savingsGoals.map((goal) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const isCompleted = goal.currentAmount >= goal.targetAmount;
          const isOverdue = daysRemaining < 0 && !isCompleted;

          return (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Target: ${goal.targetAmount.toFixed(2)}</span>
                    <span className={`${isOverdue ? 'text-red-600' : isCompleted ? 'text-green-600' : ''}`}>
                      {isCompleted ? 'Completed!' : 
                       isOverdue ? `${Math.abs(daysRemaining)} days overdue` :
                       `${daysRemaining} days left`}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit goal"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${goal.currentAmount.toFixed(2)} saved</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ${(goal.targetAmount - goal.currentAmount).toFixed(2)} remaining
                </div>
              </div>

              {!isCompleted && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={addAmount[goal.id] || ''}
                    onChange={(e) => setAddAmount(prev => ({ ...prev, [goal.id]: e.target.value }))}
                    placeholder="Add amount"
                    step="0.01"
                    min="0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => handleAddToGoal(goal.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Add
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {savingsGoals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No savings goals yet. Set your first financial goal to start tracking progress!</p>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;