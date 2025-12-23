const notaInput = document.getElementById("nota");
const galeria = document.getElementById("galeria");
const fechaTexto = document.getElementById("fecha");
const gridMeses = document.getElementById("grid-meses");
const vistaMeses = document.getElementById("vista-meses");
const vistaDiario = document.getElementById("vista-diario");

const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
let fechaActual = new Date();
let archivoPendiente = null;

// 1. Generar las carpetas de meses en el inicio
function renderizarMeses() {
  gridMeses.innerHTML = "";
  meses.forEach((mes, index) => {
    const carpeta = document.createElement("div");
    carpeta.className = "carpeta";
    carpeta.innerHTML = `<div class="icono-carpeta"></div><span class="nombre-mes">${mes}</span>`;
    carpeta.onclick = () => abrirMes(index);
    gridMeses.appendChild(carpeta);
  });
}

// 2. Navegación entre vistas
function abrirMes(mesIndex) {
  fechaActual.setMonth(mesIndex);
  vistaMeses.style.display = "none";
  vistaDiario.style.display = "block";
  actualizarPantalla();
}

function mostrarHome() {
  vistaMeses.style.display = "block";
  vistaDiario.style.display = "none";
}

function actualizarPantalla() {
  const nombreMes = meses[fechaActual.getMonth()];
  fechaTexto.textContent = "Álbum de " + nombreMes;
  mostrarFotos(nombreMes);
}

// 3. Procesamiento de fotos (Automático vs Manual)
document.getElementById("foto-camara").addEventListener("change", e => {
  procesarFoto(e.target.files[0], meses[new Date().getMonth()]); // Mes actual real
});

document.getElementById("foto-archivo").addEventListener("change", e => {
  archivoPendiente = e.target.files[0];
  if (archivoPendiente) document.getElementById("modal-selector").style.display = "flex";
});

function seleccionarMesManual(index) {
  procesarFoto(archivoPendiente, meses[index]);
  cerrarSelector();
}

function procesarFoto(file, nombreMes) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let fotos = JSON.parse(localStorage.getItem("fotos_mes_" + nombreMes) || "[]");
    fotos.push(reader.result);
    localStorage.setItem("fotos_mes_" + nombreMes, JSON.stringify(fotos));
    alert(`Guardado en ${nombreMes}`);
    actualizarPantalla();
  };
  reader.readAsDataURL(file);
}

function mostrarFotos(nombreMes) {
  galeria.innerHTML = "";
  const fotos = JSON.parse(localStorage.getItem("fotos_mes_" + nombreMes) || "[]");
  
  fotos.forEach((src, index) => {
    const contenedor = document.createElement("div");
    contenedor.className = "foto-contenedor";

    const img = document.createElement("img");
    img.src = src;
    
    // Clic normal: Ver en pantalla completa
    img.onclick = () => {
        document.getElementById("fotoGrande").src = src;
        document.getElementById("modalFoto").style.display = "flex";
    };

    // Clic mantenido: Borrar foto
    let timer;
    img.onmousedown = () => timer = setTimeout(() => confirmarBorrado(index, nombreMes), 800);
    img.onmouseup = () => clearTimeout(timer);
    img.ontouchstart = () => timer = setTimeout(() => confirmarBorrado(index, nombreMes), 800);
    img.ontouchend = () => clearTimeout(timer);

    contenedor.appendChild(img);
    galeria.appendChild(contenedor);
  });
}

// Nueva función para borrar la foto
function confirmarBorrado(index, nombreMes) {
  if (confirm("¿Quieres eliminar esta foto de tus recuerdos?")) {
    let fotos = JSON.parse(localStorage.getItem("fotos_mes_" + nombreMes) || "[]");
    fotos.splice(index, 1); // Quita la foto del array
    localStorage.setItem("fotos_mes_" + nombreMes, JSON.stringify(fotos));
    actualizarPantalla(); // Refresca la galería
  }
}

function cerrarSelector() {
  document.getElementById("modal-selector").style.display = "none";
  archivoPendiente = null;
}

renderizarMeses();

