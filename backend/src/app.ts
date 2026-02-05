import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import pool from './config/db';
import marketRoutes from './routes/marketRoutes';
import { HttpStatusCode } from './constants/httpStatus';
import { generateOpenApiDocument } from './utils/swagger';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

const swaggerDocument = generateOpenApiDocument();

// Swagger Route
app.use(
  '/api-docs',
  swaggerUi.serve as any,
  swaggerUi.setup(swaggerDocument) as any,
);

// Mount Routes
app.use('/market', marketRoutes);

// Health Check
app.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ response: 'Database connection established successfully' });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ response: `Error connecting to database: ${error}` });
  }
});

export { app };
