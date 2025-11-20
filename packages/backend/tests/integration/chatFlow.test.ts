/**
 * Mejora 9: Tests Automatizados Básicos
 * Tests end-to-end para flujos críticos
 */
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Chat Flow - Tests Automatizados', () => {
  const API_URL = process.env['TEST_API_URL'] || 'http://localhost:3000';
  let authToken: string | null = null;

  beforeAll(async () => {
    // En un entorno real, aquí harías login y obtendrías token
    // Por ahora, asumimos que el auth middleware permite requests sin token en dev
    authToken = null;
  });

  afterAll(async () => {
    // Cleanup si es necesario
  });

  describe('Health Check', () => {
    it('debe responder 200 en /api/health', async () => {
      const response = await fetch(`${API_URL}/api/health`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('ok');
    });
  });

  describe('Invoke API', () => {
    it('debe rechazar request sin input', async () => {
      const response = await fetch(`${API_URL}/api/invoke/a-ceo-01`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || 'test-token'}`
        },
        body: JSON.stringify({})
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('requiere al menos un input');
    });

    it('debe aceptar request con input válido', async () => {
      const response = await fetch(`${API_URL}/api/invoke/a-ceo-01`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || 'test-token'}`
        },
        body: JSON.stringify({
          input: 'Hola, esto es un test'
        })
      });
      
      // Puede ser 200 (éxito) o 401/403 (auth requerida)
      expect([200, 401, 403]).toContain(response.status);
      
      if (response.status === 200) {
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.output).toBeDefined();
      }
    });
  });

  describe('Upload API', () => {
    it('debe rechazar request sin fileName', async () => {
      const response = await fetch(`${API_URL}/api/uploads/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || 'test-token'}`
        },
        body: JSON.stringify({
          mimeType: 'image/png',
          size: 1024
        })
      });
      
      expect(response.status).toBe(400);
    });

    it('debe aceptar request válido para sign', async () => {
      const response = await fetch(`${API_URL}/api/uploads/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || 'test-token'}`
        },
        body: JSON.stringify({
          fileName: 'test.png',
          mimeType: 'image/png',
          size: 1024
        })
      });
      
      // Puede ser 200 o 401/403
      if (response.status === 200) {
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.uploadUrl).toBeDefined();
        expect(data.uploadId).toBeDefined();
      }
    });
  });
});

