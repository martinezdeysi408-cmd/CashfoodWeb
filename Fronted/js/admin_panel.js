// Admin panel functionality for Cafétin Don Domingo
(function(){
  const KIOSKO_ID = 'don_domingo';

  function loadMenus(){
    const stored = localStorage.getItem('cashfoodMenus');
    if(stored) return JSON.parse(stored);
    if(typeof menus !== 'undefined') return JSON.parse(JSON.stringify(menus));
    return {};
  }

  function saveMenus(m){
    localStorage.setItem('cashfoodMenus', JSON.stringify(m));
  }

  function checkAdmin(){
    const sesion = localStorage.getItem('cashfoodSesionActiva');
    if(!sesion) {
      alert('Acceso denegado. Inicia sesión como administrador.');
      window.location.href = 'index.html';
      return false;
    }
    const usuario = JSON.parse(sesion);
    if(usuario.role !== 'admin'){
      alert('Acceso denegado. Se requiere rol administrador.');
      window.location.href = 'index.html';
      return false;
    }
    // Optional: ensure admin is assigned to the correct kiosko
    return true;
  }

  function render(){
    const cont = document.getElementById('admin-productos-lista');
    if(!cont) return;
    const all = loadMenus();
    const kiosco = all[KIOSKO_ID] || { productos: [] };
    cont.innerHTML = '';
    if(!Array.isArray(kiosco.productos) || kiosco.productos.length === 0){
      cont.innerHTML = '<p>No hay productos aún.</p>';
      return;
    }
    kiosco.productos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'producto-tarjeta-global';
      card.style.display = 'flex';
      card.style.gap = '12px';
      card.style.alignItems = 'center';
      card.innerHTML = `
        <img src="../${p.imagen || 'imagenes/sandwich.jpg'}" alt="${p.nombre}" style="width:84px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #eee;">
        <div style="flex:1">
          <div style="font-weight:700">${p.nombre}</div>
          <div style="color:#555;font-size:0.95rem">${p.categoria} • C$ ${Number(p.precio).toFixed(2)}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn-agregar-global" data-id="${p.id}" data-action="editar" style="background:#f0ad4e;">Editar</button>
          <button class="btn-agregar-global" data-id="${p.id}" data-action="eliminar" style="background:#c0392b;">Eliminar</button>
        </div>
      `;
      cont.appendChild(card);
    });

    // attach listeners
    cont.querySelectorAll('button[data-action]')?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const action = e.target.getAttribute('data-action');
        if(action === 'eliminar') eliminarProducto(id);
        if(action === 'editar') alert('Funcionalidad de editar no implementada aún.');
      });
    });
  }

  function agregarProducto(e){
    e.preventDefault();
    const nombre = document.getElementById('p-nombre').value.trim();
    const categoria = document.getElementById('p-categoria').value.trim();
    const precio = parseFloat(document.getElementById('p-precio').value);
    const imagen = document.getElementById('p-imagen').value.trim();

    if(!nombre || !categoria || isNaN(precio)){
      alert('Complete nombre, categoría y precio válidos.');
      return;
    }

    const all = loadMenus();
    if(!all[KIOSKO_ID]) all[KIOSKO_ID] = { nombre: 'Cafétin Don Domingo', productos: [] };
    const nuevo = {
      id: `${KIOSKO_ID}-${Date.now()}`,
      nombre,
      descripcion: '',
      precio: Number(precio),
      imagen: imagen || '',
      categoria
    };

    // Si hay un archivo seleccionado, leerlo como DataURL y usarlo como imagen
    const fileInput = document.getElementById('p-imagen-file');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        nuevo.imagen = ev.target.result; // data:image/...
        all[KIOSKO_ID].productos.push(nuevo);
        saveMenus(all);
        render();
        document.getElementById('form-agregar-producto').reset();
        alert('Producto agregado correctamente con imagen subida.');
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      all[KIOSKO_ID].productos.push(nuevo);
      saveMenus(all);
      render();
      document.getElementById('form-agregar-producto').reset();
      alert('Producto agregado correctamente.');
    }
  }

  function eliminarProducto(id){
    if(!confirm('¿Eliminar este producto?')) return;
    const all = loadMenus();
    const k = all[KIOSKO_ID];
    if(!k || !Array.isArray(k.productos)) return;
    const idx = k.productos.findIndex(p => p.id === id);
    if(idx === -1) return;
    k.productos.splice(idx,1);
    saveMenus(all);
    render();
    alert('Producto eliminado.');
  }

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    if(!checkAdmin()) return;
    const form = document.getElementById('form-agregar-producto');
    form.addEventListener('submit', agregarProducto);
    render();
  });
})();