# Cashfood - Sistema de Pedidos para Quioscos Universitarios

## Descripción del Proyecto
Cashfood es una aplicación web diseñada para agilizar la toma de pedidos en quioscos universitarios. Actualmente, el sistema funciona como una *Single Page Application (SPA)* simulada en el cliente, construida con *HTML5, CSS3 y JavaScript Modular (ES6+)*.

### Arquitectura Actual:
- *Frontend:* Gestiona la lógica de negocio en el navegador.
- *Datos:* Utiliza un archivo estático data.js como fuente de datos (menús y productos) y localStorage para la persistencia de datos del usuario (sesión, carrito de compras e historial de pedidos).
- *Estructura:* El código está organizado en carpetas Backend:/db y /node_modules. Fronted:/imagenes, /Html, index.html, /css y /js. La lógica se divide en módulos funcionales: index.js (orquestador), productos.js (catálogo), carrito.js (lógica de compra) y carrito_utilidades.js (funciones compartidas).

### Objetivo del Backend (En Desarrollo):
El proyecto está en proceso de migración hacia un backend robusto utilizando Node.js con Express. El objetivo es reemplazar `data.js` y `localStorage` por una base de datos relacional **MySQL** gestionada a través de MySQL Workbench. Actualmente no existe una base de datos creada; se planea implementarla en el futuro utilizando MySQL Workbench.

## Comandos de Ejecución

### Para el Backend (API Node.js)
Actualmente el servidor sirve como punto de entrada para la futura API.
```bash
node server.js