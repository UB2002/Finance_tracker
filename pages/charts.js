import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ChartPage = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const transactions = await response.json();
      
      // Filter transactions for selected month and process into daily data
      const [year, month] = selectedMonth.split('-');
      const filteredTransactions = transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getFullYear() === parseInt(year) && 
               date.getMonth() === parseInt(month) - 1;
      });

      // Group by day
      const dailyExpenses = filteredTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const day = date.getDate();
        
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += parseFloat(transaction.amount);
        return acc;
      }, {});

      // Create array for all days in month
      const daysInMonth = new Date(year, month, 0).getDate();
      const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        amount: dailyExpenses[i + 1] || 0
      }));

      setDailyData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Generate month options
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Generate options for the last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }

    return options;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daily Expenses</CardTitle>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {getMonthOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: 'Day of Month', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Amount ($)', angle: -90, position: 'left' }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                  labelFormatter={(day) => `Day ${day}`}
                />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartPage;