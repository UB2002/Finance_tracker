import React, { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      {loading ? (
        <p className="mt-6">Loading transactions...</p>
      ) : error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : (
        <TransactionList transactions={transactions} refreshTransactions={fetchTransactions} />
      )}
    </>
  );
};

export default TransactionsPage;