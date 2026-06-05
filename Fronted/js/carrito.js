// ===============================================
// Archivo: carrito.js
// Propósito: Renderizar el carrito y manejar el pago.
// Dependencias: carrito_utilidades.js (para obtenerCarrito, guardarCarrito, etc.)
// ===============================================

const costoServicio = 0.00; 
const descuento = 0.00; 

/**
 * Redibuja la lista de artículos y actualiza el resumen y el contador global.
 */
function renderizarCarrito() {
    // Usa la función de utilidades
    const carrito = obtenerCarrito(); 
    const listaContenedor = document.getElementById('items-carrito-contenedor');
    const btnCheckout = document.getElementById('btn-procesar-pago');

    listaContenedor.innerHTML = ''; 

    if (carrito.length === 0) {
        listaContenedor.innerHTML = '<p style="text-align: center; margin-top: 20px;">Tu carrito está vacío. ¡Es hora de ordenar!</p>';
        btnCheckout.disabled = true;
    } else {
        btnCheckout.disabled = false;
        carrito.forEach(item => {
            const itemTotal = item.precio * item.cantidad;
            const itemHTML = `
                <div class="item-carrito">
                    <div class="item-info">
                        <span class="item-nombre">${item.nombre}</span>
                        <span class="item-kiosco">Quiosco: ${item.kiosco}</span>
                    </div>
                    <div class="item-controles">
                        <div class="cantidad-control">
                            <button class="btn-cantidad" data-id="${item.id}" data-action="restar">-</button>
                            <span class="item-cantidad">${item.cantidad}</span>
                            <button class="btn-cantidad" data-id="${item.id}" data-action="sumar">+</button>
                        </div>
                        <span class="item-precio-unitario">C$ ${itemTotal.toFixed(2)}</span>
                        <button class="btn-eliminar" data-id="${item.id}">
                            <ion-icon name="close-circle-outline"></ion-icon>
                        </button>
                    </div>
                </div>
            `;
            listaContenedor.innerHTML += itemHTML;
        });

        agregarListenersControles();
    }

    actualizarResumen(carrito);
}

/**
 * Calcula y actualiza el subtotal, el total y muestra en el resumen.
 * @param {Array} carrito - El array actual del carrito.
 */
function actualizarResumen(carrito) {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = subtotal + costoServicio - descuento;

    document.getElementById('carrito-subtotal').textContent = `C$ ${subtotal.toFixed(2)}`;
    document.getElementById('carrito-servicio').textContent = `C$ ${costoServicio.toFixed(2)}`;
    document.getElementById('carrito-descuento').textContent = `C$ ${descuento.toFixed(2)}`;
    document.getElementById('carrito-total').textContent = `C$ ${total.toFixed(2)}`;
}

/**
 * Maneja las acciones de sumar, restar y eliminar productos.
 */
function manejarItem(id, action) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(item => item.id === id);

    if (index === -1) return; 

    if (action === 'sumar') {
        carrito[index].cantidad += 1;
    } else if (action === 'restar') {
        carrito[index].cantidad -= 1;
        if (carrito[index].cantidad < 1) {
            carrito.splice(index, 1);
        }
    } else if (action === 'eliminar') {
        carrito.splice(index, 1);
    }

    guardarCarrito(carrito);
    renderizarCarrito(); 
}

/**
 * Agrega los event listeners a los botones generados dinámicamente.
 */
function agregarListenersControles() {
    document.querySelectorAll('.btn-cantidad').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const action = e.currentTarget.getAttribute('data-action');
            manejarItem(id, action);
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            manejarItem(id, 'eliminar');
        });
    });
}

/**
 * Procesa el pago, guarda en el historial y redirige al recibo.
 */
function procesarPago() {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado'); 
    
    if (usuarioLogueado === 'true') {
        
        const carritoActual = obtenerCarrito();
        // Asegúrate de que 'calcularTotales' esté disponible o duplica la lógica de 'actualizarResumen'
        const resumen = {
            subtotal: carritoActual.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
            costoServicio: costoServicio,
            descuento: descuento,
            total: carritoActual.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) + costoServicio - descuento
        };

        if (carritoActual.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        // 1. Crear el objeto de la Orden/Recibo
        const orden = {
            idOrden: `ORD-${Date.now()}`, 
            fecha: new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', month: 'numeric', day: 'numeric', 
                hour: '2-digit', minute: '2-digit'
            }), 
            items: carritoActual,
            totales: resumen,
            // NOTA: 'usuarioData' no está definido en tu login. Cambiando a 'cashfoodSesionActiva'
            usuario: JSON.parse(localStorage.getItem('cashfoodSesionActiva')) 
        };
        
        // 2. ACTUALIZAR EL HISTORIAL
        // Usa la función de utilidades
        const historial = obtenerHistorial(); 
        historial.unshift(orden); 
        localStorage.setItem('cashfoodHistorial', JSON.stringify(historial));
        
        // 3. Guardar la orden actual (para la página de recibo inmediato)
        localStorage.setItem('cashfoodUltimaOrden', JSON.stringify(orden));
        
        // 4. Limpiar el carrito
        localStorage.removeItem('cashfoodCarrito');
        
        // 5. Redirigir a la página del recibo
        window.location.href = 'recibo.html'; 
        
    } else {
        localStorage.setItem('forzarLogin', 'true');
        window.location.href = 'index.html';
    }
}

// ===============================================
// 2. INICIO AL CARGAR LA PÁGINA
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
    // Añade el listener al botón de pago
    document.getElementById('btn-procesar-pago').addEventListener('click', procesarPago);
});