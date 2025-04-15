import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import UpdateTransactionDialog from "./UpdateTransactionDialog";

const TransactionList = ({ transactions, refreshTransactions }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      refreshTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      refreshTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const openUpdateDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateDialogOpen(true);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="mt-6 p-6 shadow-lg w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No transactions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-6 p-6 shadow-lg w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{transaction.category}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      className="bg-white"
                      size="sm"
                      onClick={() => openUpdateDialog(transaction)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white"
                      onClick={() => handleDelete(transaction._id)}
                      disabled={deletingId === transaction._id}
                    >
                      {deletingId === transaction._id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UpdateTransactionDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        transaction={selectedTransaction}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default TransactionList;