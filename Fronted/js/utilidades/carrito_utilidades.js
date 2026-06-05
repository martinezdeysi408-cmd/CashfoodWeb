// ===============================================
// Archivo: carrito_utilidades.js
// -----------------------------------------------
// Funciones esenciales del carrito y contador
// ===============================================

/**
 * Carga el array de productos del carrito desde localStorage.
 * @returns {Array} Un array con los productos del carrito o un array vacío.
 */
function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('cashfoodCarrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

/**
 * Guarda el array de productos del carrito en localStorage.
 * @param {Array} carrito - El array de productos a guardar.
 */
function guardarCarrito(carrito) {
    localStorage.setItem('cashfoodCarrito', JSON.stringify(carrito));
    actualizarContadorCarrito(carrito);
}

/**
 * Actualiza el número de artículos en el ícono del carrito en la cabecera.
 * @param {Array} [carrito] - Opcional. El carrito si ya está cargado.
 */
function actualizarContadorCarrito(carrito = obtenerCarrito()) {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        // Calcula el total de ítems (sumando la propiedad 'cantidad' de cada producto)
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        
        contador.textContent = totalItems;
        // Muestra u oculta el contador
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

/**
 * Agrega o incrementa la cantidad de un producto en el carrito.
 * NOTA: Esta función DEBE permanecer aquí para que el botón "Añadir" funcione globalmente.
 * Requiere que la constante 'menus' (de data.js) esté definida globalmente.
 * @param {string} kioscoId - ID del quiosco.
 * @param {string} productoId - ID del producto a agregar.
 */
function agregarAlCarrito(kioscoId, productoId) {
    // Es CRÍTICO que 'menus' se haya cargado antes.
    if (typeof menus === 'undefined') {
        console.error("Error: La estructura de datos 'menus' no está disponible.");
        return;
    }

    const carrito = obtenerCarrito();
    const kiosco = menus[kioscoId];
    if (!kiosco) return;

    const productoData = kiosco.productos.find(p => p.id === productoId);
    if (!productoData) return;

    const itemExistente = carrito.find(item => item.id === productoId);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        const nuevoItem = {
            id: productoData.id,
            nombre: productoData.nombre,
            precio: productoData.precio,
            kiosco: kiosco.nombre,
            cantidad: 1
        };
        carrito.push(nuevoItem);
    }
    
    guardarCarrito(carrito);
    alert(`Se agregó 1 unidad de "${productoData.nombre}" al carrito.`);
}

// Inicializa el contador al cargar CUALQUIER página que cargue este script
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

// ... (código previo de carrito_utilidades.js, incluyendo obtenerCarrito y guardarCarrito)

// ===============================================
// Funciones Globales de Utilidad
// ===============================================

/**
 * Formatea un número como moneda (C$).
 * @param {number} valor - El valor numérico.
 * @returns {string} El valor formateado.
 */
function formatoMoneda(valor) {
    return `C$ ${valor.toFixed(2)}`; 
}

/**
 * Carga el historial de órdenes desde localStorage.
 * @returns {Array} Un array con las órdenes pasadas o un array vacío.
 */
function obtenerHistorial() {
    const historialJSON = localStorage.getItem('cashfoodHistorial');
    return historialJSON ? JSON.parse(historialJSON) : [];
}


// ----------------------------------------------------------------------------------
// NOTA: Se ha eliminado el bloque window.onload de este archivo para evitar conflictos.
// ----------------------------------------------------------------------------------