// ===============================================
// Archivo: index.js
// Propósito: Orquestador principal, lógica de login/sesión y renderizado de quioscos.
// ===============================================

const contenedor = document.querySelector('.contenedor');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnlogin-popup');
const iconClose = document.querySelector('.icon-close');

function verificarAperturaForzada() {
    const forzarLogin = localStorage.getItem('forzarLogin');
    if (forzarLogin === 'true') {
        const contenedor = document.querySelector('.contenedor');
        if (contenedor) {
            contenedor.classList.add('active-popup');
        }
        localStorage.removeItem('forzarLogin');
    }
}

if (iconClose) {
    iconClose.addEventListener('click', ()=> {
        contenedor.classList.remove('active-popup');
    });
}
if (registerLink) {
    registerLink.addEventListener('click', ()=> {
        contenedor.classList.add('active');
    });
}
if (loginLink) {
    loginLink.addEventListener('click', ()=> {
        contenedor.classList.remove('active');
    });
}

// ------------------------------------------
//  Array de Objetos para Quioscos
// ------------------------------------------
const kioskos = [
    { nombre: "Cafétin Don Domingo", imagen: "imagenes/cafetin_domingo.jpg", id: "don_domingo" },
    { nombre: "Café Kilambé", imagen: "imagenes/cafe_kilambe.jpg", id: "kilambe" },
    { nombre: "Caribeño", imagen: "imagenes/caribeño.jpeg", id: "caribeño" },
    { nombre: "El Güegüense", imagen: "imagenes/el_gueguense.jpeg", id: "el_gueguense" },
    { nombre:"Kiosko las Margaritas", imagen: "imagenes/las_margaritas.jpeg", id: "las_margaritas" },
    { nombre: "El Quiosco del profe", imagen: "imagenes/el_profe.jpeg", id: "el_profe" }
];

// ------------------------------------------
//  Función para renderizar los Quioscos
// ------------------------------------------
function renderizarKioscos() {
    const contenedorKioscos = document.querySelector('.quioscos-contenedor');
    if (!contenedorKioscos) return; 

    contenedorKioscos.innerHTML = ''; 
    kioskos.forEach(kiosco => {
        const tarjetaHTML = `
            <div class="quiosco-tarjeta">
                <img src="${kiosco.imagen}" alt="Imagen del Quiosco ${kiosco.nombre}" class="quiosco-imagen">
                <h2 class="quiosco-nombre">${kiosco.nombre}</h2>
                <button class="btn-ver-menu" data-kiosco-id="${kiosco.id}">Ver Menú</button>
            </div>
        `;
        contenedorKioscos.innerHTML += tarjetaHTML;
    });

    document.querySelectorAll('.btn-ver-menu').forEach(button => {
        button.addEventListener('click', (event) => {
            const kioscoId = event.target.getAttribute('data-kiosco-id');
            localStorage.setItem('kioscoSeleccionadoId', kioscoId);
            window.location.href = 'Html/menu_kiosco.html';
        });
    });
}

// ===============================================
// 3. Lógica del Popup de Login/Registro y Sesión
// ===============================================

const loginForm = document.querySelector('.contenedor .form-contenedor.login form');
const registerForm = document.querySelector('.contenedor .form-contenedor.register form');

// Mostrar/ocultar el selector de quiosco según el rol seleccionado en el formulario de registro
if (registerForm) {
    const rolSelect = registerForm.querySelector('select[name="rol"]');
    const kioscoSelect = registerForm.querySelector('select[name="kiosco"]');
    function updateKioscoVisibility() {
        if (!kioscoSelect) return;
        if (rolSelect && rolSelect.value === 'admin') {
            kioscoSelect.style.display = '';
        } else {
            kioscoSelect.style.display = 'none';
        }
    }
    if (rolSelect && kioscoSelect) {
        rolSelect.addEventListener('change', updateKioscoVisibility);
        // Inicializar visibilidad al cargar
        updateKioscoVisibility();
    }
}

function obtenerUsuarios() {
    const usuariosJSON = localStorage.getItem('cashfoodUsuarios');
    return usuariosJSON ? JSON.parse(usuariosJSON) : {};
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('cashfoodUsuarios', JSON.stringify(usuarios));
}

function iniciarSesion(carnet, contrasena) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios[carnet];
    
    if (usuario && usuario.contrasena === contrasena) {
        // Guarda el objeto de usuario completo en la sesión
        localStorage.setItem('cashfoodSesionActiva', JSON.stringify(usuario)); 
        return true;
    }
    return false;
}

// Asegura que exista un administrador por defecto registrado (en el quiosco don_domingo)
function asegurarAdminPorDefecto() {
    const usuarios = obtenerUsuarios();
    const adminCarnet = 'admin';
    if (!usuarios[adminCarnet]) {
        usuarios[adminCarnet] = {
            nombre: 'Admin Don Domingo',
            email: 'admin@cashfood.local',
            contrasena: 'admin123',
            carnet: adminCarnet,
            role: 'admin',
            kioscoId: 'don_domingo'
        };
        guardarUsuarios(usuarios);
        console.info('Admin por defecto creado: carnet "admin" / contraseña "admin123"');
    }
}

