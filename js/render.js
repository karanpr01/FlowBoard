import { state, getStats } from './tasks.js';
import { escapeHtml, formatDate, todayISO } from './utils.js';

const STATUSES = ['todo', 'progress', 'done'];
const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
const EMPTY = {
  todo: ['No tasks yet', 'Add your first task and start organizing your day.'],
  progress: ['Nothing in progress', 'Move a task here when you start working on it.'],
  done: ['No completed tasks', 'Completed tasks will appear here.'],
};

function cardHTML(t) {
  const overdue = t.due && t.due < todayISO() && t.status !== 'done';
  const dueText = t.due
    ? `<p class="card__due${overdue ? ' card__due--overdue' : ''}">${overdue ? 'Overdue since' : 'Due'} ${formatDate(t.due)}</p>`
    : '';
  const tags = t.tags.length
    ? `<ul class="tags">${t.tags.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`
    : '';
  return `
    <article class="card" data-id="${t.id}">
      <span class="badge badge--${t.priority}">${PRIORITY_LABEL[t.priority]}</span>
      <h3 class="card__title">${escapeHtml(t.title)}</h3>
      ${t.description ? `<p class="card__desc">${escapeHtml(t.description)}</p>` : ''}
      ${tags}
      ${dueText}
    </article>`;
}

function emptyHTML(status) {
  const [title, text] = EMPTY[status];
  const cta = status === 'todo'
    ? '<button class="btn btn--primary" type="button" data-action="add" data-status="todo">+ Add task</button>'
    : '';
  return `<div class="empty"><h3>${title}</h3><p>${text}</p>${cta}</div>`;
}

function renderStats() {
  const s = getStats();
  document.querySelector('#stats').innerHTML = [
    ['Total', s.total], ['Active', s.active], ['Completed', s.done], ['Overdue', s.overdue],
  ].map(([label, n]) => `<div class="stat"><dt>${label}</dt><dd>${n}</dd></div>`).join('');
}

function renderBoard() {
  STATUSES.forEach((status) => {
    const list = state.tasks
      .filter((t) => t.status === status)
      .sort((a, b) => b.created.localeCompare(a.created));
    document.querySelector(`[data-count="${status}"]`).textContent = list.length;
    document.querySelector(`[data-body="${status}"]`).innerHTML =
      list.length ? list.map(cardHTML).join('') : emptyHTML(status);
  });
}

export function render() {
  renderStats();
  renderBoard();
}