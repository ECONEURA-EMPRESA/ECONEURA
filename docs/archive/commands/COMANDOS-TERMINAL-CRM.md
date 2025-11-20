# 🖥️ COMANDOS TERMINAL - CRM

## 📋 COMANDOS LISTOS PARA EJECUTAR

### 1. VERIFICACIÓN Y COMPILACIÓN

```powershell
# Ir al directorio del backend
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend

# Verificar TypeScript
npm run type-check

# Compilar
npm run build

# Verificar que no hay errores
npm run type-check 2>&1 | Select-String -Pattern "error" | Select-Object -First 5
```

---

### 2. EJECUTAR MIGRACIONES SQL

```powershell
# Opción 1: Ejecutar desde PowerShell
psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql
psql -U postgres -d econeura_app -f database\migrations\003_crm_indexes.sql

# Opción 2: Conectar primero a PostgreSQL
psql -U postgres -d econeura_app

# Luego ejecutar:
\i database/migrations/002_crm_premium.sql
\i database/migrations/003_crm_indexes.sql

# Verificar tablas creadas
\dt crm_*

# Verificar datos
SELECT COUNT(*) FROM crm_leads;
SELECT COUNT(*) FROM crm_deals;
```

---

### 3. INICIAR SERVIDOR

```powershell
# Desde packages/backend
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend

# Iniciar en modo desarrollo
npm run dev

# El servidor iniciará en http://localhost:3000
# Busca en los logs:
# "ECONEURA backend escuchando en el puerto 3000"
# "[Server] Rutas de webhooks CRM registradas"
# "[Server] Rutas CRM registradas"
```

---

### 4. PROBAR ENDPOINTS

#### 4.1. Health Check
```powershell
# Health check (sin auth)
Invoke-WebRequest -Uri http://localhost:3000/health

# O con curl
curl http://localhost:3000/health
```

#### 4.2. API CRM (requiere auth)
```powershell
# Obtener token primero (usar tu token de dev)
$token = "Bearer <tu-token>"

# Listar leads
Invoke-WebRequest -Uri "http://localhost:3000/api/crm/leads?department=cmo&limit=10" `
  -Headers @{Authorization=$token}

# Obtener métricas de ventas
Invoke-WebRequest -Uri "http://localhost:3000/api/crm/sales-metrics?department=cso&period=month" `
  -Headers @{Authorization=$token}
```

#### 4.3. Webhooks (requiere HMAC)
```powershell
# Configurar secret
$secret = "mDK3Ojdx2k+gqqZ7Tsi1jIjFlVpzmHVL23vyeKrOWjU="

# Crear payload
$body = @{
    email = "test@example.com"
    nombre = "Test User"
    department = "cmo"
    agent_name = "Lead_Prospector"
    score = 7
} | ConvertTo-Json

# Calcular HMAC (requiere OpenSSL o similar)
# Nota: En PowerShell, puedes usar .NET para calcular HMAC
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$signature = [System.BitConverter]::ToString($hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($body))).Replace("-", "").ToLower()

# Enviar webhook
Invoke-WebRequest -Uri "http://localhost:3000/api/crm/webhooks/lead-created" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -Headers @{"X-Webhook-Signature"=$signature}
```

---

### 5. VERIFICAR LOGS

```powershell
# Ver logs en tiempo real
Get-Content logs\combined.log -Wait -Tail 50

# Buscar logs de CRM
Select-String -Path logs\combined.log -Pattern "CRM" | Select-Object -Last 20

# Buscar errores
Select-String -Path logs\error.log -Pattern "CRM" | Select-Object -Last 10
```

---

### 6. VERIFICAR BASE DE DATOS

```powershell
# Conectar a PostgreSQL
psql -U postgres -d econeura_app

# Verificar tablas
\dt crm_*

# Ver estructura de tablas
\d crm_leads
\d crm_deals
\d crm_conversations
\d crm_agents

# Verificar índices
\di crm_*

# Contar registros
SELECT COUNT(*) FROM crm_leads;
SELECT COUNT(*) FROM crm_deals;
SELECT COUNT(*) FROM crm_conversations;
SELECT COUNT(*) FROM crm_agents;

# Ver leads recientes
SELECT * FROM crm_leads ORDER BY created_at DESC LIMIT 10;

# Ver deals
SELECT * FROM crm_deals ORDER BY created_at DESC LIMIT 10;
```

---

### 7. SCRIPT AUTOMÁTICO

```powershell
# Ejecutar script de setup
.\scripts\setup-crm-local.ps1

# O desde la raíz del proyecto
cd C:\Users\Usuario\ECONEURA-FULL
.\scripts\setup-crm-local.ps1
```

---

### 8. VERIFICAR VARIABLES DE ENTORNO

```powershell
# Verificar .env
Get-Content .env | Select-String -Pattern "DATABASE_URL|CRM_WEBHOOK_SECRET"

# O verificar en PowerShell
$env:DATABASE_URL
$env:CRM_WEBHOOK_SECRET
```

---

### 9. TESTING RÁPIDO

```powershell
# Test completo en una línea
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend; `
npm run type-check; `
npm run build; `
Write-Host "✅ Compilación OK" -ForegroundColor Green; `
Invoke-WebRequest -Uri http://localhost:3000/health
```

---

### 10. COMANDOS ÚTILES

```powershell
# Ver procesos de Node
Get-Process node

# Matar proceso en puerto 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force

# Verificar que el puerto está libre
Test-NetConnection -ComputerName localhost -Port 3000

# Limpiar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Error: "DATABASE_URL no configurado"
```powershell
# Agregar al .env
Add-Content .env "DATABASE_URL=postgresql://postgres:password@localhost:5432/econeura_app"
```

### Error: "Table crm_leads does not exist"
```powershell
# Ejecutar migraciones
psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql
```

### Error: "Cannot find module"
```powershell
# Reinstalar dependencias
cd packages\backend
npm install
```

### Error: "Port 3000 already in use"
```powershell
# Matar proceso
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force
```

---

**Última actualización:** 16 Noviembre 2025