function cerrarSesion() {
    localStorage.removeItem('cashfoodSesionActiva');
    localStorage.removeItem('usuarioLogueado'); 
    location.reload();
}

function verificarSesion() {
    const sesion = localStorage.getItem('cashfoodSesionActiva');
    const btnLogin = document.querySelector('.btnlogin-popup');
    const nav = document.querySelector('.navegacion');
    const btnHistorial = document.getElementById('btn-historial'); 

    // Asegurar existencia del botón desplegable (siempre presente)
    let navMore = document.querySelector('.nav-more');
    if (!navMore && nav) {
        navMore = document.createElement('div');
        navMore.className = 'nav-more';

        const btnMore = document.createElement('button');
        btnMore.className = 'btn-more';
        btnMore.setAttribute('aria-haspopup', 'true');
        btnMore.setAttribute('aria-expanded', 'false');
        btnMore.setAttribute('aria-label', 'Más opciones');
        // Icono SVG de tres puntos (vertical)
        btnMore.innerHTML = '<svg width="6" height="20" viewBox="0 0 6 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="3" cy="3" r="3" fill="currentColor"/><circle cx="3" cy="10" r="3" fill="currentColor"/><circle cx="3" cy="17" r="3" fill="currentColor"/></svg>';

        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';

        btnMore.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = btnMore.getAttribute('aria-expanded') === 'true';
            btnMore.setAttribute('aria-expanded', String(!expanded));
            menu.classList.toggle('show');
            // Si estamos en móvil, abrir como bottom-sheet
            if (window.innerWidth <= 768) {
                document.body.classList.toggle('sheet-open', !expanded);
            }
        });

        navMore.appendChild(btnMore);
        navMore.appendChild(menu);
        if (nav) nav.appendChild(navMore);

        // --- INYECCIÓN ROBUSTA DE ENLACES EN EL DROPDOWN ---
        if (menu) {
            // 1. Crear 'Acerca' si no existe
            if (!menu.querySelector('[data-menu-item="acerca"]')) {
                const acercaOriginal = nav.querySelector('a[href="acerca.html"]') || nav.querySelector('a[href="Html/acerca.html"]');
                if (acercaOriginal) {
                    acercaOriginal.style.display = 'none';
                }

                const acercaItem = document.createElement('a');
                // Verifica la ruta según la posición del archivo actual
                if (window.location.pathname.includes('/Html/')) {
                    acercaItem.href = 'acerca.html';
                } else {
                    acercaItem.href = 'Html/acerca.html';
                }
                acercaItem.textContent = 'Acerca';
                acercaItem.setAttribute('data-menu-item', 'acerca');
                menu.appendChild(acercaItem);
            }

            // 2. Crear 'Mis Facturas' dentro del menú (si no existe)
            if (!menu.querySelector('[data-menu-item="historial"]')) {
                if (btnHistorial) btnHistorial.style.display = 'none';

                const historialItem = document.createElement('a');
                // Ajuste dinámico de ruta para el historial
                if (window.location.pathname.includes('/Html/')) {
                    historialItem.href = 'historial.html';
                } else {
                    historialItem.href = 'Html/historial.html';
                }
                historialItem.textContent = 'Mis Facturas';
                historialItem.setAttribute('data-menu-item', 'historial');
                menu.appendChild(historialItem);
            }

            // 3. Crear 'Panel' (para admins) y ocultarlo por defecto
            if (!menu.querySelector('[data-menu-item="panel"]')) {
                const panelItem = document.createElement('a');
                if (window.location.pathname.includes('/Html/')) {
                    panelItem.href = 'admin_panel.html';
                } else {
                    panelItem.href = 'Html/admin_panel.html';
                }
                panelItem.textContent = 'Panel';
                panelItem.setAttribute('data-menu-item', 'panel');
                panelItem.style.display = 'none';
                menu.appendChild(panelItem);
            }
        }

        // Cerrar al hacer clic fuera
        document.addEventListener('click', () => {
            menu.classList.remove('show');
            btnMore.setAttribute('aria-expanded', 'false');
            if (window.innerWidth <= 768) document.body.classList.remove('sheet-open');
        });
    }

    // --- LOGICA DE SESIÓN ACTIVA ---
    if (sesion) {
        const usuario = JSON.parse(sesion);
        
        if (btnLogin) btnLogin.remove(); 

        const btnSaludo = document.createElement('button');
        btnSaludo.className = 'btn-saludo';
        btnSaludo.textContent = `Hola, ${usuario.nombre}`;

        const btnLogout = document.createElement('button');
        btnLogout.className = 'btnlogout-popup';
        btnLogout.textContent = 'Salir';
        btnLogout.addEventListener('click', cerrarSesion);

        if (nav) {
            const existingNavMore = nav.querySelector('.nav-more');
            if (existingNavMore) {
                nav.insertBefore(btnSaludo, existingNavMore);
                nav.insertBefore(btnLogout, existingNavMore);
            } else {
                nav.appendChild(btnSaludo);
                nav.appendChild(btnLogout);
            }
        }

        // Mostrar elementos privados en el dropdown según corresponda
        const existingNavMore = nav ? nav.querySelector('.nav-more') : null;
        if (existingNavMore) {
            const menu = existingNavMore.querySelector('.dropdown-menu');
            const historialItem = menu ? menu.querySelector('[data-menu-item="historial"]') : null;
            if (historialItem) historialItem.style.display = 'block';
            
            const panelItem = menu ? menu.querySelector('[data-menu-item="panel"]') : null;
            if (panelItem && usuario.role === 'admin') panelItem.style.display = 'block';
        }

        localStorage.setItem('usuarioLogueado', 'true');

    } else {
        // --- LÓGICA DE USUARIO NO AUTENTICADO ---
        if (btnLogin) { 
            btnLogin.addEventListener('click', ()=> {
                if (contenedor) contenedor.classList.add('active-popup');
            });
        }
        if (btnHistorial) {
            btnHistorial.style.display = 'none';
        }
        
        const existingNavMore = nav ? nav.querySelector('.nav-more') : null;
        if (existingNavMore) {
            const menu = existingNavMore.querySelector('.dropdown-menu');
            const historialItem = menu ? menu.querySelector('[data-menu-item="historial"]') : null;
            if (historialItem) historialItem.style.display = 'none';
            const panelItem = menu ? menu.querySelector('[data-menu-item="panel"]') : null;
            if (panelItem) panelItem.style.display = 'none';
        }
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const carnet = loginForm.querySelector('input[type="text"][name="carnet"]').value;
        const contrasena = loginForm.querySelector('input[type="password"]').value; 

        if (iniciarSesion(carnet, contrasena)) {
            alert('¡Inicio de sesión exitoso!');
            localStorage.setItem('usuarioLogueado', 'true'); 
            contenedor.classList.remove('active-popup');
            location.reload(); 
        } else {
            alert('Carné o contraseña incorrectos.');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = registerForm.querySelector('input[type="text"][name="nombre"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const carnet = registerForm.querySelector('input[type="text"][name="carnet"]').value;
        const contrasena = registerForm.querySelector('input[type="password"]').value;
        
        if (!carnet || !contrasena || !nombre || !email) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const rol = registerForm.querySelector('select[name="rol"]') ? registerForm.querySelector('select[name="rol"]').value : 'cliente';

        let usuarios = obtenerUsuarios();
        if (usuarios[carnet]) {
            alert('Este número de carné ya está registrado.');
            return;
        }

        const nuevoUsuario = { nombre, email, contrasena, carnet, role: rol };
        const selectedKiosk = registerForm.querySelector('select[name="kiosco"]') ? registerForm.querySelector('select[name="kiosco"]').value : null;
        // Si se registra como admin, asignarlo al quiosco seleccionado en el formulario
        if (rol === 'admin') {
            nuevoUsuario.kioscoId = selectedKiosk || 'don_domingo';
        } else if (selectedKiosk) {
            // Si el usuario es cliente, guardar su quiosco preferido (opcional)
            nuevoUsuario.preferredKiosk = selectedKiosk;
        }

        usuarios[carnet] = nuevoUsuario;
        guardarUsuarios(usuarios);
        
        alert('Registro exitoso. ¡Inicia sesión!');
        contenedor.classList.remove('active'); 
    });
}

/**
 * Función que inicializa la lógica de Login/Registro, la sesión y la carga de productos/kioscos.
 */
function inicializarIndexGlobal() {
    // Asegurar que haya un admin por defecto antes de verificar sesión
    asegurarAdminPorDefecto();
    verificarSesion(); 
    verificarAperturaForzada();

    // Lógica para la página principal (index.html)
    if (document.querySelector('.quioscos-contenedor') && typeof renderizarKioscos === 'function') {
        renderizarKioscos();
    }
    
    // Lógica para la página de productos (productos.html)
    if (document.querySelector('.productos-global-contenedor') && typeof renderizarCatalogoGlobal === 'function') {
        renderizarCatalogoGlobal();
    }
    
    // Lógica para la página del menú del quiosco (menu_kiosco.html)
    if (document.querySelector('.seccion-menu') && typeof inicializarMenuKiosco === 'function') {
        inicializarMenuKiosco(); 
    }
    
    // Lógica global del carrito (siempre intenta actualizar el contador)
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito(); 
    }
}

// ----------------------------------------------------------------------------------
// Llama a la función principal al cargar la página (Centraliza el inicio de todos los JS)
// ----------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', inicializarIndexGlobal);