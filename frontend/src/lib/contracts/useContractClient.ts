/**
 * useContractClient.ts — Unified React hook that exposes all three contract clients.
 *
 * Usage:
 *   const { credentialProtocol, sbtRegistry, zkVerifier } = useContractClient();
 *   const cred = await credentialProtocol.getCredential(1n);
 */

import * as credentialProtocol from './credentialProtocol';
import * as sbtRegistry from './sbtRegistry';
import * as zkVerifier from './zkVerifier';

export type { Credential, QuorumSlice } from './credentialProtocol';
export type { SoulboundToken } from './sbtRegistry';
export type { ClaimType, ProofRequest } from './zkVerifier';

export interface ContractClient {
  credentialProtocol: typeof credentialProtocol;
  sbtRegistry: typeof sbtRegistry;
  zkVerifier: typeof zkVerifier;
  /** Contract addresses resolved from env vars (empty string if not set). */
  addresses: {
    credentialProtocol: string;
    sbtRegistry: string;
    zkVerifier: string;
  };
}

/**
 * Returns stable references to all three typed contract clients.
 * The hook itself is synchronous — individual methods return Promises.
 */
export function useContractClient(): ContractClient {
  return {
    credentialProtocol,
    sbtRegistry,
    zkVerifier,
    addresses: {
      credentialProtocol: import.meta.env.VITE_CONTRACT_CREDENTIAL_PROTOCOL ?? '',
      sbtRegistry: import.meta.env.VITE_CONTRACT_SBT_REGISTRY ?? '',
      zkVerifier: import.meta.env.VITE_CONTRACT_ZK_VERIFIER ?? '',
    },
  };
}
