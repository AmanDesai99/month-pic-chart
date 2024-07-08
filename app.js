const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema for the Transactions collection
const transactionSchema = new mongoose.Schema({
  dateOfSale: Date,
  category: String,
  product: {
    title: String,
    description: String,
    price: Number
  },
  region: String
});

// Create the Transactions model
const Transactions = mongoose.model('Transactions', transactionSchema);

// API to get pie chart data for a selected month
app.get('/pie-chart/:month', async (req, res) => {
  const month = req.params.month;

  const data = await Transactions.aggregate([
    {
      $addFields: {
        month: { $month: "$dateOfSale" }
      }
    },
    {
      $match: {
        month: month
      }
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    }
  ]);

  const response = data.map((item) => {
    return { category: item._id, count: item.count };
  });

  res.send(response);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
