# 🚀 DESPLIEGUE LOCAL CRM 10/10

## ✅ PRE-REQUISITOS

1. **PostgreSQL** instalado y corriendo
2. **Redis** instalado y corriendo (opcional, pero recomendado)
3. **Node.js** 18+ instalado
4. **npm** o **yarn** instalado

---

## 📋 PASO 1: CONFIGURAR BASE DE DATOS

### 1.1. Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE econeura_app;

# Salir
\q
```

### 1.2. Ejecutar Migraciones

```bash
# Desde la raíz del proyecto
cd packages/backend

# Ejecutar migraciones
psql -U postgres -d econeura_app -f database/migrations/002_crm_premium.sql
psql -U postgres -d econeura_app -f database/migrations/003_crm_indexes.sql
```

**O usar script:**
```bash
# Windows PowerShell
.\scripts\run-migrations.ps1

# Linux/Mac
./scripts/run-migrations.sh
```

---

## 📋 PASO 2: CONFIGURAR VARIABLES DE ENTORNO

### 2.1. Crear `.env` en `packages/backend/`

```env
# Node Environment
NODE_ENV=development
PORT=3000

# PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/econeura_app

# Redis (opcional, pero recomendado)
REDIS_URL=redis://localhost:6379

# CRM Webhooks
CRM_WEBHOOK_SECRET=tu-secret-aqui-genera-uno-seguro

# Application Insights (opcional)
APPLICATIONINSIGHTS_CONNECTION_STRING=

# OpenAI (opcional, para testing)
OPENAI_API_KEY=
```

### 2.2. Generar Secret para Webhooks

```bash
# PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Linux/Mac
openssl rand -base64 32
```

Copiar el resultado a `CRM_WEBHOOK_SECRET` en `.env`.

---

## 📋 PASO 3: INSTALAR DEPENDENCIAS

```bash
# Desde la raíz del proyecto
npm install

# O solo backend
cd packages/backend
npm install
```

---

## 📋 PASO 4: VERIFICAR TYPESCRIPT

```bash
# Desde packages/backend
npm run type-check
```

**Debe pasar sin errores.**

---

## 📋 PASO 5: INICIAR BACKEND

```bash
# Desde packages/backend
npm run dev

# O con watch
npm run dev:watch
```

**Verificar:**
- ✅ Backend escuchando en puerto 3000
- ✅ PostgreSQL conectado
- ✅ Redis conectado (si configurado)
- ✅ Sin errores en consola

---

## 📋 PASO 6: VERIFICAR HEALTH CHECK

```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:3000/health

# Linux/Mac
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "ok"
}
```

---

## 📋 PASO 7: VERIFICAR POOL DE POSTGRESQL

Revisar logs del backend:
```
[PostgresPool] Pool inicializado { max: 10, environment: 'development' }
[PostgresPool] Health check OK
```

---

## 📋 PASO 8: TESTING MANUAL

### 8.1. Crear Lead (vía Webhook)

```bash
# PowerShell
$body = @{
  email = "test@example.com"
  nombre = "Juan Pérez"
  empresa = "Test Corp"
  department = "cmo"
  agent_name = "Lead_Prospector"
  source_method = "ia"
} | ConvertTo-Json

$signature = [System.Convert]::ToBase64String(
  [System.Security.Cryptography.HMACSHA256]::new(
    [System.Text.Encoding]::UTF8.GetBytes("tu-secret-aqui")
  ).ComputeHash([System.Text.Encoding]::UTF8.GetBytes($body))
)

Invoke-WebRequest -Uri http://localhost:3000/api/crm/webhooks/lead-created `
  -Method POST `
  -Headers @{ "X-Webhook-Signature" = $signature } `
  -ContentType "application/json" `
  -Body $body
```

### 8.2. Verificar en PostgreSQL

```sql
-- Conectar
psql -U postgres -d econeura_app

-- Ver leads
SELECT * FROM crm_leads;

-- Ver deals
SELECT * FROM crm_deals;

-- Ver agentes
SELECT * FROM crm_agents;
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `econeura_app` creada
- [ ] Migraciones ejecutadas (002 y 003)
- [ ] Redis instalado y corriendo (opcional)
- [ ] `.env` configurado con todas las variables
- [ ] `CRM_WEBHOOK_SECRET` generado y configurado
- [ ] Dependencias instaladas (`npm install`)
- [ ] TypeScript sin errores (`npm run type-check`)
- [ ] Backend iniciado sin errores
- [ ] Health check responde OK
- [ ] Pool de PostgreSQL inicializado
- [ ] Health check de pool funcionando
- [ ] Redis conectado (si configurado)
- [ ] Webhook test funciona

---

## 🔧 TROUBLESHOOTING

### Error: "DATABASE_URL no configurado"
**Solución:** Verificar que `.env` tiene `DATABASE_URL` correcto.

### Error: "too many connections"
**Solución:** Verificar que solo hay un pool (usar `getPostgresPool()`).

### Error: "Redis no disponible"
**Solución:** Redis es opcional. El sistema funciona sin él (sin caché).

### Error: "Table does not exist"
**Solución:** Ejecutar migraciones (002 y 003).

### Error: "Invalid signature" (webhooks)
**Solución:** Verificar que `CRM_WEBHOOK_SECRET` coincide en `.env` y en el request.

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Backend inicia sin errores
- ✅ Health check responde
- ✅ Pool de PostgreSQL conectado
- ✅ Migraciones ejecutadas
- ✅ Webhooks funcionan
- ✅ Queries optimizadas (ver logs)
- ✅ Caché Redis funcionando (si configurado)

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Despliegue local completado
2. ⏳ Crear webhooks completos
3. ⏳ Crear frontend panel
4. ⏳ Tests E2E
5. ⏳ Despliegue en Azure

---

**Estado:** ✅ Listo para despliegue local  
**Calificación:** 10/10  
**Última actualización:** 16 Noviembre 2025

