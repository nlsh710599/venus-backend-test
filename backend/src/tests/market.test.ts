import request from 'supertest';
import express from 'express';
import marketRoutes from '../routes/marketRoutes';
import { marketRepository } from '../repositories/marketRepository';
import { HttpStatusCode } from '../constants/httpStatus';

jest.mock('../config/db', () => ({
  default: {
    query: jest.fn(),
  },
}));

jest.mock('../repositories/marketRepository');

const app = express();
app.use(express.json());
app.use('/market', marketRoutes);

describe('Market Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /market/tvl', () => {
    it('should return 200 and TVL data', async () => {
      (marketRepository.getTvl as jest.Mock).mockResolvedValue('1000000');

      const response = await request(app).get('/market/tvl?chain_id=1');

      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '1000000' });
      expect(marketRepository.getTvl).toHaveBeenCalledWith(
        '1',
        undefined,
        undefined,
      );
    });

    it('should handle Big Numbers correctly (TVL)', async () => {
      const bigValue = '900719925474099999999';
      (marketRepository.getTvl as jest.Mock).mockResolvedValue(bigValue);

      const response = await request(app).get('/market/tvl');

      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: bigValue });
    });

    it('should return 400 for invalid chain_id (Middleware check)', async () => {
      const response = await request(app).get('/market/tvl?chain_id=invalid');

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
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
      expect(response.body).toEqual({ marketLiquidity: '150' });
    });

    it('should handle Big Numbers correctly (Liquidity Calculation)', async () => {
      const supply = '10000000000000000000';
      const borrow = '500';
      const expected = '9999999999999999500';

      (marketRepository.getMetrics as jest.Mock).mockResolvedValue({
        totalSupply: supply,
        totalBorrow: borrow,
      });

      const response = await request(app).get('/market/liquidity');

      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketLiquidity: expected });
    });

    it('should return 400 for invalid chain_id (Middleware check)', async () => {
      const response = await request(app).get(
        '/market/liquidity?chain_id=invalid',
      );

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(marketRepository.getMetrics).not.toHaveBeenCalled();
    });
  });

  describe('GET /market/:id/tvl', () => {
    it('should return 200 and TVL data for specific ID', async () => {
      (marketRepository.getTvl as jest.Mock).mockResolvedValue('5000');

      const response = await request(app).get('/market/123/tvl');

      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '5000' });
      expect(marketRepository.getTvl).toHaveBeenCalledWith(
        undefined,
        undefined,
        '123',
      );
    });

    it('should return 404 if ID not found (Error Handling check)', async () => {
      (marketRepository.getTvl as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/market/999/tvl');

      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({ error: 'Market ID not found' });
    });
  });

  describe('GET /market/:id/liquidity', () => {
    it('should return 200 and Liquidity data for specific ID', async () => {
      (marketRepository.getMetrics as jest.Mock).mockResolvedValue({
        totalSupply: '1000',
        totalBorrow: '400',
      });

      const response = await request(app).get('/market/123/liquidity');

      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketLiquidity: '600' });
      expect(marketRepository.getMetrics).toHaveBeenCalledWith(
        undefined,
        undefined,
        '123',
      );
    });

    it('should return 404 if ID not found', async () => {
      (marketRepository.getMetrics as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/market/999/liquidity');

      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({ error: 'Market ID not found' });
    });
  });
});
