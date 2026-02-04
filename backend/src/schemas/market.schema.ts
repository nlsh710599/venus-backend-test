import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { SUPPORTED_CHAINS } from '../constants/chains';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// ==========================================
// Schemas (Data Models)
// ==========================================

const TvlResponseSchema = z.object({
  marketTvl: z.string().openapi({
    example: '123456',
    description: 'The total value locked in cents',
  }),
});

const LiquidityResponseSchema = z.object({
  marketLiquidity: z.string().openapi({
    example: '50000',
    description: 'The calculated liquidity (Supply - Borrow) in cents',
  }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'Invalid parameters' }),
});

registry.register('TvlResponse', TvlResponseSchema);
registry.register('LiquidityResponse', LiquidityResponseSchema);
registry.register('Error', ErrorSchema);

export type TvlResponse = z.infer<typeof TvlResponseSchema>;
export type LiquidityResponse = z.infer<typeof LiquidityResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorSchema>;

// ==========================================
// Parameters
// ==========================================

const CommonQueryParams = z.object({
  chain_id: z
    .enum(SUPPORTED_CHAINS)
    .optional()
    .openapi({ description: 'Filter by Chain ID (Ethereum=1, BSC=56)' }),
  name: z.string().optional().openapi({ description: 'Filter by Token Name' }),
});

const IdPathParam = z.object({
  id: z.string().openapi({ description: 'The market ID', example: '1' }),
});

export type MarketQueryParams = z.infer<typeof CommonQueryParams>;
export type MarketIdParams = z.infer<typeof IdPathParam>;

// ==========================================
// Routes
// ==========================================

registry.registerPath({
  method: 'get',
  path: '/market/tvl',
  tags: ['Market'],
  summary: 'Retrieve Total Value Locked (TVL)',
  request: {
    query: CommonQueryParams,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: TvlResponseSchema } },
    },
    400: {
      description: 'Invalid parameters',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    500: { description: 'Internal Server Error' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/market/liquidity',
  tags: ['Market'],
  summary: 'Retrieve aggregated Liquidity (Supply - Borrow)',
  request: {
    query: CommonQueryParams,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: LiquidityResponseSchema } },
    },
    500: { description: 'Internal Server Error' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/market/{id}/tvl',
  tags: ['Market'],
  summary: 'Retrieve TVL for a specific market ID',
  request: {
    params: IdPathParam,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: TvlResponseSchema } },
    },
    404: {
      description: 'Market ID not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    500: { description: 'Internal Server Error' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/market/{id}/liquidity',
  tags: ['Market'],
  summary: 'Retrieve Liquidity for a specific market ID',
  request: {
    params: IdPathParam,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: LiquidityResponseSchema } },
    },
    404: {
      description: 'Market ID not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    500: { description: 'Internal Server Error' },
  },
});
