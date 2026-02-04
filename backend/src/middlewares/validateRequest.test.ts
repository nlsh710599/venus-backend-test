import { validateChainId, ensureSingleQuery } from './validateRequest';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../constants/httpStatus';

describe('Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = { query: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('validateChainId', () => {
    it('should call next() when chain_id is valid', () => {
      mockRequest.query = { chain_id: '1' };
      validateChainId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should call next() when chain_id is missing (optional)', () => {
      mockRequest.query = {};
      validateChainId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 when chain_id is invalid', () => {
      mockRequest.query = { chain_id: 'invalid_chain' };
      validateChainId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatusCode.BAD_REQUEST,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Invalid chain_id'),
        }),
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('ensureSingleQuery', () => {
    it('should convert array param to single string', () => {
      const middleware = ensureSingleQuery(['name']);
      mockRequest.query = { name: ['tokenA', 'tokenB'] as any }; // Simulate duplicate params

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockRequest.query?.name).toBe('tokenA');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should leave single string param unchanged', () => {
      const middleware = ensureSingleQuery(['name']);
      mockRequest.query = { name: 'tokenA' };

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockRequest.query?.name).toBe('tokenA');
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
