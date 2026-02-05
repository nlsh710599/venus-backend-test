import request from 'supertest';
import { app } from '../app';
import pool from '../config/db';
import { HttpStatusCode } from '../constants/httpStatus';

describe('E2E Market API Tests (Real DB)', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('GET /market/tvl', () => {
    it('should return total TVL for all markets', async () => {
      const response = await request(app).get('/market/tvl');
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '10000000000006000' });
    });

    it('should filter TVL by chain_id (Chain 1)', async () => {
      const response = await request(app).get('/market/tvl?chain_id=1');
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '1000' });
    });

    it('should filter TVL by name', async () => {
      const response = await request(app).get('/market/tvl?name=Token A');
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '1000' });
    });

    it('should return "0" when no data matches filter', async () => {
      const response = await request(app).get('/market/tvl?name=NonExistent');
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '0' });
    });
  });

  describe('GET /market/liquidity', () => {
    it('should return aggregated Liquidity for all markets', async () => {
      const response = await request(app).get('/market/liquidity');
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketLiquidity: '5000000000004600' });
    });

    it('should handle Big Numbers without precision loss', async () => {
      const response = await request(app).get(
        '/market/liquidity?name=Token Whale',
      );
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketLiquidity: '5000000000000000' });
    });
  });

  describe('GET /market/:id/tvl', () => {
    it('should return TVL for specific valid ID', async () => {
      const response = await request(app).get('/market/1/tvl');
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketTvl: '1000' });
    });

    it('should return 404 for non-existent ID', async () => {
      const response = await request(app).get('/market/9999/tvl');
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({ error: 'Market ID not found' });
    });
  });

  describe('GET /market/:id/liquidity', () => {
    it('should return Liquidity for specific valid ID', async () => {
      const response = await request(app).get('/market/2/liquidity');
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({ marketLiquidity: '4000' });
    });

    it('should return 404 for non-existent ID', async () => {
      const response = await request(app).get('/market/9999/liquidity');
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({ error: 'Market ID not found' });
    });
  });
});
