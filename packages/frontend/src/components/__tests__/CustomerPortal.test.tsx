import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerPortal } from '../CustomerPortal';

describe('CustomerPortal', () => {
  const mockOnClose = vi.fn();

  it('renders when open', async () => {
    render(
      <CustomerPortal isOpen={true} onClose={mockOnClose} token="test-token" />
    );

    await waitFor(() => {
      expect(screen.getByText('Portal del Cliente')).toBeInTheDocument();
    });
  });

  it('does not render when closed', () => {
    const { container } = render(
      <CustomerPortal isOpen={false} onClose={mockOnClose} token="test-token" />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows three tabs', async () => {
    render(
      <CustomerPortal isOpen={true} onClose={mockOnClose} token="test-token" />
    );

    await waitFor(() => {
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });

    expect(screen.getByText('Facturación')).toBeInTheDocument();
    expect(screen.getByText('Seguridad')).toBeInTheDocument();
  });

  it('switches tabs on click', async () => {
    render(
      <CustomerPortal isOpen={true} onClose={mockOnClose} token="test-token" />
    );

    await waitFor(() => {
      expect(screen.getByText('Información Personal')).toBeInTheDocument();
    });

    const billingTab = screen.getByText('Facturación');
    fireEvent.click(billingTab);

    expect(screen.getByText('Plan Actual')).toBeInTheDocument();
  });

  it('calls onClose when X clicked', async () => {
    render(
      <CustomerPortal isOpen={true} onClose={mockOnClose} token="test-token" />
    );

    await waitFor(() => {
      expect(screen.getByText('Portal del Cliente')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading state initially', () => {
    render(
      <CustomerPortal isOpen={true} onClose={mockOnClose} token="test-token" />
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });
});

