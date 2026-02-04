/**
 * Supported Blockchain Network IDs.
 * - 1: Ethereum Mainnet
 * - 56: BNB Smart Chain (BSC)
 */
export const ChainIds = {
  ETHEREUM: '1',
  BSC: '56',
} as const;

/**
 * Allowlist of supported chain IDs.
 *
 * Cast to string[] to facilitate validation against query parameters
 * (which are typically generic strings).
 */
export const SUPPORTED_CHAINS = Object.values(ChainIds) as string[];
