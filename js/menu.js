import { moveTask } from './tasks.js';
import { render } from './render.js';
import { openTaskForm } from './modal.js';
import { openDetails } from './details.js';
import { removeTaskWithUndo } from './delete.js';

const menu = document.querySelector('#menu');
let openForId = null;

const STATUS_LABEL = { todo: 'Todo', progress: 'In progress', done: 'Completed' };

export function openMenu(id, anchorEl) {
  openForId = id;
  const current = anchorEl.closest('.card').dataset.id;
  const moves = Object.entries(STATUS_LABEL)
    .filter(([status]) => status !== anchorEl.closest('[data-status]')?.dataset.status);

  menu.innerHTML = `
    <button type="button" data-m="open">View details</button>
    <button type="button" data-m="edit">Edit</button>
    ${['todo', 'progress', 'done'].map((s) =>
      `<button type="button" data-m="move:${s}">Move to ${STATUS_LABEL[s]}</button>`
    ).join('')}
    <hr>
    <button type="button" data-m="delete" class="menu__danger">Delete</button>`;

  const r = anchorEl.getBoundingClientRect();
  menu.style.top = `${r.bottom + 4}px`;
  menu.style.left = `${Math.min(r.left, window.innerWidth - 200)}px`;
  menu.hidden = false;
}

function closeMenu() {
  menu.hidden = true;
  openForId = null;
}

menu.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-m]');
  if (!btn || !openForId) return;
  const action = btn.dataset.m;
  const id = openForId;
  closeMenu();

  if (action === 'open') openDetails(id);
  else if (action === 'edit') openTaskForm('todo', id);
  else if (action === 'delete') removeTaskWithUndo(id);
  else if (action.startsWith('move:')) {
    moveTask(id, action.slice(5));
    render();
  }
});

document.addEventListener('click', (e) => {
  if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('[data-action="menu"]')) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});