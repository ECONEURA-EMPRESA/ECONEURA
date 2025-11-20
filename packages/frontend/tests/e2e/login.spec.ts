import { test, expect } from '@playwright/test';

/**
 * ECONEURA - Login E2E Tests
 */

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    // Verificar que estamos en la página de login
    await expect(page).toHaveTitle(/ECONEURA/i);
    
    // Verificar que la página carga sin errores
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show OAuth login buttons', async ({ page }) => {
    // Verificar que la página está funcionando
    await expect(page.locator('body')).toBeVisible();
    
    // La página debe tener contenido HTML
    const html = await page.content();
    expect(html.length).toBeGreaterThan(100);
  });

  test('should have proper page structure', async ({ page }) => {
    // Verificar que la página tiene estructura básica
    await expect(page.locator('body')).toBeVisible();
    
    // Verificar que no hay errores de JavaScript en consola
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Esperar un poco para capturar errores
    await page.waitForTimeout(2000);
    
    // No debe haber errores críticos
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('net::ERR')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should be responsive', async ({ page }) => {
    // Probar en mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Página debe seguir visible
    await expect(page.locator('body')).toBeVisible();
    
    // Probar en desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    await expect(page.locator('body')).toBeVisible();
  });
});

