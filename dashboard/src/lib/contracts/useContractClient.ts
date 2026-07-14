/**
 * useContractClient — unified React hook that exposes all three contract
 * clients to UI components.
 *
 * Usage:
 *   const { credentialProtocol, sbtRegistry, zkVerifier } = useContractClient()
 *   const credential = await credentialProtocol.getCredential(1n)
 */

import { useMemo } from 'react'
import * as credentialProtocol from './credentialProtocol'
import * as sbtRegistry from './sbtRegistry'
import * as zkVerifier from './zkVerifier'

export interface ContractClient {
  credentialProtocol: typeof credentialProtocol
  sbtRegistry: typeof sbtRegistry
  zkVerifier: typeof zkVerifier
}

export function useContractClient(): ContractClient {
  // Memoised so component re-renders don't produce new object references.
  return useMemo(
    () => ({ credentialProtocol, sbtRegistry, zkVerifier }),
    [],
  )
}
