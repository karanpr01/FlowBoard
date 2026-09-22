import { getTask, moveTask } from './tasks.js';
import { render } from './render.js';
import { openTaskForm } from './modal.js';
import { removeTaskWithUndo } from './delete.js';
import { escapeHtml, formatDate } from './utils.js';

const dialog = document.querySelector('#detailsDialog');
const body = document.querySelector('#detailsBody');
let currentId = null;

const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_LABEL = { todo: 'Todo', progress: 'In progress', done: 'Completed' };
const NEXT_ACTION = {
  todo: { action: 'progress', label: 'Start task' },
  progress: { action: 'done', label: 'Mark complete' },
  done: { action: 'todo', label: 'Reopen' },
};

export function openDetails(id) {
  currentId = id;
  renderDetails();
  dialog.showModal();
}

function renderDetails() {
  const t = getTask(currentId);
  if (!t) return dialog.close();
  const next = NEXT_ACTION[t.status];
  body.innerHTML = `
    <span class="badge badge--${t.priority}">${PRIORITY_LABEL[t.priority]}</span>
    <span class="status-pill">${STATUS_LABEL[t.status]}</span>
    <h3 class="detail__title">${escapeHtml(t.title)}</h3>
    <p class="detail__desc">${t.description ? escapeHtml(t.description) : 'No description.'}</p>
    <dl class="dl">
      <dt>Due date</dt><dd>${t.due ? formatDate(t.due) : 'No due date'}</dd>
      <dt>Tags</dt><dd>${t.tags.length ? escapeHtml(t.tags.join(', ')) : 'No tags'}</dd>
      <dt>Created</dt><dd>${new Date(t.created).toLocaleString()}</dd>
      <dt>Updated</dt><dd>${new Date(t.updated).toLocaleString()}</dd>
    </dl>
    <div class="dialog__foot">
      <button class="btn btn--danger" type="button" data-d="delete">Delete</button>
      <button class="btn btn--secondary" type="button" data-d="edit">Edit</button>
      <button class="btn btn--primary" type="button" data-d="next">${next.label}</button>
    </div>`;
}

dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));

body.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-d]');
  if (!btn) return;
  const action = btn.dataset.d;
  if (action === 'edit') { dialog.close(); openTaskForm('todo', currentId); }
  else if (action === 'delete') { dialog.close(); removeTaskWithUndo(currentId); }
  else if (action === 'next') {
    moveTask(currentId, NEXT_ACTION[getTask(currentId).status].action);
    render();
    renderDetails();
  }
});