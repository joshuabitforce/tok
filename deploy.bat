@echo off
setlocal

echo ========================================
echo  TOK Indumentaria - Deploy a GitHub
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar que git este instalado
where git >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git no esta instalado.
    echo Descargalo desde: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Limpiar cualquier .git anterior (incluido el parcial)
if exist ".git" (
    echo Limpiando repositorio anterior...
    attrib -h -s -r ".git" /s /d >nul 2>&1
    rmdir /s /q ".git"
)

echo Inicializando repositorio...
git init -b main
if errorlevel 1 goto :error

echo.
echo Configurando usuario local del repo...
git config user.email "joshua.juanchini@bitforce.com.ar"
git config user.name "Joshua"
git config core.autocrlf false

echo.
echo Agregando archivos...
git add .

echo.
echo Creando commit...
git commit -m "Initial commit: TOK Indumentaria placeholder site"
if errorlevel 1 goto :error

echo.
echo Conectando con GitHub (joshuabitforce/tok)...
git remote add origin https://github.com/joshuabitforce/tok.git

echo.
echo ========================================
echo  Pusheando a GitHub...
echo  (Si aparece una ventana pidiendo login,
echo   autenticate con tu cuenta de GitHub)
echo ========================================
echo.
git push -u origin main
if errorlevel 1 goto :error

echo.
echo ========================================
echo   DEPLOY EXITOSO
echo ========================================
echo.
echo Ahora andate a:
echo   https://github.com/joshuabitforce/tok/settings/pages
echo.
echo Y configura:
echo   - Source: Deploy from a branch
echo   - Branch: main / (root)
echo.
echo En 1-2 minutos tu sitio va a estar en:
echo   https://joshuabitforce.github.io/tok/
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] Algo salio mal. Revisa el mensaje arriba.
pause
exit /b 1
