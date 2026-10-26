import { Drawer } from "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js";


const soles = (monto) => `S/ ${monto.toFixed(2)}`;

const sumar = (...numeros) => numeros.reduce((a, n) => a + n, 0);

const aplicarDescuento = (total, porcentaje = 10) => total - (total * porcentaje) / 100;

const normalizar = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function contarUnidades(lista) {
  if (lista.length === 0) return 0;
  const [primero, ...resto] = lista;
  return primero.cantidad + contarUnidades(resto);
}

function crearCarrito(itemsIniciales = []) {
  let items = itemsIniciales;
  return {
    agregar(producto, cantidad = 1) {
      const existente = items.find((it) => it.id === producto.id);
      if (existente) existente.cantidad += cantidad;
      else items.push({ id: producto.id, nombre: producto.nombre, emoji: producto.emoji, precio: producto.precio, cantidad });
    },
    cambiar(id, delta) {
      items = items
        .map((it) => (it.id === id ? { ...it, cantidad: it.cantidad + delta } : it))
        .filter((it) => it.cantidad > 0);
    },
    quitar(id) { items = items.filter((it) => it.id !== id); },
    vaciar() { items = []; },
    lista: () => items.map((it) => ({ ...it })),
    subtotal: () => sumar(...items.map((it) => it.precio * it.cantidad)),
    unidades: () => contarUnidades(items),
  };
}


const productos = [
  { id: "t1", categoria: "Tortas",   nombre: "Torta de chocolate trufado", precio: 85, emoji: "🍫", etiqueta: "Más pedida", descripcion: "Bizcocho húmedo, ganache de cacao y viruta de chocolate. 12 porciones." },
  { id: "t2", categoria: "Tortas",   nombre: "Tres leches",               precio: 70, emoji: "🥛", etiqueta: "Clásica",   descripcion: "Esponjosa, bañada en tres leches y coronada con merengue suave." },
  { id: "t3", categoria: "Tortas",   nombre: "Torta de lúcuma",           precio: 78, emoji: "🧡", etiqueta: "Peruana",   descripcion: "Crema de lúcuma sobre bizcocho de vainilla y manjar blanco." },
  { id: "t4", categoria: "Tortas",   nombre: "Cheesecake de maracuyá",    precio: 65, emoji: "💛", etiqueta: "Fresca",    descripcion: "Base de galleta, queso cremoso y cobertura ácida de maracuyá." },
  { id: "p1", categoria: "Postres",  nombre: "Tiramisú en vaso",          precio: 14, emoji: "☕", etiqueta: "Individual", descripcion: "Café, mascarpone y cacao. Listo para llevar." },
  { id: "p2", categoria: "Postres",  nombre: "Alfajores de maicena",      precio: 18, emoji: "🍪", etiqueta: "Caja x6",   descripcion: "Se deshacen en la boca, rellenos de manjar blanco y coco." },
  { id: "p3", categoria: "Postres",  nombre: "Tartaleta de fresa",        precio: 11, emoji: "🍓", etiqueta: "Individual", descripcion: "Masa crocante, crema pastelera y fresas frescas." },
  { id: "g1", categoria: "Galletas", nombre: "Galletas de avena y pasas", precio: 16, emoji: "🌾", etiqueta: "Bolsa x6",  descripcion: "Con canela y mantequilla. Suaves por dentro." },
  { id: "g2", categoria: "Galletas", nombre: "Cookies de chocolate",      precio: 15, emoji: "🍪", etiqueta: "Bolsa x4",  descripcion: "Grandes, con trozos de chocolate semiamargo." },
  { id: "s1", categoria: "Salados",  nombre: "Empanada de carne",         precio: 7,  emoji: "🥟", etiqueta: "Horneada",  descripcion: "Carne picada, aceituna, huevo y pasas." },
  { id: "s2", categoria: "Salados",  nombre: "Empanada de pollo",         precio: 7,  emoji: "🥟", etiqueta: "Horneada",  descripcion: "Pollo deshilachado y ají amarillo suave." },
  { id: "s3", categoria: "Salados",  nombre: "Pan con chicharrón",        precio: 10, emoji: "🥖", etiqueta: "Del día",   descripcion: "Pan francés, chicharrón, camote frito y salsa criolla." },
  { id: "s4", categoria: "Salados",  nombre: "Tequeños",                  precio: 14, emoji: "🧀", etiqueta: "Caja x6",   descripcion: "Queso fundido en masa fina y crujiente." },
];
const categorias = ["Todo", ...new Set(productos.map((p) => p.categoria))];
const UMBRAL_DESCUENTO = 100;


const CLAVE = "delicia-carrito";
const leerGuardado = () => {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(datos) ? datos : [];
  } catch { return []; }
};
const guardar = () => {
  try { localStorage.setItem(CLAVE, JSON.stringify(carrito.lista())); } catch { /* sin almacenamiento */ }
};

const carrito = crearCarrito(leerGuardado());
let categoriaActiva = "Todo";
let busqueda = "";


const $ = (selector) => document.querySelector(selector);
const drawerCarrito = Drawer.getOrCreateInstance($("#carrito"));


