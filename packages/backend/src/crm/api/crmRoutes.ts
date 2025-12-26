/**
 * ECONEURA - CRM API Routes
 * 
 * Rutas principales del CRM para Marketing y Ventas.
 * Todas requieren autenticación.
 */

import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { listLeads } from '../infra/postgresLeadStore';
import { getSalesMetrics } from '../application/getSalesMetrics';
import { logger } from '../../shared/logger';
import type { RequestWithId } from '../../api/http/middleware/requestId';
import { sendResult } from '../../api/http/httpResult';

const router = Router();

// Schema de validación para query params de leads
const listLeadsQuerySchema = z.object({
  department: z.enum(['cmo', 'cso']),
  status: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  search: z.string().optional()
});

/**
 * GET /api/crm/leads
 * Listar leads con filtros
 */
router.get('/leads', async (req: Request, res: Response) => {
  try {
    const reqWithId = req as RequestWithId;

    // ✅ CORRECCIÓN: Logging para debugging
    logger.debug('[CRM Routes] Leads request', {
      query: req.query,
      department: req.query['department'],
      limit: req.query['limit'],
      offset: req.query['offset']
    });

    // Validar query params con Zod
    const parsed = listLeadsQuerySchema.parse(req.query);

    const filters: {
      department: 'cmo' | 'cso';
      status?: string;
      limit?: number;
      offset?: number;
      search?: string;
    } = {
      department: parsed.department
    };

    if (parsed.status) {
      filters.status = parsed.status;
    }
    if (parsed.limit) {
      filters.limit = parsed.limit;
    }
    if (parsed.offset) {
      filters.offset = parsed.offset;
    }
    if (parsed.search) {
      filters.search = parsed.search;
    }

    // MOCK DATA FOR DEV MODE
    if (process.env.USE_MEMORY_STORE === 'true') {
      logger.info('[CRM Routes] Returning MOCK leads (USE_MEMORY_STORE=true)');
      return res.json({
        success: true,
        data: {
          leads: [
            { id: 'lead-1', name: 'Empresa A', status: 'new', value: 5000, department: 'cmo' },
            { id: 'lead-2', name: 'Empresa B', status: 'contacted', value: 12000, department: 'cmo' },
            { id: 'lead-3', name: 'Empresa C', status: 'qualified', value: 8500, department: 'cmo' }
          ],
          total: 3
        }
      });
    }

    const result = await listLeads(filters);

    if (result.success) {
      logger.info('[CRM Routes] Leads obtenidos', {
        department: parsed.department,
        count: result.data.leads.length,
        total: result.data.total,
        requestId: reqWithId.id
      });
    }

    sendResult(res, result);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Parámetros de consulta inválidos',
        details: error.issues,
        code: 'INVALID_QUERY_PARAMS'
      });
    }

    logger.error('[CRM Routes] Error obteniendo leads', {
      error: error instanceof Error ? error.message : String(error),
      requestId: (req as RequestWithId).id
    });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
    return;
  }
});

/**
 * GET /api/crm/sales-metrics
 * Obtener métricas de ventas (optimizado con caché)
 */
// Schema de validación para query params de sales-metrics
const salesMetricsQuerySchema = z.object({
  department: z.enum(['cmo', 'cso']),
  period: z.enum(['day', 'week', 'month', 'year', 'all']).optional().default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

router.get('/sales-metrics', async (req: Request, res: Response) => {
  try {
    const reqWithId = req as RequestWithId;

    // ✅ CORRECCIÓN: Logging para debugging
    logger.debug('[CRM Routes] Sales metrics request', {
      query: req.query,
      department: req.query['department'],
      period: req.query['period']
    });
    logger.debug('[CRM Routes] Debug Environment', {
      useMemoryStore: process.env.USE_MEMORY_STORE,
      nodeEnv: process.env.NODE_ENV
    });

    // Validar query params con Zod
    const parsed = salesMetricsQuerySchema.parse(req.query);

    // MOCK DATA FOR DEV MODE
    if (process.env.USE_MEMORY_STORE === 'true') {
      logger.info('[CRM Routes] Returning MOCK sales metrics (USE_MEMORY_STORE=true)');
      return res.json({
        success: true,
        data: {
          total_revenue: 150000,
          growth: 12.5,
          active_deals: 45,
          avg_deal_size: 3300,
          pipeline_value: 450000
        }
      });
    }

    const result = await getSalesMetrics(
      parsed.department,
      parsed.period,
      parsed.startDate,
      parsed.endDate
    );

    if (result.success) {
      logger.info('[CRM Routes] Sales metrics obtenidas', {
        department: parsed.department,
        period: parsed.period,
        total_revenue: result.data.total_revenue,
        requestId: reqWithId.id
      });
    }

    sendResult(res, result);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Parámetros de consulta inválidos',
        details: error.issues,
        code: 'INVALID_QUERY_PARAMS'
      });
    }

    logger.error('[CRM Routes] Error obteniendo sales metrics', {
      error: error instanceof Error ? error.message : String(error),
      requestId: (req as RequestWithId).id
    });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
    return;
  }
});


/**
 * GET /api/crm/pipeline
 * Get pipeline stages and conversion metrics
 */
router.get('/pipeline', async (req: Request, res: Response) => {
  // Mock data for pipeline
  return res.json({
    success: true,
    data: [
      { stage: 'Lead', amount: 50000, conversion: 100, progress: 100, color: '#3B82F6', value: 50000 },
      { stage: 'MQL', amount: 35000, conversion: 70, progress: 70, color: '#8B5CF6', value: 35000 },
      { stage: 'SQL', amount: 25000, conversion: 50, progress: 50, color: '#10B981', value: 25000 },
      { stage: 'Negotiation', amount: 15000, conversion: 60, progress: 30, color: '#F59E0B', value: 15000 },
      { stage: 'Closed Won', amount: 12000, conversion: 80, progress: 24, color: '#6366F1', value: 12000 }
    ]
  });
});

/**
 * GET /api/crm/agents
 * Get agent impact metrics
 */
router.get('/agents', async (req: Request, res: Response) => {
  // Mock data for agents
  return res.json({
    success: true,
    data: [
      { agent: 'Sarah Miller', impact: '+$125k', status: 'active', icon: 'User' },
      { agent: 'John Smith', impact: '+$98k', status: 'active', icon: 'User' },
      { agent: 'AI Agent Alpha', impact: '+$245k', status: 'active', icon: 'Bot' }
    ]
  });
});

/**
 * GET /api/crm/alerts
 * Get CRM alerts
 */
router.get('/alerts', async (req: Request, res: Response) => {
  // Mock data for alerts
  return res.json({
    success: true,
    data: [
      { type: 'warning', message: 'High churn risk detected in Enterprise segment', ts: new Date().toISOString() },
      { type: 'success', message: 'Q4 Revenue target exceeded by 15%', ts: new Date().toISOString() },
      { type: 'info', message: 'New lead attribution model enabled', ts: new Date().toISOString() }
    ]
  });
});

/**
 * GET /api/crm/revenue-trend
 * Get revenue trend data
 */
router.get('/revenue-trend', async (req: Request, res: Response) => {
  // Mock data for revenue trend
  return res.json({
    success: true,
    data: [
      { month: 'Jan', revenue: 45000, target: 40000 },
      { month: 'Feb', revenue: 52000, target: 42000 },
      { month: 'Mar', revenue: 49000, target: 45000 },
      { month: 'Apr', revenue: 61000, target: 48000 },
      { month: 'May', revenue: 55000, target: 50000 },
      { month: 'Jun', revenue: 67000, target: 55000 }
    ]
  });
});

export { router as crmRoutes };

