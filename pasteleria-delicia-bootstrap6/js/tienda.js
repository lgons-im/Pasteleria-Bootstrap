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
      else items.push({ id: producto.id, nombre: producto.nombre, arte: producto.arte, precio: producto.precio, cantidad });
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

const svg = (contenido) =>
  `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" focusable="false">
     <ellipse cx="60" cy="82" rx="42" ry="5" fill="#3a1626" opacity=".10"/>${contenido}</svg>`;

const torta = (cuerpo, crema, adorno) => svg(`
  <rect x="20" y="42" width="80" height="38" rx="7" fill="${cuerpo}"/>
  <rect x="20" y="57" width="80" height="6" fill="${crema}"/>
  <path d="M18 46 q0-15 15-15 h54 q15 0 15 15 q-7 7-13 0 q-6 7-12 0 q-6 7-12 0 q-6 7-12 0 q-6 7-12 0 q-6 7-11 0z" fill="${crema}"/>
  <circle cx="60" cy="25" r="6" fill="${adorno}"/>
  <path d="M60 19 q4-8 9-9" stroke="#4d7a3a" stroke-width="2" fill="none" stroke-linecap="round"/>`);

const tramo = (y1, y2, color) => {
  const x = (y) => 34 + ((y - 20) * 6) / 56;
  return `<path d="M${x(y1)} ${y1} H${120 - x(y1)} L${120 - x(y2)} ${y2} H${x(y2)}z" fill="${color}"/>`;
};
const vaso = (capas) => svg(
  capas.map((c, i) => tramo(26 + i * 12, 38 + i * 12, c)).join("") +
  `<path d="M34 20 H86 L80 76 H40z" fill="none" stroke="#b9a3ab" stroke-width="3" stroke-linejoin="round"/>
   <path d="M40 76 H80" stroke="#b9a3ab" stroke-width="3" stroke-linecap="round"/>`);

