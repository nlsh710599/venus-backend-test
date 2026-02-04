import { marketRepository } from '../repositories/marketRepository';
import pool from '../config/db';

// Mock mysql2 pool
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('marketRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTvl', () => {
    it('should return value when DB returns a row', async () => {
      const mockRows = [{ marketTvl: '12345' }];
      (pool.query as jest.Mock).mockResolvedValue([mockRows]);

      const result = await marketRepository.getTvl('1', 'token');
      expect(result).toBe('12345');
    });

    it('should return null when DB returns NULL (no matches)', async () => {
      const mockRows = [{ marketTvl: null }];
      (pool.query as jest.Mock).mockResolvedValue([mockRows]);

      const result = await marketRepository.getTvl(undefined, undefined, '999');
      expect(result).toBeNull();
    });

    it('should construct correct SQL query with filters', async () => {
      (pool.query as jest.Mock).mockResolvedValue([[{ marketTvl: '0' }]]);

      await marketRepository.getTvl('56', 'TokenA');

      const [sql, params] = (pool.query as jest.Mock).mock.calls[0];
      expect(sql).toContain('WHERE chain_id = ? AND name = ?');
      expect(params).toEqual(['56', 'TokenA']);
    });
  });

  describe('getMetrics', () => {
    it('should return object when DB returns data', async () => {
      const mockRows = [{ totalSupply: '100', totalBorrow: '50' }];
      (pool.query as jest.Mock).mockResolvedValue([mockRows]);

      const result = await marketRepository.getMetrics();
      expect(result).toEqual({ totalSupply: '100', totalBorrow: '50' });
    });

    it('should return null when DB returns NULL', async () => {
      const mockRows = [{ totalSupply: null, totalBorrow: null }];
      (pool.query as jest.Mock).mockResolvedValue([mockRows]);

      const result = await marketRepository.getMetrics();
      expect(result).toBeNull();
    });
  });
});
