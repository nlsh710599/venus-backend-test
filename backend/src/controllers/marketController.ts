import { Request, Response } from 'express';
import { marketService } from '../services/marketService';
import { HttpStatusCode } from '../constants/httpStatus';
import {
  TvlResponse,
  LiquidityResponse,
  ErrorResponse,
  MarketQueryParams,
  MarketIdParams,
} from '../schemas/market.schema';

/**
 * Handles HTTP requests for Market endpoints.
 */
export const marketController = {
  /**
   * Retrieves the Total Value Locked (TVL).
   * Supports optional filtering by chain ID and token name.
   */
  getTvl: async (
    req: Request<{}, TvlResponse | ErrorResponse, {}, MarketQueryParams>,
    res: Response<TvlResponse | ErrorResponse>,
  ): Promise<void> => {
    try {
      const { chain_id, name } = req.query;

      const marketTvl = await marketService.getTvl(
        chain_id as string,
        name as string,
      );

      res.status(HttpStatusCode.OK).json({ marketTvl });
    } catch (error) {
      console.error('Error in marketController.getTvl:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Retrieves the aggregated Liquidity (Supply - Borrow).
   * Supports optional filtering by chain ID and token name.
   */
  getLiquidity: async (
    req: Request<{}, LiquidityResponse | ErrorResponse, {}, MarketQueryParams>,
    res: Response<LiquidityResponse | ErrorResponse>,
  ): Promise<void> => {
    try {
      const { chain_id, name } = req.query;

      const marketLiquidity = await marketService.getLiquidity(
        chain_id as string,
        name as string,
      );

      res.status(HttpStatusCode.OK).json({ marketLiquidity });
    } catch (error) {
      console.error('Error in marketController.getLiquidity:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Retrieves TVL for a specific market ID.
   */
  getTvlById: async (
    req: Request<MarketIdParams, TvlResponse | ErrorResponse, {}, {}>,
    res: Response<TvlResponse | ErrorResponse>,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const marketTvl = await marketService.getTvl(undefined, undefined, id);

      res.status(HttpStatusCode.OK).json({ marketTvl });
    } catch (error: any) {
      if (error.message === 'Market not found') {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: 'Market ID not found' });
        return;
      }

      console.error('Error in marketController.getTvlById:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Retrieves Liquidity for a specific market ID.
   */
  getLiquidityById: async (
    req: Request<MarketIdParams, LiquidityResponse | ErrorResponse, {}, {}>,
    res: Response<LiquidityResponse | ErrorResponse>,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const marketLiquidity = await marketService.getLiquidity(
        undefined,
        undefined,
        id,
      );

      res.status(HttpStatusCode.OK).json({ marketLiquidity });
    } catch (error: any) {
      if (error.message === 'Market not found') {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: 'Market ID not found' });
        return;
      }

      console.error('Error in marketController.getLiquidityById:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },
};
