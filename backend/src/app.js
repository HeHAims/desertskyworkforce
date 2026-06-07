import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import dashboardRoutes from './routes/dashboard.js';
import notifyRoutes from './routes/notify.js';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/healthz', (_request, response) => {
  response.json({ ok: true, service: 'desertsky-backend', env: env.nodeEnv });
});

app.use('/api', dashboardRoutes);
app.use('/api', notifyRoutes);

app.use((error, _request, response, _next) => {
  const status = error?.statusCode ?? 500;
  response.status(status).json({
    error: error?.message ?? 'Internal Server Error'
  });
});

export default app;
