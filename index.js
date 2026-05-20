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
  const div = document.createElement("div");

  const img = document.createElement("img");
  img.src = card.src;
  img.alt = card.title;

  const h2 = document.createElement("h2");
  h2.textContent = card.title;

  const p = document.createElement("p");
  p.textContent = card.description;

  div.append(img, h2, p);
  grid.appendChild(div);
}

// Guardar (siempre como string)
// localStorage.setItem("tarjetas", JSON.stringify(miArray))

// Recuperar
// const datos = JSON.parse(localStorage.getItem("tarjetas"))

// Borrar
// localStorage.removeItem("tarjetas")
