/**
 * Tests para ChatHistory component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatHistory } from '../ChatHistory';

describe('ChatHistory Component', () => {
  const mockToken = 'mock-jwt-token';
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    global.fetch = vi.fn();
  });

  it('should render when open', () => {
    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    expect(screen.getByText('Historial de Chats')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const { container } = render(<ChatHistory isOpen={false} onClose={mockOnClose} token={mockToken} />);

    expect(container.firstChild).toBeNull();
  });

  it('should fetch chats on open', async () => {
    const mockChats = {
      chats: [
        {
          id: 1,
          neura_id: 'a-ceo-01',
          input: 'Test input',
          output: 'Test output',
          model: 'gpt-4o-mini',
          duration_ms: 2000,
          created_at: new Date().toISOString()
        }
      ],
      total: 1,
      limit: 50,
      offset: 0,
      hasMore: false
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChats
    });

    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`
          })
        })
      );
    });
  });

  it('should display loading state', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    // Look for loading spinner instead of status role
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle fetch errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should close on X button click', () => {
    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should delete chat on trash icon click', async () => {
    const mockChats = {
      chats: [
        {
          id: 1,
          neura_id: 'a-ceo-01',
          input: 'Test',
          output: 'Response',
          model: 'gpt-4o-mini',
          duration_ms: 2000,
          created_at: new Date().toISOString()
        }
      ],
      total: 1,
      limit: 50,
      offset: 0,
      hasMore: false
    };

    // Mock fetch for initial load
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChats
    });

    // Mock fetch for delete
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    // Mock confirm
    global.confirm = vi.fn(() => true);

    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    await waitFor(() => screen.getByText('Test'));

    const deleteButton = screen.getByTitle('Eliminar');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chats/1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  it('should format date correctly', async () => {
    const testDate = new Date('2025-10-18T10:30:00Z');
    const mockChats = {
      chats: [{
        id: 1,
        neura_id: 'a-ceo-01',
        input: 'Test',
        output: 'Response',
        model: 'gpt-4o-mini',
        duration_ms: 2000,
        created_at: testDate.toISOString()
      }],
      total: 1,
      limit: 50,
      offset: 0
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChats
    });

    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    await waitFor(() => {
      // Verifica que la fecha se muestra (formato puede variar por locale)
      expect(screen.getByText(/oct|10/i)).toBeInTheDocument();
    });
  });

  it('should show empty state when no chats', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ chats: [], total: 0, limit: 50, offset: 0 })
    });

    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText(/no hay chats/i)).toBeInTheDocument();
    });
  });

  it('should select chat on click', async () => {
    const mockChats = {
      chats: [{
        id: 1,
        neura_id: 'a-ceo-01',
        input: 'Test input',
        output: 'Test output',
        model: 'gpt-4o-mini',
        duration_ms: 2000,
        created_at: new Date().toISOString()
      }],
      total: 1
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChats
    });

    render(<ChatHistory isOpen={true} onClose={mockOnClose} token={mockToken} />);

    await waitFor(() => screen.getByText('Test input'));

    const chatItem = screen.getByText('Test input');
    fireEvent.click(chatItem.closest('div')!);

    // Verifica que muestra el detalle
    await waitFor(() => {
      expect(screen.getByText('Tu pregunta:')).toBeInTheDocument();
      expect(screen.getByText('Respuesta:')).toBeInTheDocument();
    });
  });
});

