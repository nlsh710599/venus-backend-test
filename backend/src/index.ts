import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import pool from './config/db';
import marketRoutes from './routes/marketRoutes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
// All market-related routes will be prefixed with / (or use /api)
app.use('/', marketRoutes);

/**
 * Health Check / Root Endpoint
 * Kept to verify database connection status as per original implementation.
 */
app.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ response: 'Database connection established successfully' });
  } catch (error) {
    res.json({ response: `Error connecting to database: ${error}` });
  }
});

// Start Server using the port from config
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
