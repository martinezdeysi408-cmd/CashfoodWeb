// ===============================================
// Archivo: productos.js
// Propósito: Manejar el catálogo global de productos, búsqueda y filtrado por categoría.
// Dependencias: Requiere el objeto 'menus' (de data.js) y la función 'agregarAlCarrito' (de carrito_utilidades.js)
// ===============================================


/**
 * Normaliza una cadena de texto para comparaciones (ej: quita espacios, acentos y convierte a minúsculas).
 * @param {string} texto - La cadena a normalizar.
 * @returns {string} El texto normalizado.
 */
function normalizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    // Esta parte asegura que los acentos y otros caracteres especiales se manejen correctamente.
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}


/**
 * Recorre todos los quioscos en el objeto 'menus' y extrae una lista plana de todos los productos.
 * Cada producto tendrá propiedades 'kioscoId' y 'kioscoNombre' adjuntas.
 * @returns {Array} Una lista de todos los productos de todos los quioscos.
 */
function obtenerTodosLosProductos() {
    let todosLosProductos = [];
    
    // Ahora dependemos de 'menus' que debe estar cargado desde data.js
    // Preferir menús guardados en localStorage (persistencia por admin), sino usar el objeto global 'menus'
    const stored = localStorage.getItem('cashfoodMenus');
    const sourceMenus = stored ? JSON.parse(stored) : (typeof menus !== 'undefined' ? menus : {});

    if (!sourceMenus || Object.keys(sourceMenus).length === 0) {
        console.error("Error: No hay datos de 'menus' disponibles. Asegúrese de cargar data.js o inicializar 'cashfoodMenus'.");
        return todosLosProductos;
    }

    for (const kioscoId in sourceMenus) {
        const kiosco = sourceMenus[kioscoId];
        
        // Algunos quioscos en `menus` pueden no definir un arreglo `productos`.
        // Protegemos contra eso para evitar errores en tiempo de ejecución.
        const productosConKiosco = Array.isArray(kiosco.productos)
            ? kiosco.productos.map(producto => ({
                ...producto,
                kioscoId: kioscoId,
                kioscoNombre: kiosco.nombre
            }))
            : [];

        if (productosConKiosco.length > 0) {
            todosLosProductos.push(...productosConKiosco);
        }
    }
    return todosLosProductos;
}


/**
 * Renderiza el catálogo global de productos en la página 'productos.html'.
 */
function renderizarCatalogoGlobal() {
    const todosLosProductos = obtenerTodosLosProductos();
    // Ya no chequeamos ni creamos el contenedor, confiamos en el HTML
    const inputBusqueda = document.querySelector('.buscador-productos input[type="text"]');
    
    // Verifica si el contenedor de resultados existe antes de continuar
    if (!document.querySelector('.productos-global-contenedor')) {
         console.error("Error: Contenedor de productos no encontrado. Verifique la clase 'productos-global-contenedor' en productos.html");
         return;
    }

    // 1. Lógica para el filtro por Categoría
    document.querySelectorAll('.categoria-tarjeta').forEach(tarjeta => {
        tarjeta.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Leer la categoría directamente del atributo data-category
            const categoriaAFiltrar = e.currentTarget.getAttribute('data-category') || ''; 
            
            // Resetear y activar la tarjeta seleccionada
            document.querySelectorAll('.categoria-tarjeta').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');

            aplicarFiltro(todosLosProductos, inputBusqueda.value, categoriaAFiltrar);
        });
    });

    // 2. Lógica para el filtro por Búsqueda
    inputBusqueda.addEventListener('input', () => {
        // Al buscar, limpia el estado activo de las categorías
        document.querySelectorAll('.categoria-tarjeta').forEach(t => t.classList.remove('active'));
        
        aplicarFiltro(todosLosProductos, inputBusqueda.value, '');
    });

    // 3. Función de renderizado y filtrado principal
    function aplicarFiltro(productos, busqueda, categoria) {
        // Usar normalizarTexto para búsquedas más flexibles (ej: 'rapidas' encuentra 'Rápidas')
        const busquedaLower = normalizarTexto(busqueda);
        const categoriaLower = normalizarTexto(categoria);

        const contenedor = document.querySelector('.productos-global-contenedor');
        contenedor.innerHTML = ''; 

        const productosFiltrados = productos.filter(p => {
            // Filtro por Búsqueda (nombre o descripción)
            const coincideBusqueda = 
                normalizarTexto(p.nombre).includes(busquedaLower) ||
                normalizarTexto(p.descripcion).includes(busquedaLower);
            
            // Filtro por Categoría con normalización
            const productoCategoriaNormalizada = normalizarTexto(p.categoria);
            
            const coincideCategoria = 
                categoriaLower === '' || // 'Ver Todo' tiene data-category=""
                productoCategoriaNormalizada === categoriaLower; 

            return coincideBusqueda && coincideCategoria;
        });

        // Limpiar y dibujar los resultados
        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = '<p class="mensaje-no-resultados">No se encontraron productos que coincidan con la búsqueda o categoría.</p>';
        } else {
            productosFiltrados.forEach(producto => {
                const productoHTML = `
                    <div class="producto-tarjeta-global">
                        <img src="../${producto.imagen}" alt="Imagen de ${producto.nombre}" class="producto-imagen">
                        <div class="producto-detalle">
                            <span class="producto-kiosco">Vendido por: ${producto.kioscoNombre}</span>
                            <h3 class="producto-nombre">${producto.nombre}</h3>
                            <p class="producto-descripcion">${producto.descripcion}</p>
                            <div class="producto-footer">
                                <span class="producto-precio">C$ ${producto.precio.toFixed(2)}</span>
                                <button class="btn-agregar-global" 
                                            data-producto-id="${producto.id}" 
                                            data-kiosco-id="${producto.kioscoId}">
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                // Usar insertAdjacentHTML es ligeramente más eficiente que +=
                contenedor.insertAdjacentHTML('beforeend', productoHTML);
            });
            
            // Re-añadir Event Listener a los botones "Añadir al Carrito"
            document.querySelectorAll('.btn-agregar-global').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const productoId = event.target.getAttribute('data-producto-id');
                    const kioscoId = event.target.getAttribute('data-kiosco-id');
                    
                    if (typeof agregarAlCarrito === 'function') {
                        agregarAlCarrito(kioscoId, productoId); 
                    } else {
                        console.error("La función agregarAlCarrito no está definida.");
                    }
                });
            });
        }
    }

    // Cargar la vista inicial sin filtros
    aplicarFiltro(todosLosProductos, '', ''); 
}

// ----------------------------------------------------------------------------------
// NOTA: Se ha eliminado el bloque window.onload de este archivo para evitar conflictos.
// La función renderizarCatalogoGlobal() será llamada desde index.js al inicio.
// ----------------------------------------------------------------------------------