import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/auth.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Simple test root
app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lostandfound", {
// no longer needed in mongoose 6+ but keeping standard options is fine, actually just string is enough
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
