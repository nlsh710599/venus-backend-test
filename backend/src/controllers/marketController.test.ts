import { marketController } from './marketController';
import { marketService } from '../services/marketService';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../constants/httpStatus';

import {
  MarketIdParams,
  MarketQueryParams,
  TvlResponse,
  LiquidityResponse,
  ErrorResponse,
} from '../schemas/market.schema';

jest.mock('../config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

jest.mock('../services/marketService');

describe('marketController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = { query: {}, params: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getTvl', () => {
    it('should return 200 and data on success', async () => {
      mockRequest.query = { chain_id: '1', name: 'Token' };
      (marketService.getTvl as jest.Mock).mockResolvedValue('1000');

      await marketController.getTvl(
        mockRequest as Request<
          {},
          TvlResponse | ErrorResponse,
          {},
          MarketQueryParams
        >,
        mockResponse as Response<TvlResponse | ErrorResponse>,
      );

      expect(marketService.getTvl).toHaveBeenCalledWith('1', 'Token');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ marketTvl: '1000' });
    });

    it('should return 500 on unexpected errors', async () => {
      (marketService.getTvl as jest.Mock).mockRejectedValue(
        new Error('DB Error'),
      );

      await marketController.getTvl(
        mockRequest as Request<
          {},
          TvlResponse | ErrorResponse,
          {},
          MarketQueryParams
        >,
        mockResponse as Response<TvlResponse | ErrorResponse>,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });

  describe('getLiquidity', () => {
    it('should return 200 and data on success', async () => {
      mockRequest.query = { chain_id: '56' };
      (marketService.getLiquidity as jest.Mock).mockResolvedValue('500');

      await marketController.getLiquidity(
        mockRequest as Request<
          {},
          LiquidityResponse | ErrorResponse,
          {},
          MarketQueryParams
        >,
        mockResponse as Response<LiquidityResponse | ErrorResponse>,
      );

      expect(marketService.getLiquidity).toHaveBeenCalledWith('56', undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        marketLiquidity: '500',
      });
    });

    it('should return 500 on unexpected errors', async () => {
      (marketService.getLiquidity as jest.Mock).mockRejectedValue(
        new Error('DB Error'),
      );

      await marketController.getLiquidity(
        mockRequest as Request<
          {},
          LiquidityResponse | ErrorResponse,
          {},
          MarketQueryParams
        >,
        mockResponse as Response<LiquidityResponse | ErrorResponse>,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('getTvlById', () => {
    it('should return 200 and data on success', async () => {
      mockRequest.params = { id: '1' };
      (marketService.getTvl as jest.Mock).mockResolvedValue('5000');

      await marketController.getTvlById(
        mockRequest as Request<
          MarketIdParams,
          TvlResponse | ErrorResponse,
          {},
          {}
        >,
        mockResponse as Response<TvlResponse | ErrorResponse>,
      );

      expect(marketService.getTvl).toHaveBeenCalledWith(
        undefined,
        undefined,
        '1',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ marketTvl: '5000' });
    });

    it('should return 404 when service throws "Market not found"', async () => {
      mockRequest.params = { id: '999' };
      (marketService.getTvl as jest.Mock).mockRejectedValue(
        new Error('Market not found'),
      );

      await marketController.getTvlById(
        mockRequest as Request<
          MarketIdParams,
          TvlResponse | ErrorResponse,
          {},
          {}
        >,
        mockResponse as Response<TvlResponse | ErrorResponse>,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatusCode.NOT_FOUND,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Market ID not found',
      });
    });

    it('should return 500 on unexpected errors', async () => {
      mockRequest.params = { id: '1' };
      (marketService.getTvl as jest.Mock).mockRejectedValue(
        new Error('DB Error'),
      );

      await marketController.getTvlById(
        mockRequest as Request<
          MarketIdParams,
          TvlResponse | ErrorResponse,
          {},
          {}
        >,
        mockResponse as Response<TvlResponse | ErrorResponse>,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('getLiquidityById', () => {
    it('should return 200 and data on success', async () => {
      mockRequest.params = { id: '10' };
      (marketService.getLiquidity as jest.Mock).mockResolvedValue('2500');

      await marketController.getLiquidityById(
        mockRequest as Request<
          MarketIdParams,
          LiquidityResponse | ErrorResponse,
          {},
          {}
        >,
        mockResponse as Response<LiquidityResponse | ErrorResponse>,
      );

      expect(marketService.getLiquidity).toHaveBeenCalledWith(
        undefined,
        undefined,
        '10',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        marketLiquidity: '2500',
      });
    });

    it('should return 404 when service throws "Market not found"', async () => {
      mockRequest.params = { id: 'unknown' };
      (marketService.getLiquidity as jest.Mock).mockRejectedValue(
        new Error('Market not found'),
      );

      await marketController.getLiquidityById(
        mockRequest as Request<
          MarketIdParams,
          LiquidityResponse | ErrorResponse,
          {},
          {}
        >,
        mockResponse as Response<LiquidityResponse | ErrorResponse>,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatusCode.NOT_FOUND,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Market ID not found',
      });
    });

    it('should return 500 on unexpected errors', async () => {
      mockRequest.params = { id: '10' };
      (marketService.getLiquidity as jest.Mock).mockRejectedValue(
        new Error('Unexpected Error'),
      );

      await marketController.getLiquidityById(
        mockRequest as Request<
          MarketIdParams,
          LiquidityResponse | ErrorResponse,
          {},
          {}
        >,
        mockResponse as Response<LiquidityResponse | ErrorResponse>,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });
});
