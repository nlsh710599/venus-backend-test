import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from '../schemas/market.schema';

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Market Service API',
      version: '1.0.0',
      description: 'Market related endpoints for TVL and Liquidity',
    },
    servers: [{ url: '/' }],
  });
}
