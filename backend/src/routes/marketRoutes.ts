import { Router } from 'express';
import { marketController } from '../controllers/marketController';
import {
  validateChainId,
  ensureSingleQuery,
} from '../middlewares/validateRequest';

const router = Router();

const normalizeMarketParams = ensureSingleQuery(['chain_id', 'asset']);

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

export default router;
