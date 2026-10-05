import { el } from "./dom.js";

let current = null;

export function closeModal() {
  if (!current) return;
  const { overlay, previousFocus } = current;
  current = null;
  overlay.classList.add("closing");
  setTimeout(() => overlay.remove(), 200);
  document.body.classList.remove("no-scroll");
  document.removeEventListener("keydown", onKey);
  previousFocus?.focus?.();
}

function onKey(e) {
  if (e.key === "Escape") closeModal();
}

// Общий компонент: оболочка, открытие и закрытие. Содержимое передаётся отдельно.
export function openModal({ title, content, actions, onClose }) {
  closeModal();
  const closeWith = () => {
    closeModal();
    onClose?.();
  };
  const dialog = el(
    "div",
    {
      className: "modal",
      attrs: { role: "dialog", "aria-modal": "true", "aria-label": title },
    },
    [
      el("h2", { className: "modal__title", text: title }),
      content,
      el("div", { className: "modal__actions" }, actions),
    ],
  );
  const overlay = el(
    "div",
    {
      className: "overlay",
      on: { click: (e) => e.target === overlay && closeWith() },
    },
    [dialog],
  );
  current = { overlay, previousFocus: document.activeElement };
  document.body.append(overlay);
  document.body.classList.add("no-scroll");
  document.addEventListener("keydown", onKey);
  overlay.querySelector("button")?.focus();
  return closeWith;
}
