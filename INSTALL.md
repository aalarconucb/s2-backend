# Manual de instalación

## 1. Requerimientos

| Nombre       | Versión | Descripción                                            | Instalación                                      |
|--------------|---------|--------------------------------------------------------|--------------------------------------------------|
| `PostgreSQL` | ^16     | Gestor de base de datos.                               | https://www.postgresql.org/download/linux/debian |
| `NodeJS`     | ^18     | Entorno de programación de JavaScript.                 | `nvm install 18` https://github.com/nvm-sh/nvm   |                       |

## 2. Instalación

### Clonación del proyecto e instalación de dependencias

```bash
# Clonación del proyecto
git clone ruta_del_proyecto

# Ingresamos dentro de la carpeta del proyecto
cd backend-base-v2

# Instalamos dependencias puedes usar npm o yarn
npm install
```

### Archivos de configuración.

Copiar archivos `.sample` y modificar los valores que sean necesarios (para más detalles revisa la sección **Variables
de entorno**).

```bash
# Variables de entorno globales
cp .env.sample .env

# Otros parámetros requeridos
cp src/common/config/app.js.sample src/common/config/app.js
cp src/common/config/db.js.sample src/common/config/db.js
cp src/common/config/openid.js.sample src/common/config/openid.js
```

### Creación y configuración de la Base de Datos

Antes debes tener creada la base de datos segun el nombre que configuraste en el archivo `.env `

```bash
# Ejecutar el comando
npm run db
```
### Despliegue de la aplicación

```bash
# Ejecución en modo desarrollo
npm run start

# Ejecución en modo desarrollo (live-reload)
npm run start:dev
```

### Variables de entorno

**Datos de despliegue**

| Variable   | Valor por defecto | Descripción                                                    |
|------------|-------------------|----------------------------------------------------------------|
| `NODE_ENV` | `development`     | Ambiente de despliegue (`development`, `test` o `production`). |
| `PORT`     | `3001`            | Puerto en el que se levantará la aplicación.                   |

\*\*\* La URL de despliegue sería: `http://localhost:3001/api/estado`

**Configuración de la base de datos**

| Variable                 | Valor por defecto | Descripción                                                                                       |
|--------------------------|-------------------|---------------------------------------------------------------------------------------------------|
| `DB_HOST`                | `localhost`       | Host de la base de datos.                                                                         |
| `DB_USERNAME`            | `postgres`        | nombre de usuario de la base de datos.                                                            |
| `DB_PASSWORD`            | `postgres`        | contraseña de la base de datos.                                                                   |
| `DB_DATABASE`            | `database_db`     | nombre de la base de datos.                                                                       |
| `DB_PORT`                | `5432`            | puerto de despliegue de la base de datos.

