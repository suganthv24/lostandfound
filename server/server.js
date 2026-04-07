import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import itemRoutes from './modules/items/item.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Basic Route
app.get('/', (req, res) => {
  res.send('LostandFound API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
