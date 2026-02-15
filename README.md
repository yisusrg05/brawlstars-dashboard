# ⚡ Brawl Stars Dashboard

Dashboard para visualizar tus brawlers, niveles, trofeos, gadgets, star powers y gears.

**Arquitectura:**
```
GitHub Pages (frontend)  →  Render (backend/proxy)  →  API de Brawl Stars
```

---

## 📁 Estructura del repo

```
brawlstars-dashboard/
├── frontend/
│   └── index.html          # Dashboard estático (se despliega en GitHub Pages)
├── backend/
│   ├── server.js           # Proxy Fastify que llama a la API de Brawl Stars
│   └── package.json
└── README.md
```

---

## 🚀 Guía de despliegue paso a paso

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/brawlstars-dashboard.git
git push -u origin main
```

### 2. Desplegar el backend en Render

1. Ve a [render.com](https://render.com) y crea una cuenta gratuita
2. **New → Web Service**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name:** `brawlstars-proxy` (o el que quieras)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
5. (Opcional) Añade la variable de entorno:
   - `ALLOWED_ORIGIN` → `https://TU_USUARIO.github.io`
6. Haz clic en **Create Web Service**
7. Espera 2-3 minutos. Copia la URL que te da Render (ej: `https://brawlstars-proxy.onrender.com`)

> ⚠️ El plan gratuito de Render "duerme" el servidor tras 15 min de inactividad. La primera petición puede tardar ~30 segundos en despertar.

### 3. Activar GitHub Pages (frontend)

1. En tu repo de GitHub, ve a **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / Folder: `/frontend`
4. Guarda. En 1-2 minutos tu dashboard estará en:
   `https://TU_USUARIO.github.io/brawlstars-dashboard/`

### 4. Conseguir tu API Token de Brawl Stars

1. Ve a [developer.brawlstars.com](https://developer.brawlstars.com)
2. Crea una cuenta y haz login
3. **My Account → Create New Key**
4. Pon un nombre y en **Allowed IP addresses** pon la IP de tu servidor de Render
   - Puedes encontrarla en los logs de Render o buscando "what is my IP" desde Render
5. Copia el token generado

### 5. Usar el dashboard

1. Abre `https://TU_USUARIO.github.io/brawlstars-dashboard/`
2. Introduce la URL de tu backend de Render
3. Pulsa **Probar conexión** para verificar que funciona
4. Introduce tu API Token y tu Player Tag (con `#`)
5. ¡Busca y disfruta!

---

## 🔧 Desarrollo local

```bash
# Backend
cd backend
npm install
node server.js
# → http://localhost:3000

# Frontend: abre frontend/index.html en tu navegador
# Pon http://localhost:3000 como URL del proxy
```

---

## 📡 Endpoints del proxy

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/player/:tag` | Datos del jugador (brawlers, trofeos, etc.) |
| GET | `/brawlers` | Lista de todos los brawlers con rareza |

Todos los endpoints requieren el header `Authorization: Bearer TU_TOKEN`.
