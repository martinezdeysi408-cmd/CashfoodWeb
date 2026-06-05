// ===============================================
// Archivo: recibo.js
// Propósito: Leer la última orden guardada y renderizar el recibo.
// ===============================================

/**
 * Formatea un número como moneda (C$).
 * @param {number} valor - El valor numérico.
 * @returns {string} El valor formateado.
 */
function formatoMoneda(valor) {
    // Usamos 'es-NI' para forzar la C$ nicaragüense, si aplica, o 'es-ES' si no.
    return `C$ ${valor.toFixed(2)}`; 
}

/**
 * Función principal que carga y renderiza el recibo.
 */
function renderizarRecibo() {
    const reciboContenedor = document.getElementById('recibo-contenedor');
    const ordenJSON = localStorage.getItem('cashfoodUltimaOrden');
    
    if (!ordenJSON) {
        reciboContenedor.innerHTML = '<div class="recibo-cabecera"><h1>Recibo no Encontrado</h1><p>Parece que no se procesó una orden recientemente.</p></div>';
        return;
    }
    
    const orden = JSON.parse(ordenJSON);
    
    // Generar el HTML de los ítems
    let itemsHTML = orden.items.map(item => `
        <div class="item-recibo">
            <span class="item-nombre">${item.cantidad}x ${item.nombre} (${item.kiosco})</span>
            <span class="item-precio">${formatoMoneda(item.precio * item.cantidad)}</span>
        </div>
    `).join('');
    
    // Generar el HTML de los totales
    const totales = orden.totales;
    const usuarioNombre = orden.usuario ? orden.usuario.nombre : 'Invitado';

    const reciboHTML = `
        <div class="recibo-cabecera">
            <h1>CASHFOOD</h1>
            <p>¡Gracias por tu compra!</p>
            <p>Orden ID: <strong>${orden.idOrden}</strong></p>
            <p>Fecha: ${orden.fecha}</p>
        </div>
        
        <div class="recibo-info">
            <p>Cliente: <strong>${usuarioNombre}</strong></p>
            <p>Carné: <strong>${orden.usuario ? orden.usuario.carnet : 'N/A'}</strong></p>
        </div>

        <div class="recibo-items">
            <h3>Detalle de la Orden</h3>
            ${itemsHTML}
        </div>

        <div class="recibo-totales">
            <p><span>Subtotal:</span> <span>${formatoMoneda(totales.subtotal)}</span></p>
            <p><span>Costo de Servicio:</span> <span>${formatoMoneda(totales.costoServicio)}</span></p>
            <p><span>Descuento:</span> <span>-${formatoMoneda(totales.descuento)}</span></p>
            <hr>
            <p class="total"><span>TOTAL PAGADO:</span> <span>${formatoMoneda(totales.total)}</span></p>
        </div>

        <div class="recibo-final">
            <h3>¡Tu orden está lista para ser preparada!</h3>
            <p>Muestra esta pantalla en el quiosco para recoger tu pedido.</p>
        </div>
    `;

    reciboContenedor.innerHTML = reciboHTML;
    
    // Opcional: Limpiar la orden después de verla (para que no se muestre si recarga la página)
    // localStorage.removeItem('cashfoodUltimaOrden'); 
}

// Iniciar la renderización cuando la página cargue
document.addEventListener('DOMContentLoaded', renderizarRecibo);