import { Router } from 'express';
import { marketController } from '../controllers/marketController';
import {
  validateChainId,
  ensureSingleQuery,
} from '../middlewares/validateRequest';

const router = Router();

const normalizeMarketParams = ensureSingleQuery(['chain_id', 'name', 'id']);

/**
 * GET /tvl
 * Route to fetch the Total Value Locked.
 */
router.get(
  '/tvl',
  normalizeMarketParams,
  validateChainId,
  marketController.getTvl,
);

/**
 * GET /liquidity
 * Route to fetch the aggregated Liquidity (Supply - Borrow).
 */
router.get(
  '/liquidity',
  normalizeMarketParams,
  validateChainId,
  marketController.getLiquidity,
);

/**
 * GET /:id/tvl
 * Route to fetch the Total Value Locked by id.
 */
router.get('/:id/tvl', normalizeMarketParams, marketController.getTvlById);

/**
 * GET /:id/liquidity
 * Route to fetch the aggregated Liquidity (Supply - Borrow) by id.
 */
router.get(
  '/:id/liquidity',
  normalizeMarketParams,
  marketController.getLiquidityById,
);

export default router;
