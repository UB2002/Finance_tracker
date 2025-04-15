import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // Handle POST requests for creating transactions
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const { description, amount, category, date } = req.body;
      
      if (!description || !amount || !category || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const transaction = {
        description,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        createdAt: new Date()
      };
      
      const result = await db.collection('transactions').insertOne(transaction);
      return res.status(201).json({ 
        message: 'Transaction added successfully', 
        transactionId: result.insertedId 
      });
      
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error connecting to the database' });
    }
  } 
  
  // Handle GET requests for fetching transactions
  else if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const transactions = await db
        .collection('transactions')
        .find({})
        .sort({ date: -1 })
        .toArray();
      
      return res.status(200).json(transactions);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error fetching transactions' });
    }
  }
  
  // Handle DELETE requests for deleting transactions
  else if (req.method === 'DELETE') {
    try {
      const { db } = await connectToDatabase();
      const transactionId = req.query.id;

      if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required' });
      }

      const objectId = new ObjectId(transactionId);
      const result = await db.collection('transactions').deleteOne({
        _id: objectId
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error deleting transaction' });
    }
  }
  
  // Handle other HTTP methods
  else if (req.method === 'PUT') {
    try {
      const { db } = await connectToDatabase();
      const transactionId = req.query.id;
      const updates = req.body;
  
      if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required' });
      }
  
      // Convert string ID to ObjectId
      const objectId = new ObjectId(transactionId);
  
      // Prepare the update data
      const updateData = {
        description: updates.description,
        amount: parseFloat(updates.amount),
        category: updates.category,
        date: new Date(updates.date)
      };
  
      const result = await db.collection('transactions').updateOne(
        { _id: objectId },
        { $set: updateData }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      return res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error updating transaction' });
    }
  }
  else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}