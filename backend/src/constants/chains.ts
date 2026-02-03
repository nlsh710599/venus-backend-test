/**
 * Chain IDs supported by the application.
 * 1: Ethereum Mainnet
 * 56: BNB Smart Chain (BSC) Mainnet
 */
export const ChainIds = {
  ETHEREUM: '1',
  BSC: '56',
} as const;

/**
 * Array of supported chain IDs for validation purposes.
 * We cast it to string[] to allow includes() to check against generic strings.
 */
export const SUPPORTED_CHAINS = Object.values(ChainIds) as string[];
