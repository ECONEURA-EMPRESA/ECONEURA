# 🚀 COMANDOS RÁPIDOS - CONFIGURAR MISTRAL 3.1

## 📋 TERMINAL NUEVA - CONFIGURAR MISTRAL

### **1. Agregar API Key al .env:**

```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
if (-not (Test-Path ".env")) { New-Item -Path ".env" -ItemType File }
Add-Content -Path ".env" -Value "MISTRAL_API_KEY=sk-crE9EcLsmGxQre_0ZL21ow"
Write-Host "✅ API Key agregada al .env" -ForegroundColor Green
```

### **2. Verificar que se agregó:**

```powershell
Get-Content .env | Select-String "MISTRAL_API_KEY"
```

### **3. Reiniciar Backend (si está corriendo):**

```powershell
# Si el backend está corriendo, detenerlo primero (Ctrl+C)
# Luego:
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm run dev
```

---

## ✅ VERIFICACIÓN RÁPIDA

### **Verificar que el backend arrancó:**

```powershell
Start-Sleep -Seconds 3
Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET
```

### **Verificar que Mistral está configurado (en los logs del backend):**

Deberías ver en la terminal del backend:
```
✅ ECONEURA backend escuchando en el puerto 3000
```

**⚠️ Si ves error "MISTRAL_API_KEY no configurada":**
- Verifica que el archivo `.env` existe: `Test-Path .env`
- Verifica el contenido: `Get-Content .env`
- Reinicia el backend

---

## 🎯 COMANDO TODO-EN-UNO

```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
if (-not (Test-Path ".env")) { New-Item -Path ".env" -ItemType File }
if (-not (Get-Content .env | Select-String "MISTRAL_API_KEY")) {
    Add-Content -Path ".env" -Value "MISTRAL_API_KEY=sk-crE9EcLsmGxQre_0ZL21ow"
    Write-Host "✅ API Key agregada" -ForegroundColor Green
} else {
    Write-Host "⚠️  MISTRAL_API_KEY ya existe en .env" -ForegroundColor Yellow
}
Write-Host "`n📋 Contenido del .env:" -ForegroundColor Cyan
Get-Content .env | Select-String "MISTRAL"
Write-Host "`n✅ Listo! Reinicia el backend con: npm run dev" -ForegroundColor Green
```

---

## 🔒 VERIFICAR QUE .env NO SE SUBE A GIT

```powershell
cd C:\Users\Usuario\ECONEURA-FULL
Get-Content .gitignore | Select-String "\.env"
```

**Si no aparece, agregar:**
```powershell
Add-Content -Path ".gitignore" -Value "`n.env"
```


