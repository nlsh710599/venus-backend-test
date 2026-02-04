import request from 'supertest';
import express from 'express';
import marketRoutes from '../routes/marketRoutes';
import { marketRepository } from '../repositories/marketRepository';
import { HttpStatusCode } from '../constants/httpStatus';

// 1. Mock DB Config to prevent environment variable validation errors
jest.mock('../config/db', () => ({
  default: {
    query: jest.fn(),
  },
}));

// 2. Mock Repository (Intercept at the lowest layer to test the full flow)
jest.mock('../repositories/marketRepository');

// 3. Create a temporary Express App for testing
const app = express();
app.use(express.json());
app.use('/market', marketRoutes);

describe('Market Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /market/tvl', () => {
    it('should return 200 and TVL data', async () => {
      // Mock Repository return value
      (marketRepository.getTvl as jest.Mock).mockResolvedValue('1000000');

      // Use supertest to send a real request
      const response = await request(app).get('/market/tvl?chain_id=1');

      // Verify HTTP status code and body
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '1000000' });

      // Verify that parameters are correctly passed to the Repository (including Middleware processing)
      expect(marketRepository.getTvl).toHaveBeenCalledWith(
        '1',
        undefined,
        undefined,
      );
    });

    it('should return 400 for invalid chain_id (Middleware check)', async () => {
      // Test if Middleware is working effectively
      const response = await request(app).get('/market/tvl?chain_id=invalid');

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      // Repository should not be called if middleware blocks the request
      expect(marketRepository.getTvl).not.toHaveBeenCalled();
    });
  });

  describe('GET /market/liquidity', () => {
    it('should return 200 and Liquidity data', async () => {
      (marketRepository.getMetrics as jest.Mock).mockResolvedValue({
        totalSupply: '200',
        totalBorrow: '50',
      });

      const response = await request(app).get('/market/liquidity');

      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketLiquidity: '150' }); // 200 - 50 = 150
    });
  });

  describe('GET /market/:id/tvl', () => {
    it('should return 404 if ID not found (Error Handling check)', async () => {
      // Simulate Repository returning null (indicating not found)
      (marketRepository.getTvl as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/market/999/tvl');

      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({ error: 'Market ID not found' });
    });
  });
});
