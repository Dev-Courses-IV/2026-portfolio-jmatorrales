const form = document.querySelector("form");
const cards = JSON.parse(localStorage.getItem("tarjetas")) || [];

cards.forEach(renderCard); // recuperar tarjetas al cargar

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const card = {
    title: form.title.value,
    src: form.src.value,
    description: form.description.value,
  };

  cards.push(card);
  renderCard(card);
  localStorage.setItem("tarjetas", JSON.stringify(cards));
  form.reset();
}

function renderCard(card) {
  const grid = document.querySelector("#grid");
  grid.classList.add(
    "grid", "gap-6", "grid-cols-1", "md:grid-cols-2", "p-6"
  );

  const div = document.createElement("div");
  div.classList.add(
    "flex", "flex-col", "rounded-2xl", "bg-white",
    "shadow-md", "overflow-hidden", "border", "border-gray-100",
    "hover:shadow-xl", "hover:-translate-y-1", "transition-all", "duration-300"
  );

  // Imagen siempre cuadrada
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("w-full", "aspect-square", "overflow-hidden", "bg-gray-100");

  const img = document.createElement("img");
  img.src = card.src;
  img.alt = card.title;
  img.classList.add("w-full", "h-full", "object-cover");

  imgWrapper.appendChild(img);

  // Contenido de texto
  const content = document.createElement("div");
  content.classList.add("flex", "flex-col", "gap-1", "p-4");

  const h2 = document.createElement("h2");
  h2.textContent = card.title;
  h2.classList.add("text-lg", "font-semibold", "text-gray-800");

  const p = document.createElement("p");
  p.textContent = card.description;
  p.classList.add("text-sm", "text-gray-500");

  content.append(h2, p);
  div.append(imgWrapper, content);
  grid.appendChild(div);
}

// Guardar (siempre como string)
// localStorage.setItem("tarjetas", JSON.stringify(miArray))

// Recuperar
// const datos = JSON.parse(localStorage.getItem("tarjetas"))

// Borrar
// localStorage.removeItem("tarjetas")
