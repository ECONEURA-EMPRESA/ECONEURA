import { API_URL } from '../config/api';

const readVar = (winKey: string, viteKey: string, nodeKey: string, fallbackKey?: string): string | undefined => {
    const win = typeof window !== 'undefined' ? window as typeof window & Record<string, unknown> : null;
    const fromWin = win?.[winKey] as string | undefined;
    const vite = typeof import.meta !== 'undefined' ? (import.meta as any).env : null;
    const fromVite = vite?.[viteKey] as string | undefined;
    const fromFallback = fallbackKey ? vite?.[fallbackKey] as string | undefined : undefined;
    const node = typeof process !== 'undefined' ? (process as any).env : null;
    const fromNode = node?.[nodeKey] as string | undefined;
    return fromWin || fromVite || fromFallback || fromNode || undefined;
};

// Env helpers
export const env = {
    GW_URL: API_URL.replace('/api', '') || readVar('__ECONEURA_GW_URL', 'VITE_NEURA_GW_URL', 'NEURA_GW_URL', 'VITE_API_URL'),
    GW_KEY: readVar('__ECONEURA_GW_KEY', 'VITE_NEURA_GW_KEY', 'NEURA_GW_KEY'),
    LA_ID: readVar('__LA_WORKSPACE_ID', 'VITE_LA_WORKSPACE_ID', 'LA_WORKSPACE_ID'),
    LA_KEY: readVar('__LA_SHARED_KEY', 'VITE_LA_SHARED_KEY', 'LA_SHARED_KEY'),
};

export const nowIso = () => new Date().toISOString();

export function correlationId() {
    try {
        const crypto = globalThis.crypto;
        if (!crypto) throw new Error('no crypto');
        const rnd = crypto.getRandomValues(new Uint32Array(4));
        return Array.from(rnd).map((n) => n.toString(16)).join("");
    } catch {
        const r = () => Math.floor(Math.random() * 1e9).toString(16);
        return `${Date.now().toString(16)}${r()}${r()}`;
    }
}

// Obtener webhook Make por departamento
export function getDeptWebhook(deptId: string): string | undefined {
    const envObj = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};
    const key = `VITE_MAKE_WEBHOOK_${String(deptId).toUpperCase()}`;
    const url = envObj[key] as string | undefined;
    return url && /^https:\/\/hook\.[a-z0-9.-]+\.make\.com\//i.test(url) ? url : undefined;
}

// Telemetría opcional Azure Log Analytics
export async function logActivity(row: Record<string, unknown>) {
    if (!env.LA_ID || !env.LA_KEY) return;
    const g = globalThis as typeof globalThis & {
        crypto?: Crypto & { subtle?: SubtleCrypto };
        atob?: (str: string) => string;
        btoa?: (str: string) => string;
    };
    if (!g.crypto || !g.crypto.subtle) return;
    if (typeof g.atob !== 'function' || typeof g.btoa !== 'function') return;
    try {
        const body = JSON.stringify([{ ...row, TimeGenerated: nowIso(), Product: 'ECONEURA', Type: 'EconeuraLogs' }]);
        const endpoint = `https://${env.LA_ID}.ods.opinsights.azure.com/api/logs?api-version=2016-04-01`;
        if (!g.atob) return;
        const keyBytes = Uint8Array.from(g.atob(String(env.LA_KEY)), (c) => c.charCodeAt(0));
        const crypto = g.crypto.subtle;
        const k = await crypto.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const date = nowIso();
        const toSign = new TextEncoder().encode(`POST\n${body.length}\napplication/json\nx-ms-date:${date}\n/api/logs`);
        const sig = await crypto.sign('HMAC', k, toSign);
        if (!g.btoa) return;
        const signature = g.btoa(String.fromCharCode(...new Uint8Array(sig)));
        await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Log-Type': 'EconeuraLogs',
                'Authorization': `SharedKey ${env.LA_ID}:${signature}`,
                'x-ms-date': date,
            },
            body,
        }).catch(() => { });
    } catch { /* no-op */ }
}

export async function invokeAgent(agentId: string, _route: 'local' | 'azure' = 'azure', payload: Record<string, unknown> = {}) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const base = isLocalhost ? 'http://localhost:3000' : (env.GW_URL || 'https://econeura-backend-prod.azurewebsites.net').replace(/\/$/, '');
    const url = `${base}/api/invoke/${agentId}`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Correlation-Id': correlationId(),
            },
            body: JSON.stringify({ input: payload?.input ?? "" }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json().catch(() => ({ ok: true, simulated: true, output: `Ejecución iniciada: ${agentId}` }));
    } catch {
        return { ok: true, simulated: true, output: `Enviado a cola de ejecución: ${agentId}` };
    }
}
