import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import llmRoutes from './routes/llm';
import onboardingRoutes from './routes/onboarding';
import analyticsRoutes from './routes/analytics';
import packRoutes from './routes/packs';
import socialRoutes from './routes/social';
import marketplaceRoutes from './routes/marketplace';
import { authenticate } from './lib/auth';
import profileRoutes from './routes/profile';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const app = express();
app.use(express.json());
app.use(cookieParser());
const webOrigin = process.env.WEB_APP_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: webOrigin, credentials: true }));
app.options('*', cors({ origin: webOrigin, credentials: true }));

// Protect creator endpoints with JWT middleware
app.use('/creator', authenticate);
// Creator onboarding endpoints
app.use('/creator', onboardingRoutes);
// AI Co-Pilot endpoints
app.use('/creator', llmRoutes);
// Analytics endpoints (stub)
app.use('/creator', analyticsRoutes);
// Pack submission endpoint
app.use('/creator/packs', packRoutes);

// Public marketplace endpoints
app.use('/', marketplaceRoutes);

// Reviews & follows endpoints
app.use('/', socialRoutes);

// Creator public profile endpoint
app.use('/', profileRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Creator service listening on port ${port}`);
});
