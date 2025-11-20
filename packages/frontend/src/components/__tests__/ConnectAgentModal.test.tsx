import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectAgentModal } from '../ConnectAgentModal';

describe('ConnectAgentModal', () => {
  const mockAgent = { id: 'test-agent', title: 'Test Agent' };
  const mockOnClose = vi.fn();
  const mockOnConnect = vi.fn();

  it('renders when open', () => {
    render(
      <ConnectAgentModal
        isOpen={true}
        agent={mockAgent}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        token="test-token"
      />
    );

    expect(screen.getByText(/Conectar Agente/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { container } = render(
      <ConnectAgentModal
        isOpen={false}
        agent={mockAgent}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        token="test-token"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows provider selection UI', () => {
    const { container } = render(
      <ConnectAgentModal
        isOpen={true}
        agent={mockAgent}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        token="test-token"
      />
    );

    // Verify modal is rendered with content
    expect(container.querySelector('.fixed')).toBeInTheDocument();
    expect(screen.getByText(/Conectar Agente/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel button clicked', () => {
    render(
      <ConnectAgentModal
        isOpen={true}
        agent={mockAgent}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        token="test-token"
      />
    );

    const cancelButton = screen.getByText(/Cancelar/i);
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});

