import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '../LanguageSelector';

describe('LanguageSelector', () => {
  const mockOnChange = vi.fn();

  it('renders current language flag', () => {
    render(
      <LanguageSelector currentLang="es" onChangeLang={mockOnChange} />
    );

    expect(screen.getByText('🇪🇸')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(
      <LanguageSelector currentLang="es" onChangeLang={mockOnChange} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('calls onChangeLang when language selected', () => {
    render(
      <LanguageSelector currentLang="es" onChangeLang={mockOnChange} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const englishButton = screen.getByText('English');
    fireEvent.click(englishButton);

    expect(mockOnChange).toHaveBeenCalledWith('en');
  });

  it('supports dark mode', () => {
    const { container } = render(
      <LanguageSelector currentLang="es" onChangeLang={mockOnChange} darkMode={true} />
    );

    const button = container.querySelector('button');
    expect(button?.className).toContain('border-slate-600');
  });
});