const tarjetaProducto = (p) => `
  <article class="card card-producto">
    <div class="foto" data-cat="${p.categoria}" aria-hidden="true">
      <span class="badge theme-primary">${p.etiqueta}</span>${p.emoji}
    </div>
    <div class="card-body">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <div class="card-pie">
        <span class="precio">${soles(p.precio)}</span>
        <button class="btn btn-solid theme-primary" type="button" data-agregar="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;

function pintarFiltros() {
  $("#filtros").innerHTML = categorias
    .map((c) => `<li class="nav-item"><button type="button" class="nav-link${c === categoriaActiva ? " active" : ""}" data-filtro="${c}">${c}</button></li>`)
    .join("");
}

function pintarCatalogo() {
  const q = normalizar(busqueda.trim());
  const visibles = productos.filter((p) =>
    (categoriaActiva === "Todo" || p.categoria === categoriaActiva) &&
    (q === "" || normalizar(`${p.nombre} ${p.descripcion}`).includes(q))
  );
  $("#catalogoGrid").innerHTML = visibles.map(tarjetaProducto).join("");
  $("#sinResultados").hidden = visibles.length > 0;
}


function pintarCarrito() {
  const lista = carrito.lista();
  const subtotal = carrito.subtotal();
  const hayDescuento = subtotal > UMBRAL_DESCUENTO;
  const total = hayDescuento ? aplicarDescuento(subtotal) : subtotal;

  $("#contador").textContent = carrito.unidades();
  $("#carritoVacio").hidden = lista.length > 0;
  $("#carritoResumen").hidden = lista.length === 0;
  $("#carritoBotones").hidden = lista.length === 0;

  $("#carritoLista").innerHTML = lista.map((it) => `
    <li class="list-group-item">
      <div class="fila">
        <span class="emoji" aria-hidden="true">${it.emoji}</span>
        <div class="info"><strong>${it.nombre}</strong><small>${soles(it.precio)} c/u</small></div>
        <div class="cantidad">
          <button type="button" data-menos="${it.id}" aria-label="Quitar uno">−</button>
          <span>${it.cantidad}</span>
          <button type="button" data-mas="${it.id}" aria-label="Agregar uno">+</button>
        </div>
      </div>
    </li>`).join("");

  $("#rSubtotal").textContent = soles(subtotal);
  $("#rDescuentoFila").hidden = !hayDescuento;
  $("#rDescuento").textContent = `− ${soles(subtotal - total)}`;
  $("#rTotal").textContent = soles(total);
  guardar();
}

let temporizador;
function avisar(mensaje) {
  const aviso = $("#aviso");
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  clearTimeout(temporizador);
  temporizador = setTimeout(() => aviso.classList.remove("visible"), 2200);
}


document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-agregar],[data-mas],[data-menos],[data-filtro]");
  if (!el) return;

  if (el.dataset.agregar) {
    const producto = productos.find((p) => p.id === el.dataset.agregar);
    carrito.agregar(producto);
    pintarCarrito();
    avisar(`${producto.nombre} agregado al carrito`);
  } else if (el.dataset.mas) {
    carrito.cambiar(el.dataset.mas, 1);
    pintarCarrito();
  } else if (el.dataset.menos) {
    carrito.cambiar(el.dataset.menos, -1);
    pintarCarrito();
  } else if (el.dataset.filtro) {
    categoriaActiva = el.dataset.filtro;
    pintarFiltros();
    pintarCatalogo();
  }
});

$("#buscador").addEventListener("input", (e) => {
  busqueda = e.target.value;
  pintarCatalogo();
});

$("#btnCarrito").addEventListener("click", () => drawerCarrito.show());

$("#btnVaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
});

$("#btnFinalizar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
  drawerCarrito.hide();
  avisar("¡Gracias! Te escribiremos para confirmar tu pedido.");
});


const PRECIO_PORCION = 5.5;
const estimarTorta = () =>
  Number($("#pPorciones").value) * PRECIO_PORCION + Number($("#pSabor").value);

const actualizarEstimado = () => { $("#pEstimado").textContent = soles(estimarTorta()); };
["#pPorciones", "#pSabor"].forEach((s) => $(s).addEventListener("change", actualizarEstimado));

const minimo = new Date();
minimo.setDate(minimo.getDate() + 2);
$("#pFecha").min = minimo.toISOString().slice(0, 10);

$("#formPedido").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = $("#pNombre").value.trim();
  const fecha = $("#pFecha").value;
  const alerta = $("#pAlerta");

  if (!nombre || !fecha || fecha < $("#pFecha").min) {
    alerta.textContent = "Escribe tu nombre y elige una fecha de entrega con al menos 2 días de anticipación.";
    alerta.hidden = false;
    return;
  }

  const porciones = $("#pPorciones").value;
  const sabor = $("#pSabor").selectedOptions[0].textContent;
  const mensaje = $("#pMensaje").value.trim();
  const precio = estimarTorta();

  carrito.agregar({
    id: `custom-${Date.now()}`,
    nombre: `Torta a medida · ${sabor} (${porciones} porc.)`,
    emoji: "🎂",
    precio,
  });
  pintarCarrito();

  alerta.textContent = `Listo, ${nombre}: torta de ${sabor.toLowerCase()} para ${porciones} porciones, entrega el ${fecha}` +
    `${mensaje ? ` con el mensaje “${mensaje}”` : ""}. Total estimado: ${soles(precio)}. Ya está en tu carrito.`;
  alerta.hidden = false;
  e.target.reset();
  actualizarEstimado();
});


pintarFiltros();
pintarCatalogo();
pintarCarrito();
actualizarEstimado();
