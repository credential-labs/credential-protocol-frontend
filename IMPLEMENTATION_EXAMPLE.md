# Frontend Implementation Example

## Credential Verification Component

This example demonstrates how to build a credential verification interface that connects to the Stellar blockchain through the Credential Protocol smart contracts.

### Component Structure

```vue
<template>
  <div class="credential-verifier">
    <div class="search-section">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Enter credential ID or subject address"
        class="search-input"
      />
      <button @click="verifyCredential" :disabled="loading">
        {{ loading ? 'Verifying...' : 'Verify Credential' }}
      </button>
    </div>

    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <div v-if="credential" class="credential-card">
      <div class="credential-header">
        <h2>{{ credential.type }}</h2>
        <span :class="['status', credential.revoked ? 'revoked' : 'active']">
          {{ credential.revoked ? 'REVOKED' : 'ACTIVE' }}
        </span>
      </div>

      <div class="credential-details">
        <div class="detail-row">
          <label>Credential ID:</label>
          <span>{{ credential.id }}</span>
        </div>
        <div class="detail-row">
          <label>Issuer:</label>
          <span>{{ shortenAddress(credential.issuer) }}</span>
        </div>
        <div class="detail-row">
          <label>Subject:</label>
          <span>{{ shortenAddress(credential.subject) }}</span>
        </div>
        <div class="detail-row">
          <label>Issued At:</label>
          <span>{{ formatDate(credential.issuedAt) }}</span>
        </div>
        <div v-if="credential.revoked" class="detail-row">
          <label>Revoked At:</label>
          <span>{{ formatDate(credential.revokedAt) }}</span>
        </div>
      </div>

      <div class="attestation-section">
        <h3>Attestations ({{ attestations.length }})</h3>
        <div v-for="att in attestations" :key="att.id" class="attestation-item">
          <span class="attestor">{{ shortenAddress(att.attestor) }}</span>
          <span class="status">{{ att.status }}</span>
        </div>
      </div>

      <div class="actions">
        <button @click="copyAddress" class="btn-secondary">
          Copy Credential ID
        </button>
        <button @click="shareCredential" class="btn-secondary">
          Share
        </button>
      </div>
    </div>

    <div v-else-if="!loading" class="empty-state">
      <p>Enter a credential ID to verify</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContractService } from '@/services/contract'
import { useNotification } from '@/composables/useNotification'

interface Credential {
  id: string
  type: string
  issuer: string
  subject: string
  issuedAt: number
  revokedAt?: number
  revoked: boolean
}

interface Attestation {
  id: string
  attestor: string
  status: 'pending' | 'approved' | 'rejected'
}

const contractService = useContractService()
const { showNotification } = useNotification()

const searchQuery = ref('')
const loading = ref(false)
const error = ref('')
const credential = ref<Credential | null>(null)
const attestations = ref<Attestation[]>([])

// Fetch credential from smart contract
const verifyCredential = async () => {
  if (!searchQuery.value.trim()) {
    error.value = 'Please enter a credential ID'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Call smart contract to get credential
    const result = await contractService.getCredential(searchQuery.value)
    
    if (!result) {
      error.value = 'Credential not found'
      credential.value = null
      return
    }

    credential.value = {
      id: result.id,
      type: result.credential_type,
      issuer: result.issuer,
      subject: result.subject,
      issuedAt: result.issued_at,
      revokedAt: result.revoked_at,
      revoked: !!result.revoked_at
    }

    // Fetch attestations
    const atts = await contractService.getAttestations(result.id)
    attestations.value = atts.map(att => ({
      id: att.id,
      attestor: att.attestor,
      status: att.status
    }))

    showNotification('Credential verified successfully', 'success')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to verify credential'
    credential.value = null
    showNotification(error.value, 'error')
  } finally {
    loading.value = false
  }
}

// Utility functions
const shortenAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const copyAddress = async () => {
  if (credential.value) {
    await navigator.clipboard.writeText(credential.value.id)
    showNotification('Credential ID copied to clipboard', 'success')
  }
}

const shareCredential = () => {
  if (credential.value) {
    const url = `${window.location.origin}?credential=${credential.value.id}`
    if (navigator.share) {
      navigator.share({
        title: 'Credential Protocol',
        text: `Verify this credential: ${credential.value.type}`,
        url
      })
    } else {
      navigator.clipboard.writeText(url)
      showNotification('Share link copied', 'success')
    }
  }
}
</script>

<style scoped>
.credential-verifier {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-banner {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fee;
  border-left: 4px solid #f00;
  border-radius: 4px;
  color: #c00;
}

.credential-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.credential-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status.active {
  background-color: #d1fae5;
  color: #065f46;
}

.status.revoked {
  background-color: #fee;
  color: #c00;
}

.credential-details {
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row label {
  font-weight: 600;
  color: #666;
}

.attestation-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.attestation-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-secondary {
  flex: 1;
  background-color: #f3f4f6;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}
</style>
```

### Usage in a Page

```typescript
// pages/Verify.vue
<template>
  <div class="verify-page">
    <h1>Verify Professional Credentials</h1>
    <CredentialVerifier />
  </div>
</template>

<script setup lang="ts">
import CredentialVerifier from '@/components/CredentialVerifier.vue'
</script>
```

### Key Features Demonstrated

1. **Smart Contract Integration**: Calls `getCredential()` to fetch on-chain data
2. **Real-time Verification**: Shows credential status and attestation counts
3. **Error Handling**: Graceful error messages and notifications
4. **UI/UX**: Clean, responsive interface with status indicators
5. **Sharing**: Copy to clipboard and social sharing functionality
6. **State Management**: Uses Vue 3 Composition API with reactive refs

### Testing Example

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CredentialVerifier from '@/components/CredentialVerifier.vue'

describe('CredentialVerifier', () => {
  it('displays credential when verified', async () => {
    const wrapper = mount(CredentialVerifier, {
      global: {
        mocks: {
          contractService: {
            getCredential: vi.fn().mockResolvedValue({
              id: '123',
              credential_type: 'Engineer License',
              issuer: 'GBXXXXXXXX',
              subject: 'GBXXXXXXXX',
              issued_at: 1234567890,
              revoked_at: null
            })
          }
        }
      }
    })

    await wrapper.find('input').setValue('123')
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Engineer License')
    expect(wrapper.text()).toContain('ACTIVE')
  })

  it('handles credential not found error', async () => {
    const wrapper = mount(CredentialVerifier)
    
    await wrapper.find('input').setValue('')
    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Please enter a credential ID')
  })
})
```

This implementation demonstrates:
- Component-based architecture
- Smart contract integration
- Error handling and user feedback
- Responsive design
- Testing practices
- Real-world usage patterns
