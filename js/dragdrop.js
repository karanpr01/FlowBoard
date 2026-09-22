import { moveTask, getTask } from './tasks.js';
import { render } from './render.js';

const board = document.querySelector('#board');
let draggedId = null;

// Cards get draggable="true" here (rather than in the cardHTML string) so
// touch devices — where dragging doesn't make sense — never see it.
export function makeCardsDraggable() {
  document.querySelectorAll('.card').forEach((card) => {
    card.setAttribute('draggable', 'true');
  });
}

board.addEventListener('dragstart', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  draggedId = card.dataset.id;
  card.classList.add('dragging');
});

board.addEventListener('dragend', (e) => {
  e.target.closest('.card')?.classList.remove('dragging');
  document.querySelectorAll('.column').forEach((c) => c.classList.remove('drop-ok'));
  draggedId = null;
});

board.addEventListener('dragover', (e) => {
  const column = e.target.closest('.column');
  if (!column || !draggedId) return;
  const task = getTask(draggedId);
  if (task.status === column.dataset.status) return; // no-op: don't highlight own column
  e.preventDefault(); // required to allow a drop
  document.querySelectorAll('.column').forEach((c) => c.classList.toggle('drop-ok', c === column));
});

board.addEventListener('drop', (e) => {
  const column = e.target.closest('.column');
  if (!column || !draggedId) return;
  e.preventDefault();
  moveTask(draggedId, column.dataset.status);
  render();
  makeCardsDraggable();
});