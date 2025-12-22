const notaInput = document.getElementById("nota");
const galeria = document.getElementById("galeria");
const fechaTexto = document.getElementById("fecha");

const hoy = new Date();
const fecha = hoy.toISOString().split("T")[0];
fechaTexto.textContent = hoy.toLocaleDateString("es-ES", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

notaInput.value = localStorage.getItem(fecha + "_nota") || "";

function guardarNota() {
  localStorage.setItem(fecha + "_nota", notaInput.value);
  alert("Nota guardada 💚");
}

document.getElementById("foto").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    let fotos = JSON.parse(localStorage.getItem(fecha + "_fotos") || "[]");
    fotos.push(reader.result);
    localStorage.setItem(fecha + "_fotos", JSON.stringify(fotos));
    mostrarFotos();
  };
  reader.readAsDataURL(file);
});

function mostrarFotos() {
  galeria.innerHTML = "";
  const fotos = JSON.parse(localStorage.getItem(fecha + "_fotos") || "[]");
  fotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    galeria.appendChild(img);
  });
}

mostrarFotos();

