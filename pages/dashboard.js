import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import BudgetSettings from "@/components/BudgetSettings";

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState({});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

  useEffect(() => {
    setMounted(true);
    const savedBudgets = localStorage.getItem('categoryBudgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    if (!transactions.length) return { totalExpenses: 0, pieData: [], recentTransactions: [] };
    
    const totalExpenses = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

    const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2))
    }));

    return {
      totalExpenses,
      pieData,
      recentTransactions: transactions.slice(0, 5)
    };
  };

  const calculateBudgetComparison = () => {
    if (!transactions.length || !budgets) return [];
    
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

    return Object.entries(budgets).map(([category, budget]) => ({
      category,
      budget: budget,
      actual: categoryTotals[category] || 0,
      remaining: budget - (categoryTotals[category] || 0)
    }));
  };

  const generateInsights = (budgetComparison) => {
    const insights = [];
    budgetComparison.forEach(({ category, budget, actual, remaining }) => {
      if (actual > budget) {
        insights.push(`Over budget in ${category} by $${(actual - budget).toFixed(2)}`);
      } else if (remaining < budget * 0.2) {
        insights.push(`${category} budget is nearly depleted (${((remaining/budget) * 100).toFixed(1)}% remaining)`);
      }
    });
    return insights;
  };

  if (!mounted) return null;
  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  const { totalExpenses, pieData, recentTransactions } = calculateSummary();
  const budgetComparison = calculateBudgetComparison();
  const insights = generateInsights(budgetComparison);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <BudgetSettings onSave={setBudgets} />
      </div>
      
      {/* Existing cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
  
      {/* Budget Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculateBudgetComparison()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
  
      {/* <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {generateInsights(calculateBudgetComparison()).map((insight, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {insight}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card> */}
  
      {/* Existing pie chart and recent transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: $${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
                    </div>
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No recent transactions</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;