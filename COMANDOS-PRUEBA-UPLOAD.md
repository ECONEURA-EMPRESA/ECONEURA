# 🚀 COMANDOS PARA PROBAR SUBIDA DE ARCHIVOS

## 1️⃣ REINICIAR BACKEND

```powershell
# Detener procesos en puerto 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force

# Ir a backend
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend

# Reiniciar backend
npm run dev
```

## 2️⃣ VERIFICAR QUE BACKEND ESTÁ FUNCIONANDO

```powershell
# En otra terminal PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET
```

## 3️⃣ VERIFICAR LOGS DEL BACKEND

Los logs deberían mostrar:
- `[Server] Rutas de upload registradas (antes de security middleware)`
- `✅ ECONEURA backend escuchando en el puerto 3000`

## 4️⃣ PROBAR SUBIDA DE ARCHIVO (Manual)

```powershell
# Obtener token (si no lo tienes)
$token = "tu_token_aqui"

# Crear archivo de prueba
$testFile = "C:\temp\test-image.jpg"  # Cambia la ruta a una imagen real

# Subir archivo
$formData = @{
    file = Get-Item $testFile
}

$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/uploads" -Method POST -Headers $headers -Form $formData
```

## 5️⃣ VERIFICAR EN FRONTEND

1. Abre `http://localhost:5173` (o el puerto que esté usando)
2. Inicia sesión
3. Abre el chat de cualquier departamento
4. Haz clic en el botón de adjuntar archivo (📎)
5. Selecciona una imagen o PDF
6. Verifica que:
   - Aparece un mensaje de "Subiendo archivo..."
   - Luego aparece "Archivo cargado correctamente"
   - La imagen se muestra en el chat

## 6️⃣ VERIFICAR LOGS EN CONSOLA DEL NAVEGADOR

Abre DevTools (F12) → Console y busca:
- `[Upload] Enviando archivo` (con detalles)
- `[Upload] Archivo subido correctamente` (si funciona)

## 7️⃣ VERIFICAR LOGS DEL BACKEND

En la terminal del backend deberías ver:
- `[UploadRoutes] Request recibido`
- `[UploadRoutes] Archivo procesado por multer`
- `[UploadRoutes] Archivo subido correctamente`

## 8️⃣ SI HAY ERROR 400

Revisa los logs del backend para ver:
- ¿Qué Content-Type recibió?
- ¿Multer procesó el archivo?
- ¿Qué error específico se produjo?

Los logs ahora son MUY detallados y te dirán exactamente qué falló.


