# 🔄 COMANDOS PARA REINICIAR Y TESTING

## 📋 PASO 1: Detener procesos existentes

```powershell
# Detener procesos en puertos 3000 y 5173
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*3000*" -or $_.MainWindowTitle -like "*5173*" } | Stop-Process -Force
netstat -ano | findstr :3000 | ForEach-Object { $_.Split(' ')[-1] } | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
netstat -ano | findstr :5173 | ForEach-Object { $_.Split(' ')[-1] } | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
```

## 📋 PASO 2: Reiniciar Backend

```powershell
# Terminal 1: Backend
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm run dev
```

## 📋 PASO 3: Reiniciar Frontend

```powershell
# Terminal 2: Frontend
cd C:\Users\Usuario\ECONEURA-FULL\packages\frontend
npm run dev
```

## ✅ VERIFICACIÓN RÁPIDA

### 1. Verificar que Backend está corriendo:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET
```

### 2. Verificar que Frontend está corriendo:
```powershell
Start-Process "http://localhost:5173"
```

## 🧪 TESTING

### Test 1: CRM Panel
1. Abrir `http://localhost:5173`
2. Iniciar sesión
3. Ir a departamento **Marketing (CMO/MKT)**
4. Verificar que el CRM Panel carga sin errores 400
5. Verificar que los gráficos se renderizan sin warnings

### Test 2: Chat con Imágenes
1. En el chat, hacer clic en el botón de adjuntar imagen
2. Seleccionar una imagen (preferiblemente < 5MB)
3. Enviar mensaje con la imagen
4. Verificar que:
   - No aparece error 413
   - No aparece error 500
   - La imagen se procesa correctamente
   - El chat responde

### Test 3: Verificar Logs
```powershell
# En la terminal del backend, verificar logs:
# - Debe aparecer: "[UploadRoutes] Archivo subido correctamente"
# - Debe aparecer: "[Invoke API] Imagen descargada correctamente desde URL"
```

## 🐛 TROUBLESHOOTING

### Si el backend no arranca:
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm install
npm run dev
```

### Si el frontend no arranca:
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\frontend
npm install
npm run dev
```

### Si hay errores de puerto ocupado:
```powershell
# Matar proceso en puerto 3000
netstat -ano | findstr :3000
# Copiar el PID y ejecutar:
Stop-Process -Id <PID> -Force

# Matar proceso en puerto 5173
netstat -ano | findstr :5173
# Copiar el PID y ejecutar:
Stop-Process -Id <PID> -Force
```

## 📝 NOTAS

- ✅ **Correcciones aplicadas:**
  - Error 400 CRM: Mapeo dept.id corregido
  - Error 500 Chat: Descarga de attachmentUrl mejorada
  - Error 413: Cambiado a URL en lugar de base64
  - Warning Recharts: Gráficos corregidos con wrapper divs
  - CORS: Verificado express.static configurado

- 🔍 **Verificar en consola del navegador:**
  - No debe aparecer: `400 (Bad Request)` en `/api/crm/sales-metrics`
  - No debe aparecer: `500 (Internal Server Error)` en `/api/invoke/...`
  - No debe aparecer: `413 Request Entity Too Large`
  - No debe aparecer: Warning de Recharts sobre dimensiones
