import { z } from 'zod';
import { ok, err, type Result } from '../shared/Result';

export type AutomationProvider = 'make' | 'n8n' | 'llm';

export type AutomationTrigger = 'manual' | 'auto' | 'scheduled';

export interface AutomationAgent {
  id: string;
  neuraKey: string;
  neuraId: string;
  name: string;
  description: string;
  provider: AutomationProvider;
  webhookUrl?: string | undefined;
  trigger: AutomationTrigger;
  active: boolean;
}

const baseUrlPatternsToClean = ['https://hook.eu2.make.com', 'https://n8n.econeura.com'];

function sanitizeWebhookUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.trim() === '') return undefined;

  // Mantener la estructura pero evitar anclar a un tenant concreto en código
  const shouldClean = baseUrlPatternsToClean.some((pattern) => url.startsWith(pattern));
  if (shouldClean) {
    return undefined;
  }

  return url;
}

const automationAgentSchema = z.object({
  id: z.string(),
  neuraKey: z.string(),
  neuraId: z.string(),
  name: z.string(),
  description: z.string(),
  provider: z.enum(['make', 'n8n', 'llm']),
  webhookUrl: z.string().url().optional(),
  trigger: z.enum(['manual', 'auto', 'scheduled']),
  active: z.boolean()
});

const automationAgentsSchema = z.array(automationAgentSchema);

