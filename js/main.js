import { render } from './render.js';
import { openTaskForm } from './modal.js';

render();

document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-action="add"]');
  if (addBtn) openTaskForm(addBtn.dataset.status || 'todo');
});