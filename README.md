# Backstage + GitHub Copilot SDK Demo

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

¡Hola developer 👋🏻! Este proyecto es una demo de integración de **GitHub Copilot SDK** con **Backstage** para crear un asistente de chat inteligente que interactúa con el catálogo de componentes de tu portal de desarrolladores.

<a href="https://youtu.be/VIDEO_CODE">
 <img src="https://img.youtube.com/vi/VIDEO_CODE/maxresdefault.jpg" alt="GitHub Copilot SDK + Backstage: Crea un Asistente de Código Inteligente" width="100%" />
</a>

## 📑 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Software Templates](#-software-templates)
- [Contribuir](#-contribuir)
- [Sígueme](#-sígueme-en-mis-redes-sociales)

## ✨ Características

- 🤖 **Chat con Copilot integrado** — Asistente de IA dentro de Backstage usando el SDK oficial de GitHub Copilot
- 📚 **Acceso al catálogo** — El asistente puede consultar y explicar los componentes registrados en Backstage
- 🏗️ **Software Templates** — 13 plantillas listas para scaffoldear nuevos proyectos (Node.js, .NET, Python, Vue, Astro, etc.)
- 🔐 **Autenticación GitHub** — Login con GitHub OAuth integrado
- 🐳 **Dev Container incluido** — Entorno de desarrollo listo para usar

## 🛠️ Tecnologías Utilizadas

- [Backstage](https://backstage.io/) — Portal de desarrolladores de Spotify
- [GitHub Copilot SDK](https://github.com/github/copilot-sdk) — SDK oficial para integrar Copilot
- [Node.js 20+](https://nodejs.org/) — Runtime de JavaScript
- [TypeScript](https://www.typescriptlang.org/) — Lenguaje de programación
- [React](https://react.dev/) — Frontend UI
- [Yarn](https://yarnpkg.com/) — Gestor de paquetes
- [Docker](https://www.docker.com/) — Contenedores para TechDocs

## 📋 Requisitos Previos

- **Node.js** 20 o 22
- **Yarn** (incluido con Node.js via corepack)
- **Docker** (para generar TechDocs)
- **GitHub CLI** (`gh`) autenticado
- **Cuenta de GitHub** con acceso a Copilot

## 🚀 Instalación

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/0GiS0/backstage-github-copilot-sdk-demo.git
cd backstage-github-copilot-sdk-demo
```

### Paso 2: Instalar dependencias

```bash
yarn install
```

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto o configura las variables en tu terminal:

```bash
# Autenticación GitHub OAuth (para login de usuarios)
export GITHUB_APP_CLIENT_ID=tu_client_id
export GITHUB_APP_CLIENT_SECRET=tu_client_secret
```

> 💡 **Tip importante:** Para el token de integración con GitHub (`GITHUB_TOKEN`), **no necesitas crear un PAT manualmente**. Si tienes GitHub CLI autenticado, simplemente usa:
>
> ```bash
> export GITHUB_TOKEN=$(gh auth token)
> ```
>
> Esto extrae automáticamente el token de tu sesión de `gh` CLI, que ya tiene los permisos necesarios para acceder a repos privados.

### Paso 4: Ejecutar el proyecto

```bash
export GITHUB_TOKEN=$(gh auth token) && yarn start
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000) y el backend en [http://localhost:7007](http://localhost:7007).

## 💻 Uso

### Chat con Copilot

Navega a [http://localhost:3000/copilot-chat](http://localhost:3000/copilot-chat) para interactuar con el asistente de Copilot integrado en Backstage.

### Crear componentes desde Templates

1. Ve a [http://localhost:3000/create](http://localhost:3000/create)
2. Selecciona una de las 13 plantillas disponibles
3. Completa el formulario con los parámetros requeridos
4. El scaffolder creará el proyecto automáticamente

## 📁 Estructura del Proyecto

```
backstage-github-copilot-sdk-demo/
├── app-config.yaml          # Configuración principal de Backstage
├── app-config.local.yaml    # Configuración local (secrets)
├── packages/
│   ├── app/                 # Frontend de Backstage
│   │   └── src/
│   │       ├── App.tsx
│   │       └── components/
│   └── backend/             # Backend de Backstage
│       └── src/
│           └── index.ts
├── plugins/
│   ├── copilot-chat/        # Plugin frontend del chat
│   │   └── src/
│   │       └── components/
│   │           ├── CopilotChatPage/
│   │           └── CopilotChatWidget/
│   └── copilot-chat-backend/ # Plugin backend del chat
│       └── src/
│           ├── agents/      # Agentes de Copilot
│           └── tools/       # Tools para el agente
└── examples/                # Ejemplos de entidades
```

## 🧩 Software Templates

Este proyecto está configurado para cargar **13 software templates** desde repositorios privados con el topic `backstage-copilot-sdk`:

| Template                                  | Descripción                    |
| ----------------------------------------- | ------------------------------ |
| `backstage-template-system`               | Crear un System en el catálogo |
| `backstage-template-domain`               | Crear un Domain en el catálogo |
| `backstage-template-node-service`         | Servicio Node.js/Express       |
| `backstage-template-fastapi-service`      | Servicio Python con FastAPI    |
| `backstage-template-dotnet-service`       | Servicio .NET                  |
| `backstage-template-dotnet-library`       | Librería .NET                  |
| `backstage-template-ai-assistant`         | Asistente de IA                |
| `backstage-template-mcp-server-node`      | Servidor MCP en Node.js        |
| `backstage-template-astro-frontend`       | Frontend con Astro             |
| `backstage-template-vue-frontend`         | Frontend con Vue.js            |
| `backstage-template-electron-desktop-app` | App de escritorio Electron     |
| `backstage-template-springboot-service`   | Servicio Java Spring Boot      |
| `backstage-template-kubernetes-gitops`    | Configuración GitOps para K8s  |

> ⚠️ **Nota:** Las templates se cargan desde repos privados. Asegúrate de tener `GITHUB_TOKEN` configurado correctamente.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 🌐 Sígueme en Mis Redes Sociales

Si te ha gustado este proyecto y quieres ver más contenido como este, no olvides suscribirte a mi canal de YouTube y seguirme en mis redes sociales:

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>
