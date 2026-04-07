require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Mount Routes
// All item routes including the contact route
app.use('/api/items', contactRoutes);

// Basic health check route
app.use('/', (req, res) => {
  res.send('College Lost & Found API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
