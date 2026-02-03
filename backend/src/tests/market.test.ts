import request from 'supertest';
import express from 'express';
import marketRoutes from '../routes/marketRoutes';
import { marketRepository } from '../repositories/marketRepository';
import { HttpStatusCode } from '../constants/httpStatus';

jest.mock('../config/env', () => ({
  config: {
    port: 8181,
    db: {
      host: 'localhost',
      user: 'test_user',
      password: 'test_password',
      name: 'test_db',
      port: 3306,
    },
  },
}));

// 1. Setup Express App specifically for testing
// We create a new app instance and mount only the market routes.
// This prevents the actual server from starting (app.listen) which happens in index.ts.
const app = express();
app.use(express.json());
app.use('/', marketRoutes);

// 2. Mock the repository
// Jest intercepts imports to 'marketRepository', allowing us to control its behavior.
jest.mock('../repositories/marketRepository');

describe('GET /tvl', () => {
  // Clear all mocks before each test to ensure a clean state.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return total TVL as string when no chain_id is provided', async () => {
    // Arrange: Mock the repository to resolve with a specific value ("1000")
    (marketRepository.getTvl as jest.Mock).mockResolvedValue('1000');

    // Act: Send a GET request to the endpoint
    const res = await request(app).get('/tvl');

    // Assert: Verify the response status and body
    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body).toEqual({ marketTvl: '1000' });

    // Verify that the repository was called with 'undefined' (no filter)
    expect(marketRepository.getTvl).toHaveBeenCalledWith(undefined);
  });

  it('should return filtered TVL when a valid chain_id is provided', async () => {
    // Arrange: Mock the repository to resolve with "500"
    (marketRepository.getTvl as jest.Mock).mockResolvedValue('500');

    // Act: Send a GET request with a query parameter
    const res = await request(app).get('/tvl?chain_id=56');

    // Assert: Verify the response matches the mocked value
    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body).toEqual({ marketTvl: '500' });

    // Verify that the repository received the correct chain ID
    expect(marketRepository.getTvl).toHaveBeenCalledWith('56');
  });

  it('should return 400 error for invalid chain_id', async () => {
    // Act: Send a request with an invalid chain_id
    const res = await request(app).get('/tvl?chain_id=999');

    // Assert: Verify the 400 status and error message
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(res.body).toHaveProperty('error');

    // Verify that the repository was NEVER called (blocked by controller validation)
    expect(marketRepository.getTvl).not.toHaveBeenCalled();
  });

  it('should handle internal errors gracefully', async () => {
    // Arrange: Mock the repository to throw an error
    (marketRepository.getTvl as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );

    // Act
    const res = await request(app).get('/tvl');

    // Assert: Verify the 500 status code
    expect(res.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });
});
