import React, { useState, useMemo } from 'react';
import { Wallet } from 'lucide-react';
import { Expense, Budget, RecurringExpense, SavingsGoal } from './types/expense';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import BudgetTracker from './components/BudgetTracker';
import RecurringExpenses from './components/RecurringExpenses';
import SpendingInsights from './components/SpendingInsights';
import SavingsGoals from './components/SavingsGoals';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Grocery Shopping',
      amount: 85.50,
      category: 'Food',
      date: '2025-01-15',
      description: 'Weekly grocery shopping at the local supermarket'
    },
    {
      id: '2',
      title: 'Monthly Rent',
      amount: 1200.00,
      category: 'Rent',
      date: '2025-01-01',
      description: 'January rent payment'
    },
    {
      id: '3',
      title: 'Bus Pass',
      amount: 45.00,
      category: 'Transport',
      date: '2025-01-10',
      description: 'Monthly public transport pass'
    }
  ]);
  
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    {
      id: '1',
      title: 'Monthly Rent',
      amount: 1200.00,
      category: 'Rent',
      dayOfMonth: 1,
      description: 'Monthly apartment rent',
      isActive: true
    }
  ]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 5000.00,
      currentAmount: 1250.00,
      targetDate: '2025-12-31',
      description: '6 months of expenses for emergencies'
    }
  ]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleEditExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      setExpenses(prev =>
        prev.map(expense =>
          expense.id === editingExpense.id
            ? { ...expenseData, id: editingExpense.id }
            : expense
        )
      );
      setEditingExpense(null);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    if (editingExpense?.id === id) {
      setEditingExpense(null);
    }
  };

  const handleStartEdit = (expense: Expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, selectedCategory]);

  // Budget management
  const handleAddBudget = (budgetData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: generateId()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const handleUpdateBudget = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  // Recurring expenses management
  const handleAddRecurring = (recurringData: Omit<RecurringExpense, 'id'>) => {
    const newRecurring: RecurringExpense = {
      ...recurringData,
      id: generateId()
    };
    setRecurringExpenses(prev => [...prev, newRecurring]);
  };

  const handleUpdateRecurring = (updatedRecurring: RecurringExpense) => {
    setRecurringExpenses(prev => prev.map(recurring => 
      recurring.id === updatedRecurring.id ? updatedRecurring : recurring
    ));
  };

  const handleDeleteRecurring = (id: string) => {
    setRecurringExpenses(prev => prev.filter(recurring => recurring.id !== id));
  };

  const handleToggleRecurring = (id: string) => {
    setRecurringExpenses(prev => prev.map(recurring => 
      recurring.id === id ? { ...recurring, isActive: !recurring.isActive } : recurring
    ));
  };

  // Savings goals management
  const handleAddGoal = (goalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: generateId()
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (updatedGoal: SavingsGoal) => {
    setSavingsGoals(prev => prev.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleAddToGoal = (id: string, amount: number) => {
    setSavingsGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, currentAmount: goal.currentAmount + amount } : goal
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-2xl">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Take control of your finances with our beautiful and intuitive expense tracking application.
            Monitor your spending, categorize expenses, and achieve your financial goals.
          </p>
        </div>

        {/* Summary */}
        <Summary expenses={expenses} />

        {/* Smart Financial Features */}
        <BudgetTracker
          budgets={budgets}
          expenses={expenses}
          onAddBudget={handleAddBudget}
          onUpdateBudget={handleUpdateBudget}
          onDeleteBudget={handleDeleteBudget}
        />

        <RecurringExpenses
          recurringExpenses={recurringExpenses}
          onAddRecurring={handleAddRecurring}
          onUpdateRecurring={handleUpdateRecurring}
          onDeleteRecurring={handleDeleteRecurring}
          onToggleRecurring={handleToggleRecurring}
        />

        <SpendingInsights expenses={expenses} />

        <SavingsGoals
          savingsGoals={savingsGoals}
          onAddGoal={handleAddGoal}
          onUpdateGoal={handleUpdateGoal}
          onDeleteGoal={handleDeleteGoal}
          onAddToGoal={handleAddToGoal}
        />

        {/* Expense Form */}
        <ExpenseForm
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          editingExpense={editingExpense}
          onCancelEdit={handleCancelEdit}
        />

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleStartEdit}
          onDelete={handleDeleteExpense}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </div>
  );
}

export default App;