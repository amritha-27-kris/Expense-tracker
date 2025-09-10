import React from 'react';
import { TrendingUp, PieChart, Calendar, AlertCircle } from 'lucide-react';
import { Expense } from '../types/expense';

interface SpendingInsightsProps {
  expenses: Expense[];
}

const SpendingInsights: React.FC<SpendingInsightsProps> = ({ expenses }) => {
  const getCategoryTotals = () => {
    const totals: Record<string, number> = {};
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getMonthlyTrend = () => {
    const monthlyTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      const month = expense.date.slice(0, 7);
      monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
    });
    
    const sortedMonths = Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);
    
    return sortedMonths;
  };

  const getTopExpenses = () => {
    return expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const getAverageDaily = () => {
    if (expenses.length === 0) return 0;
    
    const dates = expenses.map(e => new Date(e.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const daysDiff = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return totalAmount / daysDiff;
  };

  const categoryTotals = getCategoryTotals();
  const monthlyTrend = getMonthlyTrend();
  const topExpenses = getTopExpenses();
  const averageDaily = getAverageDaily();
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6" />
        Spending Insights
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Top Categories
          </h3>
          {categoryTotals.length > 0 ? (
            <div className="space-y-3">
              {categoryTotals.map(([category, amount], index) => {
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${categoryColors[index]}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-600">${amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${categoryColors[index]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage.toFixed(1)}% of total spending
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No expenses to analyze yet.</p>
          )}
        </div>

        {/* Monthly Trend */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Trend
          </h3>
          {monthlyTrend.length > 0 ? (
            <div className="space-y-3">
              {monthlyTrend.map(([month, amount]) => {
                const maxAmount = Math.max(...monthlyTrend.map(([, amt]) => amt));
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                const monthName = new Date(month + '-01').toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                });
                
                return (
                  <div key={month} className="flex items-center gap-3">
                    <div className="w-16 text-sm text-gray-600">{monthName}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 ml-3 min-w-fit">
                          ${amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">Not enough data for trend analysis.</p>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Biggest Category</p>
            <p className="text-lg font-bold text-blue-800">
              {categoryTotals.length > 0 ? categoryTotals[0][0] : 'N/A'}
            </p>
            <p className="text-xs text-blue-600">
              {categoryTotals.length > 0 ? `$${categoryTotals[0][1].toFixed(2)}` : ''}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Daily Average</p>
            <p className="text-lg font-bold text-green-800">${averageDaily.toFixed(2)}</p>
            <p className="text-xs text-green-600">Per day spending</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Largest Expense</p>
            <p className="text-lg font-bold text-purple-800">
              {topExpenses.length > 0 ? `$${topExpenses[0].amount.toFixed(2)}` : '$0.00'}
            </p>
            <p className="text-xs text-purple-600">
              {topExpenses.length > 0 ? topExpenses[0].title : 'None'}
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-600 font-medium">Total Expenses</p>
            <p className="text-lg font-bold text-orange-800">${totalAmount.toFixed(2)}</p>
            <p className="text-xs text-orange-600">{expenses.length} transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingInsights;