import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import itemRoutes from './modules/items/item.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Routes
app.use('/api/items', itemRoutes);


// Error Handling Middleware
app.use(errorHandler);

// Basic Route
app.get('/', (req, res) => {
  res.send('LostandFound API is running...');
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lostandfound')
  .then(() => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
