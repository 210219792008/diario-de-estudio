// ============================================
// Diario de Estudio - Lógica
// ============================================

//clave bajo la que guardamos todo en localStorage
const CLAVE_SESIONES = "sesiones-de-diario-de-estudio";

// ---------- Referencias a los elementos de la página ----------

const formulario = document.getElementById("formulario");
const campoFecha = document.getElementById("fecha");
const campoTema = document.getElementById("tema");
const campoMinutos = document.getElementById("minutos");
const listaSesiones = document.getElementById("lista-sesiones");
const mensajeVacio = document.getElementById("mensaje-vacio");
const numeroRacha = document.getElementById("numero-racha");
const textoRacha = document.getElementById("texto-racha");

// ---------- Utilidades ----------

// Lee las sesiones guardadas. Si no hay nada, devuelve una lista vacía.
function leerSesiones() {
  const guardado = localStorage.getItem(CLAVE_SESIONES);
  return guardado ? JSON.parse(guardado) : [];
}

// Guarda la lista completa de sesiones en localStorage.
function guardarSesiones(sesiones) {
  localStorage.setItem(CLAVE_SESIONES, JSON.stringify(sesiones));
}

// Convierte un objeto Date en formato "2026-11-02" (el que usa input date).
// Lo construimos a mano con getFullYear, getMonth y getDate porque esos
// usan tu zona horaria local. toISOString usaría UTC y podría dar otro día.
function aFormatoFecha(dia) {
  const año = dia.getFullYear();
  const mes = String(dia.getMonth() + 1).padStart(2, "0"); // padStart: 3 -> "03"
  const diaDelMes = String(dia.getDate()).padStart(2, "0");
  return `${año}-${mes}-${diaDelMes}`;
}

// Devuelve la fecha de hoy.
function fechaDeHoy() {
  return aFormatoFecha(new Date());
}

// Convierte "2026-11-02" en "2 nov 2026" para mostrarlo bonito.
// Añadimos "T00:00:00" para que la fecha se lea como hora local y no cambie de día.
function formatearFecha(fecha) {
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Calcula la racha: cuántos días seguidos (contando desde hoy o ayer) hay con sesiones.
function calcularRacha(sesiones) {
  // Juntamos todas las fechas distintas en un conjunto (Set).
  // El Set evita fechas repetidas automáticamente.
  const fechas = new Set(sesiones.map((sesion) => sesion.fecha));

  // Contamos hacia atrás día a día.
  // Si hoy no hay sesión, aún puede haber racha si la hay empezando ayer.
  let racha = 0;
  let dia = new Date();

  if (!fechas.has(fechaDeHoy())) {
    dia.setDate(dia.getDate() - 1); // empezamos a contar desde ayer
  }

  while (fechas.has(aFormatoFecha(dia))) {
    racha = racha + 1;
    dia.setDate(dia.getDate() - 1); // pasamos al día anterior
  }

  return racha;
}

// ---------- Pintar en la pantalla ----------

// Borra la lista y la vuelve a crear con las sesiones actuales,
// ordenadas de la más reciente a la más antigua.
function pintarLista() {
  const sesiones = leerSesiones();
  listaSesiones.innerHTML = ""; // limpiamos lo que había

  // El mensaje de "no hay sesiones" solo se ve si la lista está vacía.
  mensajeVacio.hidden = sesiones.length > 0;

  // Ordenamos por fecha, descendente. "b.localeCompare(a)" compara textos de fecha.
  const ordenadas = [...sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha));

  for (const sesion of ordenadas) {
    const item = document.createElement("li");

    // Montamos la fila creando elementos.
    // Con textContent (y no innerHTML) el tema se ve siempre bien,
    // aunque el usuario escriba textos raros.
    const detalles = document.createElement("div");
    detalles.className = "sesion-detalles";

    const tema = document.createElement("strong");
    tema.textContent = sesion.tema; // textContent = seguro con cualquier texto

    const fecha = document.createElement("small");
    fecha.textContent = formatearFecha(sesion.fecha);

    const minutos = document.createElement("span");
    minutos.className = "sesion-minutos";
    minutos.textContent = `${sesion.minutos} min`;

    const botonBorrar = document.createElement("button");
    botonBorrar.className = "borrar";
    botonBorrar.textContent = "🗑️";
    botonBorrar.title = "Borrar sesión";
    // Con data-fecha sabemos cuál borrar sin depender del orden del array.
    botonBorrar.dataset.fecha = sesion.fecha;
    botonBorrar.dataset.tema = sesion.tema;

    detalles.append(tema, fecha);
    item.append(detalles, minutos, botonBorrar);
    listaSesiones.append(item);
  }
}

// Actualiza el número de la racha y su texto.
function pintarRacha() {
  const racha = calcularRacha(leerSesiones());
  numeroRacha.textContent = racha;

  if (racha === 0) {
    textoRacha.textContent = "Empieza tu racha hoy 💪";
  } else if (racha === 1) {
    textoRacha.textContent = "día seguido";
  } else {
    textoRacha.textContent = "días seguidos";
  }
}

// Vuelve a pintar todo lo que depende de los datos.
function pintarTodo() {
  pintarLista();
  pintarRacha();
}

// ---------- Eventos ----------

// Al enviar el formulario: validamos, guardamos y refrescamos la pantalla.
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que la página se recargue

  const fecha = campoFecha.value;
  const tema = campoTema.value.trim(); // trim quita espacios de los bordes
  const minutos = Number(campoMinutos.value);

  // Limpiamos errores anteriores por si el usuario falló antes.
  campoTema.classList.remove("error");
  campoMinutos.classList.remove("error");

  // Validación: tema no vacío.
  if (tema === "") {
    campoTema.classList.add("error");
    campoTema.focus();
    return; // salimos sin guardar
  }

  // Validación: minutos debe ser un número mayor que 0.
  if (!Number.isFinite(minutos) || minutos <= 0) {
    campoMinutos.classList.add("error");
    campoMinutos.focus();
    return;
  }

  // Guardamos la nueva sesión junto a las que ya había.
  const sesiones = leerSesiones();
  sesiones.push({ fecha, tema, minutos });
  guardarSesiones(sesiones);

  // Reseteamos el formulario y dejamos la fecha de hoy lista para la próxima.
  formulario.reset();
  campoFecha.value = fechaDeHoy();

  pintarTodo();
});

// Al pulsar una X, borramos esa sesión concreta.
listaSesiones.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".borrar");
  if (!boton) return; // el clic no fue en un botón de borrar

  const sesiones = leerSesiones();

  // Buscamos la sesión que coincide con fecha y tema del botón pulsado.
  const indice = sesiones.findIndex(
    (sesion) => sesion.fecha === boton.dataset.fecha && sesion.tema === boton.dataset.tema
  );

  if (indice !== -1) {
    sesiones.splice(indice, 1); // quitamos 1 elemento en esa posición
    guardarSesiones(sesiones);
    pintarTodo();
  }
});

// ---------- Arranque ----------

campoFecha.value = fechaDeHoy(); // fecha por defecto: hoy
pintarTodo();
