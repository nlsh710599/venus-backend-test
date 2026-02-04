import { Router } from 'express';
import { marketController } from '../controllers/marketController';
import {
  validateChainId,
  ensureSingleQuery,
} from '../middlewares/validateRequest';

const router = Router();

// Middleware to ensure specific query parameters are treated as single strings
const normalizeMarketParams = ensureSingleQuery(['chain_id', 'name', 'id']);

/**
 * Retrieves Total Value Locked (TVL).
 * Supports filtering by 'chain_id' and 'name'.
 */
router.get(
  '/tvl',
  normalizeMarketParams,
  validateChainId,
  marketController.getTvl,
);

/**
 * Retrieves aggregated Liquidity (Supply - Borrow).
 * Supports filtering by 'chain_id' and 'name'.
 */
router.get(
  '/liquidity',
  normalizeMarketParams,
  validateChainId,
  marketController.getLiquidity,
);

/**
 * Retrieves Total Value Locked (TVL) for a specific market ID.
 */
router.get('/:id/tvl', normalizeMarketParams, marketController.getTvlById);

/**
 * Retrieves aggregated Liquidity for a specific market ID.
 */
router.get(
  '/:id/liquidity',
  normalizeMarketParams,
  marketController.getLiquidityById,
);

export default router;
