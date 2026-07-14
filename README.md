# Credential Protocol — Frontend & Dashboard

A modern, full-featured Vue.js and React-based frontend and admin dashboard for the Credential Protocol decentralized professional credential verification platform. This repository contains two distinct applications: a public-facing credential verification interface and a comprehensive admin dashboard for managing credentials, attestations, and quorum slices on the Stellar blockchain.

## 📋 Table of Contents

- [Overview](#overview)
- [Applications](#applications)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Credential Protocol Frontend repository provides comprehensive user interfaces for interacting with the Credential Protocol smart contracts. It enables professionals to:

- Create and manage Quorum Slices (personal trust networks)
- Issue and attest professional credentials
- Verify credentials from other professionals
- Manage Soulbound Tokens (SBTs) tied to their Stellar identity
- Track credential status and attestation progress
- Monitor licensing board and employer verifications

This split repository contains only frontend-related code (Vue.js apps, React components, UI assets, and related tests), separated from the backend API and smart contract layers for independent development, deployment, and scaling.

## 📦 Applications

### 1. Frontend (`/frontend`)

A Vue.js 3 + Vite + TypeScript single-page application (SPA) for:
- Public credential verification
- Credential issuance workflows
- Quorum Slice creation and management
- Attestation status tracking
- Wallet integration with Freighter/Stellar wallets

**Key Features:**
- Real-time credential verification
- Interactive Quorum Slice builder
- Error boundary and global state management
- Responsive UI with Tailwind CSS
- WebSocket support for live updates

**Live Demo**: https://frontend-ch9j07hhg-uchechithelmaonye-cpus-projects.vercel.app

### 2. Dashboard (`/dashboard`)

A separate Vite-powered React application for:
- Admin credential management
- Attestation panel for reviewers
- Credential card components
- Batch credential operations
- SBT burn and revocation management

**Key Features:**
- Credential dashboard with filtering/sorting
- Attestation interface for multiple credentials
- Credential card display with metadata
- Empty state handling and error boundaries
- Real-time sync with backend

**Live Demo**: https://dashboard-lxqqd04dw-uchechithelmaonye-cpus-projects.vercel.app

## 🔧 Prerequisites

### System Requirements
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or yarn/pnpm)
- **Git**: 2.x or higher

### Stellar Requirements
- **Freighter Wallet**: Browser extension for Stellar account management
- **Stellar Testnet Account**: Free testnet account from https://friendbot.stellar.org
- **Environment Setup**: Stellar Network configuration (testnet/mainnet/futurenet/standalone)

### Development Tools (Optional)
- **VSCode**: Recommended IDE with Volar extension for Vue
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **Vitest**: For unit testing

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/credential-labs/credential-protocol-frontend.git
cd credential-protocol-frontend
```

### 2. Install Dependencies

For the main frontend:
```bash
cd frontend
npm install
```

For the dashboard:
```bash
cd ../dashboard
npm install
```

### 3. Environment Configuration

Copy example environment files:

```bash
# Frontend environment
cp frontend/.env.example frontend/.env.local

# Dashboard environment
cp dashboard/.env.example dashboard/.env.local
```

Configure the environment variables in each `.env.local`:

```env
# Stellar Network Configuration
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Smart Contract Addresses (deployed)
VITE_CONTRACT_CREDENTIAL_PROTOCOL=CBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_CONTRACT_SBT_REGISTRY=CBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_CONTRACT_ZK_VERIFIER=CBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# API Configuration
VITE_API_URL=https://api.credential-labs.org
VITE_API_WEBSOCKET_URL=wss://api.credential-labs.org/ws

# Feature Flags
VITE_ENABLE_ZK_VERIFICATION=false
VITE_ENABLE_BATCH_OPERATIONS=true
VITE_ENABLE_ANALYTICS=true
```

## 🚀 Development

### Running the Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Running the Dashboard Development Server

```bash
cd dashboard
npm run dev
```

The dashboard will be available at `http://localhost:5174`

### Hot Module Replacement (HMR)

Both applications support HMR for instant feedback during development. Changes to `.vue`, `.tsx`, or `.ts` files are reflected in the browser without full page refresh.

### Development with Local Backend

To test with a local API server:

1. Start the API server (see credential-protocol-api repo)
2. Update `VITE_API_URL` in `.env.local` to `http://localhost:3000`
3. Restart the frontend dev server

## 🏗️ Architecture

### Project Structure

```
credential-protocol-frontend/
├── frontend/                       # Main Vue.js application
│   ├── src/
│   │   ├── components/            # Reusable Vue components
│   │   ├── pages/                 # Page components (router views)
│   │   ├── stores/                # Pinia state management
│   │   ├── services/              # API and contract services
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── utils/                 # Utility functions
│   │   ├── App.vue                # Root component
│   │   └── main.ts                # Application entry point
│   ├── public/                    # Static assets
│   ├── tests/                     # Unit and integration tests
│   ├── vite.config.ts             # Vite configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── package.json               # Dependencies
│   └── .env.example               # Environment template
│
├── dashboard/                      # React admin dashboard
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # React Context API
│   │   ├── services/              # API services
│   │   ├── types/                 # TypeScript types
│   │   ├── App.tsx                # Root component
│   │   └── main.tsx               # Application entry point
│   ├── public/                    # Static assets
│   ├── vite.config.ts             # Vite configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── package.json               # Dependencies
│   └── .env.example               # Environment template
│
├── public/                         # Shared public assets
├── .github/                        # GitHub workflows
├── package.json                    # Root package configuration
├── README.md                       # This file
└── LICENSE                         # MIT License

```

### Frontend Application Flow

```
User Login (Freighter Wallet)
    ↓
Authenticate with Stellar Account
    ↓
Fetch User Credentials & Quorum Slices
    ↓
Display Dashboard/Verification Interface
    ↓
Interact with Smart Contracts via API
    ↓
Update State & UI
```

### Component Hierarchy (Frontend)

```
App.vue
├── Header (Navigation, Wallet Connection)
├── Router Views
│   ├── Verify Page (Public verification interface)
│   ├── Dashboard (User credentials & slices)
│   ├── Issuance Form (Create new credentials)
│   └── Quorum Slice Builder (Create/manage trust networks)
└── Footer
```

### Dashboard Component Hierarchy

```
App.tsx
├── Navigation
├── Main Content
│   ├── Credential Dashboard
│   │   ├── Credential Card (per credential)
│   │   ├── Attestation Panel (review/attest)
│   │   └── Filter/Sort Controls
│   └── Admin Controls
└── Sidebar (Navigation Links)
```

## ✨ Features

### Frontend Features

- **Wallet Integration**: Connect with Freighter/Stellar wallets
- **Credential Verification**: Search and verify professional credentials
- **Quorum Slice Management**: Create and manage personal trust networks
- **Credential Issuance**: Issue new credentials with metadata
- **Status Tracking**: Monitor credential and attestation status
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Responsive Design**: Mobile and desktop support
- **Dark/Light Mode**: Theme switching (optional)
- **Real-time Updates**: WebSocket integration for live data

### Dashboard Features

- **Credential List**: Browse all issued credentials
- **Attestation Panel**: Review and attest credentials
- **Batch Operations**: Handle multiple credentials efficiently
- **SBT Management**: Mint, burn, and revoke Soulbound Tokens
- **Analytics Dashboard**: Track credential metrics and trends
- **User Management**: Manage issuer and attestor accounts
- **Audit Logs**: Track all credential state changes
- **Admin Controls**: Configure credential types and rules

## 🛠️ Technology Stack

### Frontend (Vue.js Application)

- **Framework**: Vue.js 3.4+
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.x
- **State Management**: Pinia
- **Routing**: Vue Router 4.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Headless UI components
- **Icons**: Heroicons or Font Awesome
- **HTTP Client**: Axios or Fetch API
- **WebSocket**: Socket.io or native WebSocket
- **Testing**: Vitest + Vue Test Utils

### Dashboard (React Application)

- **Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.x
- **State Management**: React Context API / Redux (if needed)
- **Styling**: Tailwind CSS 3.x + PostCSS
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

### Common Dependencies

- **Stellar SDK**: @stellar/js-sdk - For Stellar account and contract interaction
- **Soroban Client**: soroban-client - For smart contract calls
- **Web3 Utilities**: Various web3 helper libraries

## 📂 Project Structure Details

### Frontend Directory Breakdown

```
frontend/src/
├── components/
│   ├── WalletConnect.vue           # Wallet connection component
│   ├── CredentialCard.vue          # Credential display card
│   ├── QuorumSliceBuilder.vue      # Quorum Slice creation UI
│   ├── AttestationPanel.vue        # Attestation workflow
│   └── ErrorBoundary.vue           # Error handling
├── pages/
│   ├── Verify.vue                  # Public verification page
│   ├── Dashboard.vue               # User dashboard
│   ├── IssuanceForm.vue            # Credential issuance
│   └── NotFound.vue                # 404 page
├── stores/
│   ├── auth.ts                     # Authentication state (Pinia)
│   ├── credentials.ts              # Credentials state
│   ├── slices.ts                   # Quorum Slices state
│   └── ui.ts                       # UI state (modals, loading, etc.)
├── services/
│   ├── stellar.ts                  # Stellar account operations
│   ├── contract.ts                 # Smart contract interactions
│   ├── api.ts                      # Backend API calls
│   └── websocket.ts                # Real-time updates
├── types/
│   ├── credential.ts               # Credential interfaces
│   ├── slice.ts                    # Quorum Slice interfaces
│   └── contract.ts                 # Smart contract types
└── utils/
    ├── formatting.ts               # Format utilities
    ├── validation.ts               # Input validation
    └── helpers.ts                  # Common helpers
```

### Dashboard Directory Breakdown

```
dashboard/src/
├── components/
│   ├── CredentialCard.tsx          # Credential display
│   ├── AttestationPanel.tsx        # Attestation interface
│   ├── CredentialList.tsx          # Filterable credential list
│   └── AdminPanel.tsx              # Admin controls
├── pages/
│   ├── Dashboard.tsx               # Main dashboard
│   ├── Analytics.tsx               # Analytics page
│   └── AdminSettings.tsx           # Admin settings
├── hooks/
│   ├── useCredentials.ts           # Credentials hook
│   ├── useAttestation.ts           # Attestation hook
│   └── useAuth.ts                  # Authentication hook
├── context/
│   ├── AuthContext.tsx             # Auth provider
│   └── CredentialContext.tsx       # Credentials provider
├── services/
│   ├── api.ts                      # API client
│   ├── contract.ts                 # Contract interactions
│   └── storage.ts                  # Local storage utils
└── types/
    ├── credential.ts               # Credential types
    ├── attestation.ts              # Attestation types
    └── admin.ts                    # Admin types
```

## ⚙️ Configuration

### Vite Configuration

Both applications use `vite.config.ts` for build optimization:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'  // Frontend
import react from '@vitejs/plugin-react'  // Dashboard

export default defineConfig({
  plugins: [vue()],  // or react()
  server: {
    port: 5173,  // or 5174 for dashboard
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,  // Set to true for production debugging
  },
})
```

### TypeScript Configuration

Strict mode enabled for type safety:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skip": [],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",  // Frontend uses vue template syntax
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  }
}
```

## 📝 Scripts

### Frontend Scripts

```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Dashboard Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Tests
npm run test
npm run test:watch

# Linting
npm run lint
npm run format
```

## 🧪 Testing

### Frontend Testing

Unit tests for Vue components:

```bash
cd frontend
npm run test
```

Example test structure:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CredentialCard from '@/components/CredentialCard.vue'

describe('CredentialCard', () => {
  it('renders credential information', () => {
    const wrapper = mount(CredentialCard, {
      props: { credential: mockCredential }
    })
    expect(wrapper.text()).toContain('Engineer License')
  })
})
```

### Dashboard Testing

React component tests:

```bash
cd dashboard
npm run test
```

Example test:
```typescript
import { render, screen } from '@testing-library/react'
import CredentialCard from '@/components/CredentialCard'

describe('CredentialCard', () => {
  it('displays credential info', () => {
    render(<CredentialCard credential={mockData} />)
    expect(screen.getByText('Engineer License')).toBeInTheDocument()
  })
})
```

## 🚀 Deployment

### Frontend Deployment

Build for production:
```bash
cd frontend
npm run build
```

Deploy `dist/` to:
- **Vercel**: Connect GitHub repo, auto-deploys on push
- **Netlify**: Drag & drop or connect GitHub
- **AWS S3 + CloudFront**: For enterprise deployments
- **Docker**: Containerize and deploy to Kubernetes

### Dashboard Deployment

```bash
cd dashboard
npm run build
```

Same deployment options as frontend. Consider deploying on a separate subdomain or port to isolate admin access.

### Environment-Specific Builds

```bash
# Testnet build
VITE_STELLAR_NETWORK=testnet npm run build

# Mainnet build (production)
VITE_STELLAR_NETWORK=mainnet npm run build
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes with descriptive messages: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request with detailed description

### Code Standards

- Follow ESLint and Prettier configurations
- Write tests for new features
- Update README for significant changes
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 📚 Additional Resources

- [Stellar Documentation](https://developers.stellar.org)
- [Soroban Smart Contracts](https://soroban.stellar.org)
- [Vue.js 3 Guide](https://vuejs.org)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

## 🆘 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/credential-labs/credential-protocol-frontend/issues)
- Check existing issues for solutions
- Provide detailed reproduction steps for bugs
- Include environment details (OS, Node version, etc.)

## 🌟 Acknowledgments

- [Stellar Development Foundation](https://stellar.org) for Soroban
- [Vite](https://vitejs.dev) team for the build tool
- [Vue.js](https://vuejs.org) and [React](https://react.dev) communities
- [Tailwind CSS](https://tailwindcss.com) for styling utilities

---

**Made with ❤️ by the Credential Labs team**
