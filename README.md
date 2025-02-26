# Onboarding reports

Este proyecto es una aplicación web desarrollada en **Next.js** con **React 19** que muestra un **dashboard de actividad y asistencia** basado en datos extraídos desde GitHub (en otro repositorio).

## 🚀 Tecnologías utilizadas
- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Recharts (para visualización de datos)**
- **Puppeteer (para generación de PDF)**

## 📌 Características principales
- 📊 **Visualización de actividad de usuarios** (Commits, PRs, Asistencia)
- 📅 **Calendario de asistencia**
- 📄 **Exportación de reportes en PDF** con Puppeteer

## 🛠 Instalación y ejecución

1. Clonar el repositorio:
   ```sh
   git clone git@github.com:campus-CodeArts/onboarding-reports.git
   cd onboarding-reports
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```sh
   npm run dev
   ```
4. Descarga los datos de prueba del fichero disponible: [0.0.3 public data](https://github.com/campus-CodeArts/onboarding-reports/releases/download/0.0.3/public_data.7z)
5. Descomprímelos y ponlos en `public/data`.

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.


## 📝 Configuración
- **Archivos de configuración:**
  - `.env.local`: Variables de entorno para GitHub API y otras integraciones.
  - `data/users.json`: Datos de asistencia simulados.

Contenido para `.env.local`:

```
PUBLIC_URL=http://localhost:3000
NEXTAUTH_SECRET=123456789
NEXTAUTH_URL=http://localhost:3000

# Google sheets (TODOS)
GOOGLE_USERS_SHEET_ID=""
GOOGLE_USERS_SHEET_RANGE=""

# NEXT AUTH SSO
ROLE_PROTECT=disabled
PUBLIC_PATHS="/"
DEFAULT_ROLE=anonymous
AUTH_DEBUG=false
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

## 📌 Notas adicionales
- Los estilos principales están en `global.css` y se pueden modificar según necesidades.
- Se pueden agregar más visualizaciones en `components/`.

## 📃 Licencia
Este proyecto está bajo la licencia **MIT**.

**Desarrollado por CodeArts**