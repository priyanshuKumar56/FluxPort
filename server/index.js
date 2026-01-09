import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import collectionsRoutes from './routes/collections.js';
import foldersRoutes from './routes/folders.js';
import savedRequestsRoutes from './routes/savedRequests.js';
import apiLogsRoutes from './routes/apiLogs.js';
import interceptorRulesRoutes from './routes/interceptorRules.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/saved-requests', savedRequestsRoutes);
app.use('/api/api-logs', apiLogsRoutes);
app.use('/api/interceptor-rules', interceptorRulesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FluxPort Backend API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

