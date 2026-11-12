// Claves con las que se guardan los datos en el navegador
const KEY_USERS = 'nike_usuarios';
const KEY_SESSION = 'nike_sesion';
const KEY_CARRITO = 'nike_carrito';
const KEY_PEDIDOS = 'nike_pedidos';

// Lee un valor guardado; si falla, devuelve el valor por defecto
const leer = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } };

// Leer y guardar la lista de usuarios, la sesión activa y el carrito
const getUsers = () => leer(KEY_USERS, []);
const saveUsers = (u) => localStorage.setItem(KEY_USERS, JSON.stringify(u));
const getSession = () => leer(KEY_SESSION, null);
const getCarrito = () => leer(KEY_CARRITO, []);
const saveCarrito = (c) => { localStorage.setItem(KEY_CARRITO, JSON.stringify(c)); actualizarContador(); };

// Cifra la contraseña (SHA-256) para no guardarla tal cual
async function hash(texto) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Si el navegador no soporta cifrado, usa una codificación simple
  return btoa(unescape(encodeURIComponent(texto)));
}

// Muestra mensajes de error ("alert") o de éxito ("ok") en la página
function mostrar(tipo, mensajes) {
  const caja = document.getElementById('mensajes');
  if (!caja) return;
  caja.innerHTML = '';
  if (!mensajes.length) return;
  const div = document.createElement('div');
  div.className = tipo;
  div.setAttribute('role', tipo === 'alert' ? 'alert' : 'status');
  mensajes.forEach(m => { const p = document.createElement('p'); p.textContent = m; div.appendChild(p); });
  caja.appendChild(div);
}

// Escapa texto para insertarlo de forma segura en HTML
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Da formato de dinero: $1,299.00 MXN
const formato = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';

// Actualiza el número de productos que aparece junto a "Carrito"
function actualizarContador() {
  const el = document.getElementById('contador');
  if (el) el.textContent = getCarrito().reduce((t, i) => t + i.cantidad, 0);
}

// Cada página indica su nombre en data-page; el código solo actúa en la que corresponde
const pagina = document.body.dataset.page;

// Con sesión iniciada no se muestran el registro ni el inicio de sesión
if (getSession() && (pagina === 'login' || pagina === 'register')) location.href = 'index.html';

// Registro
if (pagina === 'register') {
  document.getElementById('form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const nombre = f.get('nombre').trim(), apellido = f.get('apellido').trim();
    const email = f.get('email').trim().toLowerCase();
    const pass = f.get('password'), pass2 = f.get('password2');
    // Validaciones de los campos
    const errores = [];
    if (!nombre || !apellido) errores.push('Escribe tu nombre y apellido.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.push('Escribe un correo válido.');
    if (pass.length < 8) errores.push('La contraseña debe tener al menos 8 caracteres.');
    if (pass !== pass2) errores.push('Las contraseñas no coinciden.');
    const usuarios = getUsers();
    if (!errores.length && usuarios.some(u => u.email === email)) errores.push('Ya existe una cuenta con ese correo. Inicia sesión.');
    if (errores.length) return mostrar('alert', errores);

    // Guarda el nuevo usuario y va al inicio de sesión
    usuarios.push({
      id: Date.now(), nombre, apellido, email,
      password_hash: await hash(pass),
      fecha_registro: new Date().toISOString()
    });
    saveUsers(usuarios);
    location.href = 'login.html?registro=ok';
  });
}

// Inicio de sesión
if (pagina === 'login') {
  const params = new URLSearchParams(location.search);
  // Si viene del carrito, regresa a él después de iniciar sesión
  const destino = params.get('next') === 'carrito.html' ? 'carrito.html' : 'index.html';
  // Aviso al venir del registro o del carrito
  if (params.get('registro') === 'ok') mostrar('ok', ['Cuenta creada. Ya puedes iniciar sesión.']);
  else if (params.get('next')) mostrar('ok', ['Inicia sesión para finalizar tu compra.']);
  document.getElementById('form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const email = f.get('email').trim().toLowerCase();
    const h = await hash(f.get('password'));
    // Busca un usuario con ese correo y esa contraseña
    const u = getUsers().find(x => x.email === email && x.password_hash === h);
    if (!u) return mostrar('alert', ['Correo o contraseña incorrectos.']);
    // Guarda la sesión y va a la página de destino
    localStorage.setItem(KEY_SESSION, JSON.stringify({ id: u.id, nombre: u.nombre }));
    location.href = destino;
  });
}

// Menú de cuenta: con sesión muestra el saludo y cerrar sesión; sin sesión, registro e inicio de sesión
const sesionEl = document.getElementById('sesion');
if (sesionEl) {
  const s = getSession();
  if (s) {
    const span = document.createElement('span');
    span.textContent = 'Hola, ' + s.nombre;
    const salir = document.createElement('a');
    salir.href = '#'; salir.textContent = 'Cerrar sesión';
    salir.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem(KEY_SESSION); location.reload(); });
    sesionEl.append(span, salir);
  } else {
    sesionEl.innerHTML = '<a href="login.html">Iniciar sesión</a><a href="register.html">Crear cuenta</a>';
  }
}
// Cierra el menú de cuenta al hacer clic fuera de él
document.addEventListener('click', (ev) => {
  document.querySelectorAll('.cuenta-menu[open]').forEach((d) => { if (!d.contains(ev.target)) d.removeAttribute('open'); });
});
actualizarContador();