const galleta = (masa, chips) => svg(`
  <circle cx="60" cy="48" r="32" fill="${masa}"/>
  <circle cx="60" cy="48" r="32" fill="none" stroke="#00000014" stroke-width="3"/>
  ${[[48, 38], [70, 40], [56, 56], [74, 58], [44, 54], [62, 30]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3.5" fill="${chips}"/>`).join("")}`);

const arteLista = {
  tortaChoco: () => torta("#6b3a28", "#4a2418", "#c0283f"),
  tresLeches: () => torta("#f6e6c4", "#fffaf0", "#e0587a"),
  tortaLucuma: () => torta("#f0b45a", "#f7d58e", "#b8325a"),
  tortaMedida: () => torta("#f6c9d4", "#fff", "#b8325a"),
  cheesecake: () => svg(`
    <path d="M22 54 L60 26 L98 54 V72 a6 6 0 0 1-6 6 H28 a6 6 0 0 1-6-6z" fill="#f4dfb0"/>
    <path d="M22 54 L60 26 L98 54z" fill="#f7e9c5"/>
    <path d="M30 54 q6 14 12 0 q6 14 12 0 q6 14 12 0 q6 14 12 0 q6 14 12 0 L92 50 L60 30 L28 50z" fill="#f5b800"/>
    <rect x="22" y="70" width="76" height="8" rx="3" fill="#a9763c"/>`),
  tiramisu: () => vaso(["#fff4e0", "#7a4a2a", "#fff4e0", "#7a4a2a"]),
  alfajores: () => svg(`
    <ellipse cx="60" cy="64" rx="34" ry="12" fill="#e7bd7a"/>
    <rect x="26" y="52" width="68" height="12" fill="#e7bd7a"/>
    <rect x="26" y="46" width="68" height="8" fill="#9b5a2c"/>
    <ellipse cx="60" cy="46" rx="34" ry="12" fill="#e7bd7a"/>
    <ellipse cx="60" cy="42" rx="34" ry="12" fill="#f1d29a"/>
    <ellipse cx="60" cy="42" rx="24" ry="7" fill="#fff" opacity=".85"/>`),
  tartaleta: () => svg(`
    <path d="M26 44 H94 L86 74 H34z" fill="#d9a05b"/>
    <path d="M30 56 H90 M32 66 H88" stroke="#b9803f" stroke-width="2"/>
    <ellipse cx="60" cy="44" rx="34" ry="9" fill="#fff0c9"/>
    ${[[44, 40], [58, 36], [72, 40], [51, 46], [66, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#d1264a"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.4" fill="#fff" opacity=".7"/>`).join("")}`),
  avena: () => galleta("#d9a867", "#6b3b5e"),
  cookies: () => galleta("#c98a4b", "#3a1c12"),
  empanadaCarne: () => svg(`
    <path d="M18 62 A42 42 0 0 1 102 62z" fill="#e3a14d"/>
    <path d="M18 62 A42 42 0 0 1 102 62" fill="none" stroke="#b9772a" stroke-width="5" stroke-dasharray="3 5" stroke-linecap="round"/>
    <path d="M32 54 A30 30 0 0 1 60 36" fill="none" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/>
    <rect x="18" y="62" width="84" height="6" rx="3" fill="#c9852f"/>`),
  empanadaPollo: () => svg(`
    <path d="M18 62 A42 42 0 0 1 102 62z" fill="#f0c36a"/>
    <path d="M18 62 A42 42 0 0 1 102 62" fill="none" stroke="#c99a38" stroke-width="5" stroke-dasharray="3 5" stroke-linecap="round"/>
    <path d="M32 54 A30 30 0 0 1 60 36" fill="none" stroke="#fff" stroke-width="4" opacity=".4" stroke-linecap="round"/>
    <rect x="18" y="62" width="84" height="6" rx="3" fill="#d9ab4a"/>`),
  panChicharron: () => svg(`
    <rect x="14" y="38" width="92" height="32" rx="16" fill="#dba35c"/>
    <path d="M24 56 H96" stroke="#7a4a2a" stroke-width="7" stroke-linecap="round"/>
    <path d="M28 52 q8-6 14 0 q8-6 14 0 q8-6 14 0 q8-6 12 0" stroke="#c0382b" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M36 44 l6 8 M56 42 l6 8 M76 44 l6 8" stroke="#f2cf91" stroke-width="3" stroke-linecap="round"/>`),
  tequenos: () => svg(
    [[28, -8], [60, 0], [92, 8]].map(([x, r]) => `<g transform="rotate(${r} ${x} 46)"><rect x="${x - 9}" y="20" width="18" height="56" rx="9" fill="#e6b45f"/><rect x="${x - 3}" y="26" width="3" height="40" rx="1.5" fill="#fff" opacity=".4"/><ellipse cx="${x}" cy="22" rx="6" ry="3" fill="#f6d27a"/></g>`).join("")),
};
const ilustrar = (clave) => (arteLista[clave] || arteLista.tortaMedida)();

const productos = [
  { id: "t1", categoria: "Tortas", nombre: "Torta de chocolate trufado", precio: 85, arte: "tortaChoco", etiqueta: "Más pedida", descripcion: "Bizcocho húmedo, ganache de cacao y viruta de chocolate. 12 porciones." },
  { id: "t2", categoria: "Tortas", nombre: "Tres leches", precio: 70, arte: "tresLeches", etiqueta: "Clásica", descripcion: "Esponjosa, bañada en tres leches y coronada con merengue suave." },
  { id: "t3", categoria: "Tortas", nombre: "Torta de lúcuma", precio: 78, arte: "tortaLucuma", etiqueta: "Peruana", descripcion: "Crema de lúcuma sobre bizcocho de vainilla y manjar blanco." },
  { id: "t4", categoria: "Tortas", nombre: "Cheesecake de maracuyá", precio: 65, arte: "cheesecake", etiqueta: "Fresca", descripcion: "Base de galleta, queso cremoso y cobertura ácida de maracuyá." },
  { id: "p1", categoria: "Postres", nombre: "Tiramisú en vaso", precio: 14, arte: "tiramisu", etiqueta: "Individual", descripcion: "Café, mascarpone y cacao. Listo para llevar." },
  { id: "p2", categoria: "Postres", nombre: "Alfajores de maicena", precio: 18, arte: "alfajores", etiqueta: "Caja x6", descripcion: "Se deshacen en la boca, rellenos de manjar blanco y coco." },
  { id: "p3", categoria: "Postres", nombre: "Tartaleta de fresa", precio: 11, arte: "tartaleta", etiqueta: "Individual", descripcion: "Masa crocante, crema pastelera y fresas frescas." },
  { id: "g1", categoria: "Galletas", nombre: "Galletas de avena y pasas", precio: 16, arte: "avena", etiqueta: "Bolsa x6", descripcion: "Con canela y mantequilla. Suaves por dentro." },
  { id: "g2", categoria: "Galletas", nombre: "Cookies de chocolate", precio: 15, arte: "cookies", etiqueta: "Bolsa x4", descripcion: "Grandes, con trozos de chocolate semiamargo." },
  { id: "s1", categoria: "Salados", nombre: "Empanada de carne", precio: 7, arte: "empanadaCarne", etiqueta: "Horneada", descripcion: "Carne picada, aceituna, huevo y pasas." },
  { id: "s2", categoria: "Salados", nombre: "Empanada de pollo", precio: 7, arte: "empanadaPollo", etiqueta: "Horneada", descripcion: "Pollo deshilachado y ají amarillo suave." },
  { id: "s3", categoria: "Salados", nombre: "Pan con chicharrón", precio: 10, arte: "panChicharron", etiqueta: "Del día", descripcion: "Pan francés, chicharrón, camote frito y salsa criolla." },
  { id: "s4", categoria: "Salados", nombre: "Tequeños", precio: 14, arte: "tequenos", etiqueta: "Caja x6", descripcion: "Queso fundido en masa fina y crujiente." },
];
const fotos = {
  "Torta de chocolate trufado": "https://harald.com.br/wp-content/uploads/2024/08/torta-de-chocolate-trufado-scaled.jpg",
  "Tres leches": "https://www.modernhoney.com/wp-content/uploads/2024/10/Tres-Leches-Cake-18-scaled.jpg",
  "Torta de lúcuma": "https://dolcecapriccio.pe/wp-content/uploads/2025/09/Mesa-de-trabajo-2.jpg",
  "Cheesecake de maracuyá": "https://www.recetasnestle.cl/sites/default/files/srh_recipes/6a60d55d0a1ccf2f24b4cc6b961adb5f.jpg",
  "Tiramisú en vaso": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7udBBgbaiLSBps71PlCyazTgzpSr4l0tWvvT-jP4pioSjGN0RDwaKzdo&s=10",
  "Alfajores de maicena": "https://acomer.pe/wp-content/uploads/2017/06/alfajoresdemaicenaweb.jpg",
  "Tartaleta de fresa": "https://comedera.com/wp-content/uploads/sites/9/2023/02/Tartaleta-de-fresa-shutterstock_1084608647.jpg",
  "Galletas de avena y pasas": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdM6wKZLvHkc_UhQ96k9k2razbUdH9_zjrEZYss_bu_AWJl9ui8d23mgK_&s=10",
  "Cookies de chocolate": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFKnIgFTXJnwHqx6uJvj4TYKLAjDibMRDl-tcCE8z1JlPJrbf7m5gWO3A&s=10",
  "Empanada de carne": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZBUj8GfIBC6oosR2xN1DNEy-EdfEwb6EnYeJvmG8I_e5CbxtTqWP_6xCr&s=10",
  "Empanada de pollo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY8xM4WG_HXEiZP506_7w-mMr6MpQ4W3R1EtW7WfreOhlQwCNjLz5GE6Nt&s=10",
  "Pan con chicharrón": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVF6bWnanhbgroiJubfpLiEhEtVtK7oFPi3NkCu8kih08TNHUT8hAg4Q&s=10",
  "Tequeños": "https://static.bainet.es/clip/abac80ec-3631-4526-b559-f2e4970fb2a1_facebook-aspect-ratio_default_0.jpg",
};
const urlFoto = (p) => fotos[p.nombre] || "";
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
  try { localStorage.setItem(CLAVE, JSON.stringify(carrito.lista())); } catch { }
};

const carrito = crearCarrito(leerGuardado());
let categoriaActiva = "Todo";
let busqueda = "";

const $ = (selector) => document.querySelector(selector);
const drawerCarrito = Drawer.getOrCreateInstance($("#carrito"));

const tarjetaProducto = (p) => `
  <div class="col">
  <article class="card card-producto">
    <div class="foto" data-cat="${p.categoria}">
      <span class="badge theme-primary">${p.etiqueta}</span>${urlFoto(p) ? `<img src="${urlFoto(p)}" alt="${p.nombre}" data-arte="${p.arte}" loading="lazy">` : ilustrar(p.arte)}
    </div>
    <div class="card-body">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <div class="card-pie">
        <span class="precio">${soles(p.precio)}</span>
        <button class="btn btn-solid theme-primary" type="button" data-agregar="${p.id}">Agregar</button>
      </div>
    </div>
  </article>
  </div>`;

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
        <span class="miniatura" aria-hidden="true">${ilustrar(it.arte)}</span>
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
    arte: "tortaMedida",
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

document.addEventListener("error", (e) => {
  const img = e.target;
  if (img.tagName === "IMG" && img.dataset.arte) {
    img.outerHTML = ilustrar(img.dataset.arte);
  }
}, true);