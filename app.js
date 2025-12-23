const galeria = document.getElementById("galeria");
const fechaTexto = document.getElementById("fecha");
const gridMeses = document.getElementById("grid-meses");
const vistaMeses = document.getElementById("vista-meses");
const vistaDiario = document.getElementById("vista-diario");

const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
let archivoPendiente = null;

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

function abrirMes(index) {
  const nombreMes = meses[index];
  vistaMeses.style.display = "none";
  vistaDiario.style.display = "block";
  fechaTexto.textContent = "Álbum de " + nombreMes;
  mostrarFotos(nombreMes);
}

function mostrarHome() {
  vistaMeses.style.display = "block";
  vistaDiario.style.display = "none";
}

document.getElementById("foto-camara").addEventListener("change", e => {
  const mesActual = meses[new Date().getMonth()];
  procesarFoto(e.target.files[0], mesActual);
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
    alert(`Foto guardada en ${nombreMes}`);
    if (vistaDiario.style.display === "block") mostrarFotos(nombreMes);
  };
  reader.readAsDataURL(file);
}

function mostrarFotos(nombreMes) {
  galeria.innerHTML = "";
  const fotos = JSON.parse(localStorage.getItem("fotos_mes_" + nombreMes) || "[]");
  fotos.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    
    // Ver grande
    img.onclick = () => {
      document.getElementById("fotoGrande").src = src;
      document.getElementById("modalFoto").style.display = "flex";
    };

    // Borrar con pulsación larga
    let timer;
    const iniciar = () => timer = setTimeout(() => {
        if(confirm("¿Eliminar foto?")) {
            fotos.splice(index, 1);
            localStorage.setItem("fotos_mes_" + nombreMes, JSON.stringify(fotos));
            mostrarFotos(nombreMes);
        }
    }, 800);
    img.ontouchstart = iniciar;
    img.onmousedown = iniciar;
    img.ontouchend = () => clearTimeout(timer);
    img.onmouseup = () => clearTimeout(timer);

    galeria.appendChild(img);
  });
}

function cerrarSelector() {
  document.getElementById("modal-selector").style.display = "none";
  archivoPendiente = null;
}

renderizarMeses();
