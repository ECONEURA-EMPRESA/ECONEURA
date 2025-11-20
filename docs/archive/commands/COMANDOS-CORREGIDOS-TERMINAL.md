# 🚀 COMANDOS CORREGIDOS PARA TERMINAL NUEVA

## ⚠️ PROBLEMAS CORREGIDOS

1. ✅ Error en `applicationInsights.ts` (circular dependency)
2. ✅ Script PowerShell corregido (sin emojis, sintaxis correcta)
3. ✅ Comando para generar secret corregido

---

## 📋 COMANDOS CORREGIDOS - COPIA Y PEGA

### 1️⃣ NAVEGAR AL PROYECTO
```powershell
cd C:\Users\Usuario\ECONEURA-FULL
```

### 2️⃣ CREAR .ENV (Si no existe)
```powershell
cd packages\backend
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
@"
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TU-PASSWORD@localhost:5432/econeura_app
REDIS_URL=redis://localhost:6379
CRM_WEBHOOK_SECRET=$secret
"@ | Out-File -FilePath .env -Encoding utf8
Write-Host "Secret generado: $secret" -ForegroundColor Green
cd ..\..
```

**⚠️ Reemplaza `TU-PASSWORD` con tu password real de PostgreSQL**

### 3️⃣ INSTALAR DEPENDENCIAS (Si no lo hiciste)
```powershell
npm install
```

### 4️⃣ INICIAR BACKEND
```powershell
cd packages\backend
npm run dev
```

---

## 🔧 SI PSQL NO ESTÁ EN PATH

### Opción A: Agregar PostgreSQL al PATH temporalmente
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
psql -U postgres -c "CREATE DATABASE econeura_app;"
```

### Opción B: Usar ruta completa
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE econeura_app;"
```

### Opción C: Usar pgAdmin o herramienta gráfica
1. Abre pgAdmin
2. Conecta a PostgreSQL
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `econeura_app`
5. Ejecuta las migraciones desde pgAdmin

---

## 📋 MIGRACIONES (Si psql funciona)

```powershell
cd packages\backend
psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql
psql -U postgres -d econeura_app -f database\migrations\003_crm_indexes.sql
cd ..\..
```

---

## ✅ VERIFICACIÓN

### Health Check (en otra terminal)
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health
```

**Respuesta esperada:**
```json
{"status":"ok"}
```

---

## 🎯 COMANDOS TODO-EN-UNO (Sin PostgreSQL CLI)

Si no tienes `psql` en PATH, puedes:

1. **Crear base de datos manualmente** (pgAdmin o herramienta gráfica)
2. **Ejecutar migraciones manualmente** (copiar SQL y ejecutar en pgAdmin)
3. **Configurar .env** (usar comandos de arriba)
4. **Iniciar backend** (usar comandos de arriba)

---

**Última actualización:** 16 Noviembre 2025

