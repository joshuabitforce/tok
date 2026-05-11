# TOK Indumentaria — Sitio Web

Sitio placeholder de la marca **TOK Indumentaria** mientras se desarrolla la tienda online.

## Estructura

```
TOK/
├── index.html              # Página principal (placeholder + link a Instagram)
├── favicon.svg             # Favicon
├── fonts/
│   └── MicrogrammaDBolExt-Regular.ttf
└── README.md
```

## Cómo deployar en GitHub Pages

### 1. Crear el repositorio en GitHub

1. Andá a https://github.com/new
2. Nombre del repo: **`tok-indumentaria`** (o el que prefieras).
   - Si querés que la URL sea `https://<tu-usuario>.github.io` directamente (sin path), nombrá el repo **`<tu-usuario>.github.io`**.
3. Public.
4. **No** inicialices con README (ya tenés uno).
5. Crear repositorio.

### 2. Subir los archivos

Desde la carpeta `TOK` en tu computadora, abrí una terminal y ejecutá:

```bash
cd "C:\Users\blink\Documents\TOK"
git init
git add .
git commit -m "Initial commit: placeholder site"
git branch -M main
git remote add origin https://github.com/<TU-USUARIO>/tok-indumentaria.git
git push -u origin main
```

> Reemplazá `<TU-USUARIO>` por tu usuario de GitHub.

### 3. Activar GitHub Pages

1. En el repositorio, andá a **Settings → Pages**.
2. En **Source**, elegí **Deploy from a branch**.
3. En **Branch**, seleccioná **`main`** y carpeta **`/ (root)`**.
4. Guardar.
5. Esperá 1–2 minutos. La URL aparecerá arriba (algo como `https://<tu-usuario>.github.io/tok-indumentaria/`).

### 4. (Opcional) Dominio propio

Si comprás un dominio (ej. `tokindumentaria.com`):

1. En **Settings → Pages → Custom domain**, ingresá el dominio.
2. En tu proveedor de DNS, agregá los siguientes registros:
   - `A` apuntando a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `<tu-usuario>.github.io`
3. Activá **Enforce HTTPS** una vez que GitHub valide el dominio.

## Detalles técnicos

- **Fuente:** Microgramma D Bold Extended (incluida en `fonts/`).
- **Estilo:** Fondo negro con gradientes animados, scanlines sutiles, glow en el logo, transiciones de entrada.
- **Responsive:** Mobile-first, breakpoints para pantallas chicas y landscape.
- **Accesibilidad:** Respeta `prefers-reduced-motion`, ARIA labels en el link de Instagram.
- **SEO básico:** Meta description, Open Graph tags, favicon.
- **Sin dependencias:** Un único archivo `index.html` + assets locales. No requiere build.

## Próximos pasos

- [ ] Carrito de compras (planificado).
- [ ] Catálogo de productos.
- [ ] Integración con pasarela de pago.

---

**Instagram:** [@tok.indumentaria](https://instagram.com/tok.indumentaria)
