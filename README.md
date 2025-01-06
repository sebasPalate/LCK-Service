# LCK-Service

Gestor de historias clínicas basado en Next.js con NextUI, Prisma y PostgreSQL.

## Requisitos previos

Asegúrate de tener instalados los siguientes requisitos:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **PostgreSQL** (Base de Datos)
- **Prisma CLI** (Para interactuar con la base de datos)

## Instalación

1. **Clona el repositorio en tu máquina local:**

    ```sh
    git clone https://github.com/tu-usuario/LCK-Service.git
    cd LCK-Service
    ```

2. **Instala las dependencias del proyecto:**

    Si usas `npm`:

    ```sh
    npm install
    ```

    O si usas `yarn`:

    ```sh
    yarn install
    ```

## Configuración de PostgreSQL

1. **Crea la base de datos en PostgreSQL:**

    Asegúrate de tener PostgreSQL instalado y funcionando.

    a. Abre pgAdmin o cualquier cliente PostgreSQL y crea una nueva base de datos llamada `lck_service`.

    b. Si es necesario, crea un nuevo usuario y asegúrate de que tenga todos los privilegios sobre la base de datos `lck_service`.

2. **Configura la conexión a la base de datos:**

    Dirígete a `prisma/schema.prisma` y configura las credenciales de tu base de datos:

    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```

    Asegúrate de que la variable de entorno `DATABASE_URL` en `.env` esté correctamente configurada con la URL de tu base de datos PostgreSQL.

3. **Realiza las migraciones:**

    Aplica las migraciones de la base de datos:

    ```sh
    npx prisma migrate dev
    ```

## Ejecución

1. **Inicia el servidor de desarrollo:**

    ```sh
    npm run dev
    ```

2. **Accede a la aplicación:**

    Abre tu navegador y visita `http://localhost:3000/` para ver la aplicación en funcionamiento.

## Archivos Importantes

- **`prisma/schema.prisma`:** Configuración de la base de datos y modelos de Prisma.
- **`pages/api/auth/[...nextauth].ts`:** Configuración de NextAuth para autenticación.
- **`components`:** Contiene los componentes UI de NextUI utilizados para gestionar las historias clínicas.
- **`lib/prisma.ts`:** Configuración para interactuar con Prisma.
- **`pages`:** Contiene las rutas principales de la aplicación, incluyendo la gestión de historias clínicas.
