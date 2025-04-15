const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Add this function to properly connect to the database
const connectToDatabase = async () => {
  const client = await clientPromise;
  const db = client.db();
  return { db, client };
};

module.exports = { clientPromise, connectToDatabase };
