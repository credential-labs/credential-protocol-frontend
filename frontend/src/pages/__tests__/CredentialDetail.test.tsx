import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CredentialDetail from '../CredentialDetail';
import * as credentialProtocol from '../../lib/contracts/credentialProtocol';

jest.mock('../../lib/contracts/credentialProtocol');
jest.mock('../../components/Navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

const mockCredential = {
  id: 1n,
  subject: 'GSUBJECT123456789',
  issuer: 'GISSUER123456789',
  credential_type: 1,
  metadata_hash: new Uint8Array([72, 101, 108, 108, 111]), // "Hello"
  revoked: false,
  expires_at: 1704067200n,
};

describe('CredentialDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display credential details', async () => {
    (credentialProtocol.getCredential as jest.Mock).mockResolvedValue(mockCredential);
    (credentialProtocol.isExpired as jest.Mock).mockResolvedValue(false);
    (credentialProtocol.getAttestors as jest.Mock).mockResolvedValue(['GATT1', 'GATT2']);

    render(
      <BrowserRouter>
        <CredentialDetail />
      </BrowserRouter>,
      { initialEntries: ['/credential/1'] }
    );

    await waitFor(() => {
      expect(screen.getByText(/Credential #1/)).toBeInTheDocument();
      expect(screen.getByText('🎓 Degree')).toBeInTheDocument();
      expect(screen.getByText('✅ Active')).toBeInTheDocument();
    });
  });

  it('should display error when credential fails to load', async () => {
    (credentialProtocol.getCredential as jest.Mock).mockRejectedValue(
      new Error('Credential not found')
    );

    render(
      <BrowserRouter>
        <CredentialDetail />
      </BrowserRouter>,
      { initialEntries: ['/credential/999'] }
    );

    await waitFor(() => {
      expect(screen.getByText('Could Not Load Credential')).toBeInTheDocument();
      expect(screen.getByText('Credential not found')).toBeInTheDocument();
    });
  });

  it('should display attestors list', async () => {
    (credentialProtocol.getCredential as jest.Mock).mockResolvedValue(mockCredential);
    (credentialProtocol.isExpired as jest.Mock).mockResolvedValue(false);
    (credentialProtocol.getAttestors as jest.Mock).mockResolvedValue(['GATT1', 'GATT2']);

    render(
      <BrowserRouter>
        <CredentialDetail />
      </BrowserRouter>,
      { initialEntries: ['/credential/1'] }
    );

    await waitFor(() => {
      expect(screen.getByText('Attestors (2)')).toBeInTheDocument();
    });
  });

  it('should show revoked status', async () => {
    const revokedCred = { ...mockCredential, revoked: true };
    (credentialProtocol.getCredential as jest.Mock).mockResolvedValue(revokedCred);
    (credentialProtocol.isExpired as jest.Mock).mockResolvedValue(false);
    (credentialProtocol.getAttestors as jest.Mock).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <CredentialDetail />
      </BrowserRouter>,
      { initialEntries: ['/credential/1'] }
    );

    await waitFor(() => {
      expect(screen.getByText('🚫 Revoked')).toBeInTheDocument();
    });
  });
});
