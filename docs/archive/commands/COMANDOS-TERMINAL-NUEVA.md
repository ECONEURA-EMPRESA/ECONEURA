# 🚀 COMANDOS PARA TERMINAL NUEVA - DESPLIEGUE LOCAL

## 📋 COPIA Y PEGA ESTOS COMANDOS EN ORDEN

### 1️⃣ NAVEGAR AL PROYECTO
```powershell
cd C:\Users\Usuario\ECONEURA-FULL
```

### 2️⃣ VERIFICAR QUE ESTAMOS EN EL LUGAR CORRECTO
```powershell
Test-Path scripts\deploy-local.ps1
```

### 3️⃣ EJECUTAR DESPLIEGUE AUTOMÁTICO
```powershell
.\scripts\deploy-local.ps1 -PostgresPassword "TU-PASSWORD-POSTGRES"
```

**⚠️ Reemplaza `"TU-PASSWORD-POSTGRES"` con tu password real de PostgreSQL**

---

## 🔄 SI EL SCRIPT NO FUNCIONA - DESPLIEGUE MANUAL

### PASO 1: Crear Base de Datos
```powershell
psql -U postgres -c "CREATE DATABASE econeura_app;"
```

### PASO 2: Ejecutar Migraciones
```powershell
cd packages\backend
psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql
psql -U postgres -d econeura_app -f database\migrations\003_crm_indexes.sql
cd ..\..
```

### PASO 3: Crear .env y Generar Secret
```powershell
cd packages\backend
$secret = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
Write-Host "CRM_WEBHOOK_SECRET generado: $secret" -ForegroundColor Green
@"
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TU-PASSWORD@localhost:5432/econeura_app
REDIS_URL=redis://localhost:6379
CRM_WEBHOOK_SECRET=$secret
"@ | Out-File -FilePath .env -Encoding utf8
Write-Host "✅ .env creado" -ForegroundColor Green
cd ..\..
```

**⚠️ Reemplaza `TU-PASSWORD` con tu password real de PostgreSQL**

### PASO 4: Instalar Dependencias
```powershell
npm install
```

### PASO 5: Iniciar Backend
```powershell
cd packages\backend
npm run dev
```

---

## ✅ VERIFICACIÓN RÁPIDA (En otra terminal)

### Health Check
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health | Select-Object -ExpandProperty Content
```

### Verificar Tablas
```powershell
psql -U postgres -d econeura_app -c "\dt crm_*"
```

---

## 🎯 COMANDO TODO-EN-UNO (Si tienes password)

```powershell
cd C:\Users\Usuario\ECONEURA-FULL; $pwd = "TU-PASSWORD"; psql -U postgres -c "CREATE DATABASE econeura_app;" 2>&1 | Out-Null; cd packages\backend; psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql 2>&1 | Out-Null; psql -U postgres -d econeura_app -f database\migrations\003_crm_indexes.sql 2>&1 | Out-Null; $secret = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)); @"
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:$pwd@localhost:5432/econeura_app
REDIS_URL=redis://localhost:6379
CRM_WEBHOOK_SECRET=$secret
"@ | Out-File -FilePath .env -Encoding utf8; cd ..\..; npm install; Write-Host "`n✅ DESPLIEGUE COMPLETADO`n📋 Inicia backend con: cd packages\backend && npm run dev" -ForegroundColor Green
```

**⚠️ Reemplaza `TU-PASSWORD` con tu password real**

---

**Última actualización:** 16 Noviembre 2025