const automationAgentsRaw: AutomationAgent[] = [
  // CEO
  {
    id: 'ceo-agenda-consejo',
    neuraKey: 'ceo',
    neuraId: 'a-ceo-01',
    name: 'Agenda Consejo',
    description: 'Preparación de agenda del consejo ejecutivo',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl('https://hook.eu2.make.com/9fcydc16h26m2ejww5p049x7fa57fmqp'),
    trigger: 'manual',
    active: true
  },
  {
    id: 'ceo-anuncio-semanal',
    neuraKey: 'ceo',
    neuraId: 'a-ceo-01',
    name: 'Anuncio Semanal',
    description: 'Comunicación semanal a toda la empresa',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'ceo-resumen-ejecutivo',
    neuraKey: 'ceo',
    neuraId: 'a-ceo-01',
    name: 'Resumen Ejecutivo',
    description: 'Resumen ejecutivo del día',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'ceo-seguimiento-okr',
    neuraKey: 'ceo',
    neuraId: 'a-ceo-01',
    name: 'Seguimiento OKR',
    description: 'Tracking de OKRs trimestrales',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  // IA / CTO IA
  {
    id: 'ia-salud-failover',
    neuraKey: 'ia',
    neuraId: 'a-ia-01',
    name: 'Salud y Failover',
    description: 'Monitoreo de salud y failover de modelos IA',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'ia-cost-tracker',
    neuraKey: 'ia',
    neuraId: 'a-ia-01',
    name: 'Cost Tracker',
    description: 'Tracking de costos de APIs de IA',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'ia-revision-prompts',
    neuraKey: 'ia',
    neuraId: 'a-ia-01',
    name: 'Revisión Prompts',
    description: 'Análisis y optimización de prompts',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'ia-vigilancia-cuotas',
    neuraKey: 'ia',
    neuraId: 'a-ia-01',
    name: 'Vigilancia Cuotas',
    description: 'Monitoreo de cuotas de API',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  // CSO
  {
    id: 'cso-gestor-riesgos',
    neuraKey: 'cso',
    neuraId: 'a-cso-01',
    name: 'Gestor de Riesgos',
    description: 'Gestión de riesgos estratégicos',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'cso-vigilancia-competitiva',
    neuraKey: 'cso',
    neuraId: 'a-cso-01',
    name: 'Vigilancia Competitiva',
    description: 'Monitoreo de competidores',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cso-radar-tendencias',
    neuraKey: 'cso',
    neuraId: 'a-cso-01',
    name: 'Radar de Tendencias',
    description: 'Detección de tendencias del sector',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cso-ma-sync',
    neuraKey: 'cso',
    neuraId: 'a-cso-01',
    name: 'M&A Sync',
    description: 'Sincronización de operaciones M&A',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  // CTO
  {
    id: 'cto-finops-cloud',
    neuraKey: 'cto',
    neuraId: 'a-cto-01',
    name: 'FinOps Cloud',
    description: 'Optimización de costos cloud',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cto-seguridad-cicd',
    neuraKey: 'cto',
    neuraId: 'a-cto-01',
    name: 'Seguridad CI/CD',
    description: 'Seguridad en pipelines CI/CD',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cto-observabilidad-slo',
    neuraKey: 'cto',
    neuraId: 'a-cto-01',
    name: 'Observabilidad SLO',
    description: 'Monitoreo de SLOs y SLAs',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cto-gestion-incidencias',
    neuraKey: 'cto',
    neuraId: 'a-cto-01',
    name: 'Gestión Incidencias',
    description: 'Gestión de incidentes técnicos',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  // CISO
  {
    id: 'ciso-vulnerabilidades',
    neuraKey: 'ciso',
    neuraId: 'a-ciso-01',
    name: 'Vulnerabilidades',
    description: 'Escaneo y gestión de vulnerabilidades',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'ciso-phishing-triage',
    neuraKey: 'ciso',
    neuraId: 'a-ciso-01',
    name: 'Phishing Triage',
    description: 'Análisis y triage de reportes de phishing',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl('https://n8n.econeura.com/webhook/ciso-agent'),
    trigger: 'auto',
    active: true
  },
  {
    id: 'ciso-backup-restore-dr',
    neuraKey: 'ciso',
    neuraId: 'a-ciso-01',
    name: 'Backup/Restore DR',
    description: 'Gestión de backups y disaster recovery',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'ciso-recertificacion',
    neuraKey: 'ciso',
    neuraId: 'a-ciso-01',
    name: 'Recertificación',
    description: 'Recertificación de accesos',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  // COO
  {
    id: 'coo-atrasos-excepciones',
    neuraKey: 'coo',
    neuraId: 'a-coo-01',
    name: 'Atrasos y Excepciones',
    description: 'Monitoreo de pedidos atrasados',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'coo-centro-nps-csat',
    neuraKey: 'coo',
    neuraId: 'a-coo-01',
    name: 'Centro NPS/CSAT',
    description: 'Análisis de satisfacción del cliente',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'coo-latido-sla',
    neuraKey: 'coo',
    neuraId: 'a-coo-01',
    name: 'Latido de SLA',
    description: 'Monitoreo en tiempo real de SLAs',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'coo-torre-control',
    neuraKey: 'coo',
    neuraId: 'a-coo-01',
    name: 'Torre de Control',
    description: 'Dashboard operativo centralizado',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  // CHRO
  {
    id: 'chro-encuesta-pulso',
    neuraKey: 'chro',
    neuraId: 'a-chro-01',
    name: 'Encuesta de Pulso',
    description: 'Encuestas de clima organizacional',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'chro-offboarding-seguro',
    neuraKey: 'chro',
    neuraId: 'a-chro-01',
    name: 'Offboarding Seguro',
    description: 'Proceso de offboarding automatizado',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'chro-onboarding-orquestado',
    neuraKey: 'chro',
    neuraId: 'a-chro-01',
    name: 'Onboarding Orquestado',
    description: 'Onboarding automatizado de nuevos empleados',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl('https://n8n.econeura.com/webhook/chro-agent'),
    trigger: 'manual',
    active: true
  },
  {
    id: 'chro-pipeline-contratacion',
    neuraKey: 'chro',
    neuraId: 'a-chro-01',
    name: 'Pipeline Contratación',
    description: 'Gestión de pipeline de reclutamiento',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  // CMO/CRO
  {
    id: 'cmo-embudo-comercial',
    neuraKey: 'cmo',
    neuraId: 'a-mkt-01',
    name: 'Embudo Comercial',
    description: 'Análisis del funnel comercial',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cmo-salud-pipeline',
    neuraKey: 'cmo',
    neuraId: 'a-mkt-01',
    name: 'Salud de Pipeline',
    description: 'Monitoreo de salud del pipeline de ventas',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cmo-calidad-leads',
    neuraKey: 'cmo',
    neuraId: 'a-mkt-01',
    name: 'Calidad de Leads',
    description: 'Análisis de calidad de leads',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cmo-post-campana',
    neuraKey: 'cmo',
    neuraId: 'a-mkt-01',
    name: 'Post-Campaña',
    description: 'Análisis post-mortem de campañas',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  // CFO
  {
    id: 'cfo-tesoreria',
    neuraKey: 'cfo',
    neuraId: 'a-cfo-01',
    name: 'Tesorería',
    description: 'Gestión de tesorería y cash flow',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl('https://hook.eu2.make.com/zvxc4ls8dysaf53ah2jlpl27ou4j9mq5'),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cfo-variance',
    neuraKey: 'cfo',
    neuraId: 'a-cfo-01',
    name: 'Variance',
    description: 'Análisis de variance vs presupuesto',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl('https://n8n.econeura.com/webhook/cfo-agent'),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cfo-facturacion',
    neuraKey: 'cfo',
    neuraId: 'a-cfo-01',
    name: 'Facturación',
    description: 'Automatización de facturación',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cfo-compras',
    neuraKey: 'cfo',
    neuraId: 'a-cfo-01',
    name: 'Compras',
    description: 'Gestión de órdenes de compra',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  // CDO
  {
    id: 'cdo-linaje',
    neuraKey: 'cdo',
    neuraId: 'a-cdo-01',
    name: 'Linaje',
    description: 'Tracking de linaje de datos',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cdo-calidad-datos',
    neuraKey: 'cdo',
    neuraId: 'a-cdo-01',
    name: 'Calidad de Datos',
    description: 'Monitoreo de calidad de datos',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cdo-catalogo',
    neuraKey: 'cdo',
    neuraId: 'a-cdo-01',
    name: 'Catálogo',
    description: 'Gestión de catálogo de datos',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'cdo-coste-dwh',
    neuraKey: 'cdo',
    neuraId: 'a-cdo-01',
    name: 'Coste DWH',
    description: 'Optimización de costos de data warehouse',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  // CINO
  {
    id: 'cino-patentes-papers',
    neuraKey: 'cino',
    neuraId: 'a-cino-01',
    name: 'Explorador de Patentes y Papers',
    description: 'Búsqueda y análisis de patentes y papers científicos',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'cino-radar-startups',
    neuraKey: 'cino',
    neuraId: 'a-cino-01',
    name: 'Radar de Startups y Ecosistemas',
    description: 'Monitoreo de ecosistema de startups',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cino-prototipos-ia',
    neuraKey: 'cino',
    neuraId: 'a-cino-01',
    name: 'Generador de Prototipos IA/No-Code',
    description: 'Generación automática de prototipos',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  },
  {
    id: 'cino-tendencias-usuario',
    neuraKey: 'cino',
    neuraId: 'a-cino-01',
    name: 'Agente de Tendencias de Usuario',
    description: 'Análisis de tendencias de comportamiento',
    provider: 'n8n',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'auto',
    active: true
  },
  {
    id: 'cino-innovation-lab',
    neuraKey: 'cino',
    neuraId: 'a-cino-01',
    name: 'Innovation Lab',
    description: 'Laboratorio de innovación experimental',
    provider: 'make',
    webhookUrl: sanitizeWebhookUrl(''),
    trigger: 'manual',
    active: true
  }
];

export const automationAgents: AutomationAgent[] = automationAgentsSchema.parse(automationAgentsRaw);

export function getAutomationAgentById(id: string): Result<AutomationAgent, Error> {
  const agent = automationAgents.find((a) => a.id === id && a.active);
  if (!agent) {
    return err(new Error(`Automation agent not found: ${id}`));
  }
  return ok(agent);
}

export function getAutomationAgentsByNeuraKey(neuraKey: string): AutomationAgent[] {
  return automationAgents.filter((a) => a.neuraKey === neuraKey && a.active);
}


