# Base de datos — Pasos iniciales (MySQL Workbench)

Este archivo explica cómo crear la base de datos `cashfood_db` y ejecutar `schema.sql` usando MySQL Workbench y la CLI.

## Requisitos
- MySQL Server instalado (version recomendada: 5.7+ o 8.x)
- MySQL Workbench instalado
- Acceso a la línea de comandos `mysql` (opcional)

## Crear la base de datos con MySQL Workbench
1. Abre MySQL Workbench y crea una nueva conexión (si no existe). Configura host, puerto, usuario y contraseña.
2. Conéctate a la instancia.
3. En la barra superior, abre una nueva pestaña SQL (SQL Editor).
4. Abre el archivo `db/schema.sql` (File > Open SQL Script) o pega su contenido en la pestaña.
5. Ejecuta el script (botón rayo ▶️). Esto creará la base `cashfood_db` y las tablas iniciales.

## Crear la base de datos desde la línea de comandos (Windows PowerShell)
Asegúrate de que `mysql` esté en tu `PATH` o usa la ruta completa al ejecutable.

```powershell
# Ejecutar script SQL
mysql -u root -p < .\db\schema.sql
```

Se te pedirá la contraseña del usuario `root`.

## Variables de entorno recomendadas
Crea un archivo `.env` en la raíz del proyecto (no subirlo al control de versiones) con estas claves:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=cashfood_db
```

## Próximos pasos: conectar desde Node.js (contexto y dependencias)
- Dependencias comunes:
  - `mysql2` (cliente MySQL moderno; soporta promesas)
  - `dotenv` (cargar variables de entorno en desarrollo)

- Ejemplo rápido de configuración (archivo `db/pool.js` o `src/db.js`):

```js
// Instalar: npm install mysql2 dotenv
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cashfood_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

- Qué información necesita el backend para crear/usar la conexión:
  - `DB_HOST`: dirección del servidor MySQL (localhost, IP o host remoto)
  - `DB_PORT`: puerto (por defecto 3306)
  - `DB_USER` y `DB_PASSWORD`: credenciales con permisos sobre `DB_NAME`
  - `DB_NAME`: nombre de la base de datos a usar
  - (Opcional) Opciones de pool como `connectionLimit` según tráfico esperado

- Buenas prácticas:
  - No almacenar contraseñas en el repositorio; usar `.env` o un secreto en el entorno de despliegue.
  - Usar `pool` para performance en producción.
  - Manejar reconexiones y errores (try/catch, reintentos según caso).
  - Migraciones: considera usar una herramienta de migraciones (como `knex`, `sequelize` o `umzug`) si el esquema va a cambiar.

## Notas finales
- El script `schema.sql` es un punto de partida. Adapta tipos y relaciones según requisitos (por ejemplo, campos para variantes de productos, inventario, ofertas, etc.).
- Si quieres, puedo:
  - Generar un script adicional para datos de ejemplo (`seed.sql`).
  - Añadir un archivo de migraciones con `knex` o configurar `sequelize`.
  - Implementar la conexión en `server.js` usando `mysql2`.

