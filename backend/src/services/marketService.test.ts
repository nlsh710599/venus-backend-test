import { marketService } from './marketService';
import { marketRepository } from '../repositories/marketRepository';

jest.mock('../config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

jest.mock('../repositories/marketRepository');

describe('marketService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTvl', () => {
    it('should return TVL when repository returns data', async () => {
      (marketRepository.getTvl as jest.Mock).mockResolvedValue('1000');
      const result = await marketService.getTvl(undefined, undefined, '1');
      expect(result).toBe('1000');
    });

    it('should throw "Market not found" when ID is provided but result is null', async () => {
      (marketRepository.getTvl as jest.Mock).mockResolvedValue(null);
      await expect(
        marketService.getTvl(undefined, undefined, '999'),
      ).rejects.toThrow('Market not found');
    });

    it('should return "0" when no ID is provided and result is null', async () => {
      (marketRepository.getTvl as jest.Mock).mockResolvedValue(null);
      const result = await marketService.getTvl('1');
      expect(result).toBe('0');
    });
  });

  describe('getLiquidity', () => {
    it('should correctly calculate liquidity (Supply - Borrow)', async () => {
      // Supply: 100, Borrow: 40 -> Liquidity: 60
      (marketRepository.getMetrics as jest.Mock).mockResolvedValue({
        totalSupply: '100',
        totalBorrow: '40',
      });

      const result = await marketService.getLiquidity(
        undefined,
        undefined,
        '1',
      );
      expect(result).toBe('60');
    });

    it('should handle large numbers correctly (BigInt)', async () => {
      // MAX_SAFE_INTEGER
      const supply = '900719925474099100';
      const borrow = '100';
      const expected = '900719925474099000';

      (marketRepository.getMetrics as jest.Mock).mockResolvedValue({
        totalSupply: supply,
        totalBorrow: borrow,
      });

      const result = await marketService.getLiquidity();
      expect(result).toBe(expected);
    });

    it('should throw "Market not found" when ID is provided but metrics are null', async () => {
      (marketRepository.getMetrics as jest.Mock).mockResolvedValue(null);
      await expect(
        marketService.getLiquidity(undefined, undefined, '999'),
      ).rejects.toThrow('Market not found');
    });

    it('should return "0" when no ID is provided and metrics are null', async () => {
      (marketRepository.getMetrics as jest.Mock).mockResolvedValue(null);
      const result = await marketService.getLiquidity('1');
      expect(result).toBe('0');
    });
  });
});
