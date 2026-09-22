import { render } from './render.js';
import { openTaskForm } from './modal.js';
import { openMenu } from './menu.js';
import { openDetails } from './details.js';
import { moveTask } from './tasks.js';
import { removeTaskWithUndo } from './delete.js';

render();

document.addEventListener('click', (e) => {
  const menuBtn = e.target.closest('[data-action="menu"]');
  if (menuBtn) return openMenu(menuBtn.dataset.id, menuBtn);

  const openBtn = e.target.closest('[data-action="open"]');
  if (openBtn) return openDetails(openBtn.dataset.id);

  const toggleBtn = e.target.closest('[data-action="toggle"]');
  if (toggleBtn) {
    const card = toggleBtn.closest('.card');
    const isDone = card.classList.contains('card--done');
    moveTask(toggleBtn.dataset.id, isDone ? 'todo' : 'done');
    return render();
  }

  const addBtn = e.target.closest('[data-action="add"]');
  if (addBtn) return openTaskForm(addBtn.dataset.status || 'todo');
});