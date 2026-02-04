import { Request, Response, NextFunction } from 'express';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { HttpStatusCode } from '../constants/httpStatus';

/**
 * Validates the 'chain_id' query parameter against supported networks.
 * Sends a 400 Bad Request if the provided chain_id is not in the allowlist.
 */
export const validateChainId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { chain_id } = req.query;

  if (chain_id && !SUPPORTED_CHAINS.includes(String(chain_id))) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      error: `Invalid chain_id. Allowed values: ${SUPPORTED_CHAINS.join(', ')}`,
    });
    return;
  }

  next();
};

/**
 * Middleware factory that normalizes query parameters to ensure they are single strings.
 *
 * Express parses repeated query params as arrays (e.g. ?name=a&name=b -> ['a', 'b']).
 * This middleware forces using the first value to prevent type errors in controllers
 * that expect string inputs.
 *
 * @param keys - Array of query parameter keys to normalize.
 */
export const ensureSingleQuery = (keys: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    keys.forEach((key) => {
      const value = req.query[key];

      if (Array.isArray(value)) {
        req.query[key] = value[0] as any;
      }
    });

    next();
  };
};
