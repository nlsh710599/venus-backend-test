import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';

// 1. Enable OpenAPI extension
extendZodWithOpenApi(z);

// 2. Create Registry
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

// Register Schemas to Components (Visible in Swagger UI under "Schemas")
registry.register('TvlResponse', TvlResponseSchema);
registry.register('LiquidityResponse', LiquidityResponseSchema);
registry.register('Error', ErrorSchema);

// Export TypeScript types for Controller
export type TvlResponse = z.infer<typeof TvlResponseSchema>;
export type LiquidityResponse = z.infer<typeof LiquidityResponseSchema>;

// ==========================================
// Parameters
// ==========================================

// Query Parameters (for list queries)
const CommonQueryParams = z.object({
  chain_id: z
    .enum(['1', '56'])
    .optional()
    .openapi({ description: 'Filter by Chain ID (Ethereum=1, BSC=56)' }),
  name: z.string().optional().openapi({ description: 'Filter by Token Name' }),
});

// Path Parameters (for ID queries)
const IdPathParam = z.object({
  id: z
    .string()
    .openapi({ description: 'The market ID', example: 'compound-v3-usdc' }),
});

// ==========================================
// Routes
// ==========================================

// 1. GET /market/tvl
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

// 2. GET /market/liquidity
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

// 3. GET /market/{id}/tvl
registry.registerPath({
  method: 'get',
  path: '/market/{id}/tvl', // Note: Use {id} syntax for path parameters
  tags: ['Market'],
  summary: 'Retrieve TVL for a specific market ID',
  request: {
    params: IdPathParam, // Define Path Parameters here
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

// 4. GET /market/{id}/liquidity
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