// Fotos de los productos: pone la imagen indicada en imagenes.js sobre el bloque de color
const fotoDe = (nombre) => (typeof IMAGENES !== 'undefined' && (IMAGENES[nombre] || '').trim()) || '';
document.querySelectorAll('.card').forEach((card) => {
  const nombre = card.querySelector('h3').textContent;
  const url = fotoDe(nombre);
  if (!url) return;
  const img = document.createElement('img');
  img.src = url;
  img.alt = nombre;
  img.loading = 'lazy';
  // Si la imagen no carga, se quita y se ve el bloque de color
  img.addEventListener('error', () => img.remove());
  card.querySelector('.card-img').appendChild(img);
});

// Botones "Agregar al carrito" de las tarjetas de producto
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.btn-add[data-id]');
  if (!btn) return;
  const carrito = getCarrito();
  const item = carrito.find(i => i.id === btn.dataset.id);
  if (item) item.cantidad = Math.min(item.cantidad + 1, 10);
  else carrito.push({ id: btn.dataset.id, nombre: btn.dataset.nombre, linea: btn.dataset.linea, precio: Number(btn.dataset.precio), cantidad: 1 });
  saveCarrito(carrito);
  // Avisa unos instantes que el producto se agregó
  const texto = btn.textContent;
  btn.textContent = 'Agregado';
  setTimeout(() => { btn.textContent = texto; }, 1200);
});

// Página del carrito
if (pagina === 'carrito') {
  const cont = document.getElementById('carrito');

  // Dibuja la lista de productos y el resumen con el total
  const dibujar = () => {
    const items = getCarrito();
    if (!items.length) {
      cont.innerHTML = '<div class="vacio"><p>Tu carrito está vacío.</p><a class="btn" href="calzado.html">Ver productos</a></div>';
      return;
    }
    const total = items.reduce((t, i) => t + i.precio * i.cantidad, 0);
    const filas = items.map(i => {
      const foto = fotoDe(i.nombre);
      return `<li class="item">
        <div class="item-img tono-${i.nombre.length % 6 + 1}">${foto ? `<img src="${esc(foto)}" alt="${esc(i.nombre)}" onerror="this.remove()">` : ''}</div>
        <div>
          <h3>${esc(i.nombre)}</h3>
          <p class="linea">${esc(i.linea)} &middot; ${formato(i.precio)}</p>
          <div class="cantidad">
            <button type="button" data-accion="menos" data-id="${esc(i.id)}" aria-label="Quitar una pieza">&minus;</button>
            <span>${i.cantidad}</span>
            <button type="button" data-accion="mas" data-id="${esc(i.id)}" aria-label="Agregar una pieza">+</button>
          </div>
        </div>
        <div class="item-precio">${formato(i.precio * i.cantidad)}
          <br><button type="button" class="quitar" data-accion="quitar" data-id="${esc(i.id)}">Quitar</button>
        </div>
      </li>`;
    }).join('');
    cont.innerHTML = `<div class="carrito">
      <ul class="lista-carrito">${filas}</ul>
      <aside class="resumen">
        <h2>Resumen</h2>
        <div class="total"><span>Total</span><span>${formato(total)}</span></div>
        <button type="button" class="btn-add" data-accion="finalizar">Finalizar compra</button>
        <button type="button" class="btn-add btn-sec" data-accion="vaciar">Vaciar carrito</button>
      </aside>
    </div>`;
  };

  // Registra el pedido (requiere sesión) y vacía el carrito
  const finalizar = () => {
    const s = getSession();
    if (!s) { location.href = 'login.html?next=carrito.html'; return; }
    const carrito = getCarrito();
    if (!carrito.length) return;
    const total = carrito.reduce((t, i) => t + i.precio * i.cantidad, 0);
    const pedidos = leer(KEY_PEDIDOS, []);
    const folio = pedidos.length + 1;
    pedidos.push({ folio, usuario_id: s.id, fecha: new Date().toISOString(), items: carrito, total });
    localStorage.setItem(KEY_PEDIDOS, JSON.stringify(pedidos));
    saveCarrito([]);
    mostrar('ok', ['Compra realizada. Folio #' + folio + ' por ' + formato(total) + '.']);
    dibujar();
  };

  // Botones del carrito: más, menos, quitar, vaciar y finalizar
  cont.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-accion]');
    if (!b) return;
    const accion = b.dataset.accion;
    if (accion === 'finalizar') return finalizar();
    let carrito = getCarrito();
    const item = carrito.find(i => i.id === b.dataset.id);
    if (accion === 'mas' && item) item.cantidad = Math.min(item.cantidad + 1, 10);
    if (accion === 'menos' && item) item.cantidad -= 1;
    if (accion === 'quitar') carrito = carrito.filter(i => i.id !== b.dataset.id);
    if (accion === 'vaciar') carrito = [];
    saveCarrito(carrito.filter(i => i.cantidad > 0));
    mostrar('ok', []);
    dibujar();
  });

  dibujar();
}
