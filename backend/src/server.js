import './lib/env.js';

import express from 'express';
import cors from 'cors';
import categoryRoutes from './routes/categories.js';
import expenseRoutes from './routes/expenses.js';
import {authMiddleware} from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// 인증 미들웨어 적용
app.use('/api', authMiddleware);

// 라우트
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({status: 'ok', message: 'Server is running'});
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
});
