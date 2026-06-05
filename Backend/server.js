// Archivo: server.js

const express = require('express');
const mysql = require('mysql2/promise'); // Usamos la versión 'promise' para Async/Await
const app = express();
const port = 3000; // Puerto de tu API

// ----------------------------------------------------
// 1. CONFIGURACIÓN DE CONEXIÓN A MySQL
// ----------------------------------------------------
// **IMPORTANTE:** Ajusta estas credenciales a las que usaste en MySQL Workbench.
const dbConfig = {
    host: 'localhost',      // La BD está en la misma computadora
    user: 'kener',           // Usuario por defecto (ajustar si es necesario)
    password: 'llagamari', // <--- ¡CAMBIA ESTO!
    database: 'cashfood_db' // Nombre del esquema que creaste
};

// Middleware para permitir que Express lea JSON
app.use(express.json()); 

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
// Esto permite que tu frontend (que corre localmente) acceda al API.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite acceso desde cualquier origen (Para desarrollo)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ----------------------------------------------------
// 2. RUTA API DE EJEMPLO: Obtener todos los Quioscos
// ----------------------------------------------------
app.get('/api/quioscos', async (req, res) => {
    let connection;
    try {
        // Establecer la conexión a la base de datos
        connection = await mysql.createConnection(dbConfig);
        
        // Consulta SQL: Selecciona todos los campos de la tabla Quioscos
        const [rows] = await connection.execute('SELECT id, nombre, slug, imagen_banner FROM Quioscos');
        
        // Devuelve los resultados en formato JSON
        res.json(rows);
        
    } catch (error) {
        console.error('Error al obtener quioscos:', error);
        // Devuelve un error 500 (Internal Server Error)
        res.status(500).json({ error: 'Error interno del servidor al obtener quioscos.' });
        
    } finally {
        // Asegúrate de cerrar la conexión al finalizar, si se abrió
        if (connection) connection.end();
    }
});


// ----------------------------------------------------
// 3. INICIO DEL SERVIDOR
// ----------------------------------------------------
app.listen(port, () => {
    console.log(`Servidor API corriendo en http://localhost:${port}`);
    console.log(`Ruta de Quioscos: http://localhost:${port}/api/quioscos`);
});