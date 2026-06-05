// ===============================================
// Archivo: menu_kiosco.js
// Propósito: Define la estructura de datos y maneja el renderizado del menú de un quiosco.
// Requiere: data.js (para 'menus') y carrito_utilidades.js (para 'agregarAlCarrito')
// ===============================================

// Almacenará todos los productos del quiosco
let productosActuales = []; 
// ID del quiosco cargado
let kioscoIdActual = null; 

/**
 * Renderiza los productos en el contenedor, aplicando filtros de búsqueda y categoría.
 * @param {Array} productos - El array de productos a renderizar.
 * @param {string} busqueda - Texto de búsqueda.
 * @param {string} categoria - Categoría seleccionada.
 */
function renderizarProductos(productos, busqueda, categoria) {
  const productosContenedor = document.getElementById('productos-contenedor');
  // Es CRÍTICO limpiar el contenedor antes de dibujar
  productosContenedor.innerHTML = ''; 
  
  const busquedaLower = busqueda.toLowerCase().trim();

  // 1. Aplicar Filtrado
  const productosFiltrados = productos.filter(producto => {
    // Filtro por Búsqueda (nombre o descripción)
    const coincideBusqueda = 
      producto.nombre.toLowerCase().includes(busquedaLower) ||
      producto.descripcion.toLowerCase().includes(busquedaLower);
    
    // Filtro por Categoría
    const coincideCategoria = 
      categoria === 'todos' || // Mostrar todo
      producto.categoria === categoria; 

    return coincideBusqueda && coincideCategoria;
  });

  // 2. Dibujar los resultados
  if (productosFiltrados.length === 0) {
    productosContenedor.innerHTML = '<p class="mensaje-no-resultados">No se encontraron productos en esta categoría o búsqueda.</p>';
  } else {
    productosFiltrados.forEach(producto => {
      const productoHTML = `
        <div class="producto-tarjeta-menu">
            <img src="../${producto.imagen}" alt="Imagen de ${producto.nombre}" class="producto-imagen-menu">
            <div class="producto-info">
                <h3 class="producto-nombre-menu">${producto.nombre}</h3>
                <p class="producto-descripcion-menu">${producto.descripcion}</p>
                <div class="producto-footer-menu">
                    <span class="producto-precio-menu">C$ ${producto.precio.toFixed(2)}</span>
                    <button class="btn-agregar-menu" 
                            data-producto-id="${producto.id}" 
                            data-kiosco-id="${kioscoIdActual}">
                        Añadir
                    </button>
                </div>
            </div>
        </div>
      `;
      productosContenedor.insertAdjacentHTML('beforeend', productoHTML);
    });
    
    // 3. Re-añadir Event Listener a los botones "Añadir al Carrito"
    document.querySelectorAll('.btn-agregar-menu').forEach(btn => {
      btn.addEventListener('click', (event) => {
        const productoId = event.target.getAttribute('data-producto-id');
        const kioscoId = event.target.getAttribute('data-kiosco-id');
        
        if (typeof agregarAlCarrito === 'function') {
          agregarAlCarrito(kioscoId, productoId); 
        } else {
          console.error("La función agregarAlCarrito no está definida. Verifique la carga de carrito_utilidades.js.");
        }
      });
    });
  }
}

/**
 * Función principal para inicializar la página del menú del quiosco.
 */
function inicializarMenuKiosco() {
  kioscoIdActual = localStorage.getItem('kioscoSeleccionadoId');
  // Preferir menús persistidos en localStorage si el admin los ha modificado
  const stored = localStorage.getItem('cashfoodMenus');
  const sourceMenus = stored ? JSON.parse(stored) : (typeof menus !== 'undefined' ? menus : {});
  const datosKiosco = sourceMenus[kioscoIdActual];

  const infoKioscoDiv = document.getElementById('info-kiosco');
  const campoBusqueda = document.getElementById('campo-busqueda');
  const filtroSelect = document.getElementById('filtro-categorias');

  // Si no se encontró el Quiosco o el ID es nulo, mostrar error.
  if (!kioscoIdActual || !datosKiosco) {
    if (infoKioscoDiv) {
      infoKioscoDiv.innerHTML = '<h1 style="color: red;">Error: No se seleccionó un quiosco.</h1>';
    }
    return;
  }

  // 1. Almacenar los productos para el filtrado global
  productosActuales = Array.isArray(datosKiosco.productos) ? datosKiosco.productos : [];
  
  // 2. Renderizar la información del Quiosco (Título/Banner)
  infoKioscoDiv.innerHTML = `
    <h1 class="titulo-kiosco">${datosKiosco.nombre}</h1>
    <img src="${datosKiosco.imagen}" alt="Banner de ${datosKiosco.nombre}" class="banner-kiosco">
  `;

  // 3. Llenar el Select de Categorías
  const categoriasUnicas = [...new Set(productosActuales.map(p => p.categoria))];
  
  // Limpiamos solo para asegurar que "Todas las Categorías" sea la primera
  filtroSelect.innerHTML = '<option value="todos">Todas las Categorías</option>'; 
  
  categoriasUnicas.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filtroSelect.appendChild(option);
  });

  // 4. Configurar Event Listeners para Búsqueda y Filtro
  const actualizarVista = () => {
    const busqueda = campoBusqueda.value;
    const categoria = filtroSelect.value;
    renderizarProductos(productosActuales, busqueda, categoria);
  };
  
  campoBusqueda.addEventListener('input', actualizarVista);
  filtroSelect.addEventListener('change', actualizarVista);

  // 5. Cargar la vista inicial del menú
  actualizarVista();
}

// Agregar esto al final, en la última línea de menu_kiosco.js
document.addEventListener('DOMContentLoaded', inicializarMenuKiosco);