// ===============================================
// Archivo: historial.js
// Propósito: Cargar y renderizar el historial de órdenes del usuario.
// Dependencias: carrito_utilidades.js (para obtenerHistorial y formatoMoneda)
// ===============================================

function renderizarHistorial() {
    const contenedor = document.getElementById('historial-contenedor');
    
    // Verifica si las funciones de utilidad existen
    if (typeof obtenerHistorial !== 'function' || typeof formatoMoneda !== 'function') {
        console.error("Error: Faltan funciones de carrito_utilidades.js");
        contenedor.innerHTML = '<p>Error al cargar utilidades.</p>';
        return;
    }

    const historial = obtenerHistorial(); 

    if (historial.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; font-size: 1.2em;">Aún no tienes órdenes registradas.</p>';
        return;
    }

    let historialHTML = '';
    
    historial.forEach(orden => {
        // Generar la lista de productos
        const detalleProductos = orden.items.map(item => `
            <div class="producto-linea">
                <span>${item.cantidad}x ${item.nombre}</span>
                <span>${formatoMoneda(item.precio * item.cantidad)}</span>
            </div>
        `).join('');

        historialHTML += `
            <div class="item-orden">
                <h3>
                    Orden No. ${orden.idOrden.substring(4)} 
                    <span style="font-size: 0.8em; font-weight: normal;">${orden.fecha}</span>
                </h3>
                <p><strong>Quioscos:</strong> ${[...new Set(orden.items.map(i => i.kiosco))].join(', ')}</p>
                
                <div class="detalle-productos">
                    ${detalleProductos}
                </div>
                
                <p class="total-orden">Total Pagado: ${formatoMoneda(orden.totales.total)}</p>
            </div>
        `;
    });

    contenedor.innerHTML = historialHTML;
}

// ----------------------------------------------------------------------------------
// Llama a la función principal al cargar la página
// ----------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', renderizarHistorial);