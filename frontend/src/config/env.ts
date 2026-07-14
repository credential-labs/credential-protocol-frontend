/**
 * Environment configuration with validation
 * Centralizes all environment variable access to ensure consistency and prevent runtime errors
 */

interface EnvConfig {
  STELLAR_NETWORK: string;
  STELLAR_RPC_URL: string;
  CONTRACT_CREDENTIAL_PROTOCOL: string;
  CONTRACT_SBT_REGISTRY: string;
  CONTRACT_ZK_VERIFIER: string;
}

/**
 * Validates and returns environment configuration
 * Throws descriptive errors if required variables are missing
 */
function validateEnv(): EnvConfig {
  const requiredVars = [
    'VITE_STELLAR_NETWORK',
    'VITE_STELLAR_RPC_URL',
    'VITE_CONTRACT_CREDENTIAL_PROTOCOL',
    'VITE_CONTRACT_SBT_REGISTRY',
    'VITE_CONTRACT_ZK_VERIFIER',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `[CredentialProtocol] Missing env vars: ${missingVars.join(', ')}. Using empty defaults.`
    );
  }

  return {
    STELLAR_NETWORK: import.meta.env.VITE_STELLAR_NETWORK ?? 'testnet',
    STELLAR_RPC_URL: import.meta.env.VITE_STELLAR_RPC_URL ?? 'https://soroban-testnet.stellar.org',
    CONTRACT_CREDENTIAL_PROTOCOL: import.meta.env.VITE_CONTRACT_CREDENTIAL_PROTOCOL ?? '',
    CONTRACT_SBT_REGISTRY: import.meta.env.VITE_CONTRACT_SBT_REGISTRY ?? '',
    CONTRACT_ZK_VERIFIER: import.meta.env.VITE_CONTRACT_ZK_VERIFIER ?? '',
  };
}

// Validate and export the configuration
export const env = validateEnv();

// Export individual values for convenience
export const {
  STELLAR_NETWORK,
  STELLAR_RPC_URL,
  CONTRACT_CREDENTIAL_PROTOCOL,
  CONTRACT_SBT_REGISTRY,
  CONTRACT_ZK_VERIFIER,
} = env;