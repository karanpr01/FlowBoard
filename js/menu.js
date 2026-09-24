import { moveTask } from "./tasks.js";
import { render } from "./render.js";
import { openTaskForm } from "./modal.js";
import { openDetails } from "./details.js";
import { removeTaskWithUndo } from "./delete.js";
import { icon } from "./icons.js";

const menu = document.querySelector("#menu");
let openForId = null;
let opener = null;

const STATUS_LABEL = {
  todo: "Todo",
  progress: "In progress",
  done: "Completed",
};

export function openMenu(id, anchorEl) {
  openForId = id;
  opener = anchorEl;

  menu.innerHTML = `
  <button type="button" role="menuitem" data-m="open">${icon("eye")}View details</button>
  <button type="button" role="menuitem" data-m="edit">${icon("pencil")}Edit</button>
  ${["todo", "progress", "done"]
    .map(
      (s) =>
        `<button type="button" role="menuitem" data-m="move:${s}">${icon("arrow-right")}Move to ${STATUS_LABEL[s]}</button>`,
    )
    .join("")}
  <hr>
  <button type="button" role="menuitem" data-m="delete" class="menu__danger">${icon("trash")}Delete</button>`;

  const r = anchorEl.getBoundingClientRect();
  menu.style.top = `${r.bottom + 4}px`;
  menu.style.left = `${Math.min(r.left, window.innerWidth - 200)}px`;
  menu.hidden = false;
  anchorEl.setAttribute("aria-expanded", "true");
  menu.querySelector("button").focus();
}

function closeMenu(returnFocus = true) {
  if (menu.hidden) return;
  menu.hidden = true;
  if (opener) {
    opener.setAttribute("aria-expanded", "false");
    if (returnFocus) opener.focus();
  }
  openForId = null;
  opener = null;
}

menu.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-m]");
  if (!btn || !openForId) return;
  const action = btn.dataset.m;
  const id = openForId;
  closeMenu(false);

  if (action === "open") openDetails(id);
  else if (action === "edit") openTaskForm("todo", id);
  else if (action === "delete") removeTaskWithUndo(id);
  else if (action.startsWith("move:")) {
    moveTask(id, action.slice(5));
    render();
  }
});

// Arrow-key navigation inside the open menu — Up/Down cycle, Home/End
// jump to the ends, Escape closes and returns focus to the "⋯" button.
menu.addEventListener("keydown", (e) => {
  const items = [...menu.querySelectorAll("button")];
  const i = items.indexOf(document.activeElement);
  if (e.key === "ArrowDown") {
    e.preventDefault();
    items[(i + 1) % items.length].focus();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    items[(i - 1 + items.length) % items.length].focus();
  } else if (e.key === "Home") {
    e.preventDefault();
    items[0].focus();
  } else if (e.key === "End") {
    e.preventDefault();
    items[items.length - 1].focus();
  } else if (e.key === "Escape") {
    e.preventDefault();
    closeMenu();
  } else if (e.key === "Tab") closeMenu(false);
});

document.addEventListener("click", (e) => {
  if (
    !menu.hidden &&
    !menu.contains(e.target) &&
    !e.target.closest('[data-action="menu"]')
  )
    closeMenu(false);
});
