import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import courseRoutes from './routes/courseRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cognicraft_ai';

// Cached MongoDB Connection for Vercel Serverless Environments
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
};

// Middleware to ensure DB connection on serverless requests
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CogniCraft AI API Server (Vercel Ready)',
  });
});

// Primary API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Local Development listener
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 CogniCraft AI Server running on http://localhost:${PORT}`);
  });
}

export default app;
