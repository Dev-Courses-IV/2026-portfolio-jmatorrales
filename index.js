const form = document.querySelector("form");
let cards = JSON.parse(localStorage.getItem("tarjetas")) || [];
let targetCard = null; // referencia al div DOM de la tarjeta clickada
let targetIndex = -1;  // índice en el array cards[]

cards.forEach((card, i) => renderCard(card, i));
form.addEventListener("submit", handleSubmit);

// ── Menú contextual ──────────────────────────────────────────────
const menu = document.createElement("div");
menu.id = "context-menu";
menu.className = "hidden absolute bg-white shadow-lg rounded-md py-1 z-50 min-w-[140px]";
menu.innerHTML = `
  <ul>
    <li><button id="btn-edit"   class="w-full text-left px-4 py-2 hover:bg-gray-100">✏️ Editar</button></li>
    <li><button id="btn-delete" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">🗑️ Eliminar</button></li>
  </ul>
`;
document.body.appendChild(menu);

// Modal de edición
const modal = document.createElement("div");
modal.id = "edit-modal";
modal.className = "hidden fixed inset-0 bg-black/40 flex items-center justify-center z-50";
modal.innerHTML = `
  <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md flex flex-col gap-4 shadow-xl">
    <h2 class="text-lg font-semibold text-teal-800">Editar tarjeta</h2>
    <input id="edit-title"       type="text"  placeholder="Título"         class="border border-gray-300 rounded px-3 py-2 outline-none focus:border-teal-500" />
    <input id="edit-src"         type="text"  placeholder="URL de imagen"  class="border border-gray-300 rounded px-3 py-2 outline-none focus:border-teal-500" />
    <textarea id="edit-desc"     placeholder="Descripción"                 class="border border-gray-300 rounded px-3 py-2 outline-none focus:border-teal-500 resize-none h-24"></textarea>
    <div class="flex gap-2 justify-end">
      <button id="modal-cancel" class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition">Cancelar</button>
      <button id="modal-save"   class="px-4 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white transition">Guardar</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

// ── Eventos del menú contextual ───────────────────────────────────

// Clic derecho: solo actuar si es sobre una tarjeta
document.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // evitar menú del navegador

  const cardEl = e.target.closest("[data-index]");
  if (!cardEl) return; // ignorar si no es una tarjeta

  
  targetCard  = cardEl;
  targetIndex = parseInt(cardEl.dataset.index, 10);

  menu.style.top  = `${e.pageY}px`;
  menu.style.left = `${e.pageX}px`;
  menu.classList.remove("hidden");
});

// Cerrar menú al hacer clic en cualquier sitio
document.addEventListener("click", () => menu.classList.add("hidden"));

// Botón ELIMINAR
document.getElementById("btn-delete").addEventListener("click", () => {
  if (targetIndex === -1) return;

  cards.splice(targetIndex, 1);
  localStorage.setItem("tarjetas", JSON.stringify(cards));

  targetCard.remove();

  // Actualizar índices de las tarjetas restantes
  document.querySelectorAll("[data-index]").forEach((el, i) => {
    el.dataset.index = i;
  });

  targetCard = null;
  targetIndex = -1;
});

// Botón EDITAR — abre el modal con los datos actuales
document.getElementById("btn-edit").addEventListener("click", () => {
  if (targetIndex === -1) return;

  const card = cards[targetIndex];
  document.getElementById("edit-title").value = card.title;
  document.getElementById("edit-src").value   = card.src;
  document.getElementById("edit-desc").value  = card.description;

  modal.classList.remove("hidden");
});

// Modal: Cancelar
document.getElementById("modal-cancel").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Modal: Guardar cambios
document.getElementById("modal-save").addEventListener("click", () => {
  const updatedCard = {
    title:       document.getElementById("edit-title").value,
    src:         document.getElementById("edit-src").value,
    description: document.getElementById("edit-desc").value,
  };

  cards[targetIndex] = updatedCard;
  localStorage.setItem("tarjetas", JSON.stringify(cards));

  // Actualizar el DOM de esa tarjeta sin re-renderizar todo
  targetCard.querySelector("img").src         = updatedCard.src;
  targetCard.querySelector("img").alt         = updatedCard.title;
  targetCard.querySelector("h2").textContent  = updatedCard.title;
  targetCard.querySelector("p").textContent   = updatedCard.description;

  modal.classList.add("hidden");
  targetCard  = null;
  targetIndex = -1;
});

// ── Form principal ────────────────────────────────────────────────

function handleSubmit(event) {
  event.preventDefault();
  const card = {
    title:       form.title.value,
    src:         form.src.value,
    description: form.description.value,
  };
  const index = cards.length;
  cards.push(card);
  renderCard(card, index);
  localStorage.setItem("tarjetas", JSON.stringify(cards));
  form.reset();
}

function renderCard(card, index) {
  const grid = document.querySelector("#grid");
  grid.classList.add("grid", "gap-6", "grid-cols-1", "md:grid-cols-2", "p-6");

  const div = document.createElement("div");
  div.classList.add(
    "flex", "flex-col", "rounded-2xl", "bg-white",
    "shadow-md", "overflow-hidden", "border", "border-gray-100",
    "cursor-context-menu"
  );
  div.dataset.index = index; // ← clave para identificar la tarjeta

  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("w-full", "aspect-square", "overflow-hidden", "bg-gray-100");

  const img = document.createElement("img");
  img.src = card.src;
  img.alt = card.title;
  img.classList.add("w-full", "h-full", "object-cover");
  imgWrapper.appendChild(img);

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