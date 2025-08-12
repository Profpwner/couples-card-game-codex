import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const app = express();
app.use(express.json());
app.use(cookieParser());
const webOrigin = process.env.WEB_APP_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: webOrigin, credentials: true }));

// Auth routes
app.use('/api', authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Auth service listening on port ${port}`);
});