# Venus - Backend Technical Test Solution

This repository contains the solution for the Venus Backend Technical Assessment. \

## Quick Start

The project is fully containerized. You can run the entire stack using Docker.

### 1. Start the Application

Run the following command in the root directory:

```bash
docker compose up --build
```

Once started, the API server will be accessible at `http://localhost:8181`.

### 2. Access API Documentation (Swagger UI)

After starting the service, visit the URL below to view and test the API endpoints directly:

- **Swagger UI**: http://localhost:8181/api-docs

You can execute requests directly from the Swagger interface to verify TVL and Liquidity calculations.

## API Reference

The API provides endpoints to query Total Value Locked (TVL) and Liquidity data. All financial values are returned as strings to preserve precision for large numbers.

### 1. Get Aggregated TVL

Retrieves the Total Value Locked (TVL) across all markets, or filtered by specific criteria.

- **Endpoint**: `GET /market/tvl`
- **Query Parameters**:
- `chain_id` (optional): Filter by Chain ID (e.g., `1` for Ethereum, `56` for BSC).
- `name` (optional): Filter by token name (e.g., `USDC`).

**Example Request:**

```http
GET /market/tvl?chain_id=56
```

**Example Response:**

```json
{
  "marketTvl": "15000000000"
}
```

### 2. Get Aggregated Liquidity

Retrieves the total liquidity (Total Supply - Total Borrow) across all markets.

- **Endpoint**: `GET /market/liquidity`
- **Query Parameters**:
- `chain_id` (optional): Filter by Chain ID.
- `name` (optional): Filter by token name.

**Example Request:**

```http
GET /market/liquidity?name=USDC
```

**Example Response:**

```json
{
  "marketLiquidity": "5000000000"
}
```

### 3. Get Specific Market TVL

Retrieves the TVL for a specific market identified by its ID.

- **Endpoint**: `GET /market/:id/tvl`
- **Path Parameters**:
- `id`: The unique identifier of the market.

**Example Request:**

```http
GET /market/1/tvl
```

**Example Response:**

```json
{
  "marketTvl": "1000000"
}
```

### 4. Get Specific Market Liquidity

Retrieves the liquidity for a specific market identified by its ID.

- **Endpoint**: `GET /market/:id/liquidity`
- **Path Parameters**:
- `id`: The unique identifier of the market.

**Example Request:**

```http
GET /market/1/liquidity
```

**Example Response:**

```json
{
  "marketLiquidity": "250000"
}
```

## Testing

This project includes two testing strategies. Ensure you have Node.js and Yarn installed to run them locally, or use the Docker command for E2E tests.

First, navigate to the backend directory and install dependencies:

```bash
cd backend
yarn
```

### 1. Unit & Integration Tests

Uses Jest with Mocks to verify business logic, edge cases (e.g., BigInt arithmetic), and error handling without requiring a running database.

```bash
yarn test
```

### 2. End-to-End (E2E) Tests

Uses Docker Compose to spin up an isolated test database and API container, performing black-box testing in a real environment.

```bash
yarn test:e2e
```

_Note: This command will automatically set up the test environment, run the tests, and tear down the containers upon completion._
