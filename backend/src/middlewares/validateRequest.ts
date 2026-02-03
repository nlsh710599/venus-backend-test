import { Request, Response, NextFunction } from 'express';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { HttpStatusCode } from '../constants/httpStatus';

/**
 * Middleware: Validates the 'chain_id' query parameter.
 * If invalid, sends a 400 Bad Request response.
 * If valid or missing (optional), passes control to the next handler.
 */
export const validateChainId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { chain_id } = req.query;

  if (chain_id) {
    if (!SUPPORTED_CHAINS.includes(String(chain_id))) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        error: `Invalid chain_id. Allowed values: ${SUPPORTED_CHAINS.join(', ')}`,
      });
      return;
    }
  }

  // Continue to the controller
  next();
};
