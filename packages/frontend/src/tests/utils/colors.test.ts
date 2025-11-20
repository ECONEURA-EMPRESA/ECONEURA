import { describe, it, expect } from 'vitest';
import { hexToRgb, rgba, lightenColor } from '../../utils/colors';

describe('Color Utils', () => {
  describe('hexToRgb', () => {
    it('convierte hex de 6 dígitos a RGB', () => {
      expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('convierte hex de 3 dígitos a RGB', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#f0f')).toEqual({ r: 255, g: 0, b: 255 });
    });

    it('maneja hex sin #', () => {
      expect(hexToRgb('3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
    });
  });

  describe('rgba', () => {
    it('convierte hex a rgba con opacidad', () => {
      expect(rgba('#3b82f6', 0.5)).toBe('rgba(59, 130, 246, 0.5)');
      expect(rgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)');
      expect(rgba('#ffffff', 0)).toBe('rgba(255, 255, 255, 0)');
    });
  });

  describe('lightenColor', () => {
    it('aclara un color en X%', () => {
      const original = '#3b82f6';
      const lightened = lightenColor(original, 20);
      
      // Verificar que el color aclarado es más claro
      const origRgb = hexToRgb(original);
      const lightRgb = hexToRgb(lightened);
      
      expect(lightRgb.r).toBeGreaterThan(origRgb.r);
      expect(lightRgb.g).toBeGreaterThan(origRgb.g);
      expect(lightRgb.b).toBeGreaterThan(origRgb.b);
    });

    it('no excede 255', () => {
      const lightened = lightenColor('#ffffff', 50);
      const rgb = hexToRgb(lightened);
      
      expect(rgb.r).toBeLessThanOrEqual(255);
      expect(rgb.g).toBeLessThanOrEqual(255);
      expect(rgb.b).toBeLessThanOrEqual(255);
    });

    it('0% retorna color similar', () => {
      const original = '#3b82f6';
      const unchanged = lightenColor(original, 0);
      expect(hexToRgb(unchanged)).toEqual(hexToRgb(original));
    });
  });
});


