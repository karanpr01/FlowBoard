import { state, getStats, retryPersist } from './tasks.js';
import { getVisibleTasks, queryState, isFiltering } from './query.js';
import { escapeHtml, formatDate, todayISO } from './utils.js';
import { makeCardsDraggable } from './dragdrop.js';
import { applyTabVisibility } from './tabs.js';

const STATUSES = ['todo', 'progress', 'done'];
const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
const EMPTY = {
  todo: ['No tasks yet', 'Add your first task and start organizing your day.'],
  progress: ['Nothing in progress', 'Move a task here when you start working on it.'],
  done: ['No completed tasks', 'Completed tasks will appear here.'],
};

function highlight(text) {
  const q = queryState.search.trim();
  if (!q) return escapeHtml(text);
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  return escapeHtml(text).replace(re, '<mark>$1</mark>');
}

function cardHTML(t) {
  const overdue = t.due && t.due < todayISO() && t.status !== 'done';
  const dueText = t.due
    ? `<p class="card__due${overdue ? ' card__due--overdue' : ''}">${overdue ? 'Overdue since' : 'Due'} ${formatDate(t.due)}</p>`
    : '';
  const tags = t.tags.length
    ? `<ul class="tags">${t.tags.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`
    : '';
  return `
    <article class="card${t.status === 'done' ? ' card--done' : ''}" data-id="${t.id}">
      <div class="card__top">
        <span class="badge badge--${t.priority}">${PRIORITY_LABEL[t.priority]}</span>
        <button class="icon-btn" type="button" data-action="menu" data-id="${t.id}" aria-haspopup="menu" aria-expanded="false" aria-label="More actions for ${escapeHtml(t.title)}">⋯</button>
      </div>
      <button class="card__open" type="button" data-action="open" data-id="${t.id}">
        <h3 class="card__title">${highlight(t.title)}</h3>
      </button>
      ${t.description ? `<p class="card__desc">${highlight(t.description)}</p>` : ''}
      ${tags}
      <div class="card__foot">
        ${dueText || '<span></span>'}
        <button class="check" type="button" data-action="toggle" data-id="${t.id}" aria-label="${t.status === 'done' ? 'Reopen' : 'Mark complete'}: ${escapeHtml(t.title)}">✓</button>
      </div>
    </article>`;
}

function emptyHTML(status, filtering) {
  if (filtering) return `<div class="empty"><h3>Nothing here</h3><p>No matching tasks in this column.</p></div>`;
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
  const visible = getVisibleTasks();
  const filtering = isFiltering();
  const panel = document.querySelector('#noResults');
  const board = document.querySelector('#board');

  if (filtering && visible.length === 0 && state.tasks.length > 0) {
    panel.hidden = false;
    board.hidden = true;
  } else {
    panel.hidden = true;
    board.hidden = false;
  }

  STATUSES.forEach((status) => {
    const list = visible.filter((t) => t.status === status);
    document.querySelector(`[data-count="${status}"]`).textContent = list.length;
    document.querySelector(`[data-body="${status}"]`).innerHTML =
      list.length ? list.map(cardHTML).join('') : emptyHTML(status, filtering);
  });

  const results = document.querySelector('#results');
  if (filtering) {
    results.hidden = false;
    results.textContent = `Showing ${visible.length} of ${state.tasks.length} tasks`;
  } else {
    results.hidden = true;
  }
}

function renderBanner() {
  const banner = document.querySelector('#banner');
  if (state.storageOk) { banner.innerHTML = ''; return; }
  banner.innerHTML = `
    <div class="banner banner--warn" role="status">
      <span>⚠️ Changes aren't being saved — this browser's storage isn't available right now.</span>
      <button class="btn btn--secondary" type="button" id="retryStorageBtn">Retry</button>
    </div>`;
  document.querySelector('#retryStorageBtn').addEventListener('click', () => {
    retryPersist();
    render();
  });
}

export function render() {
  renderBanner();
  renderStats();
  renderBoard();
  makeCardsDraggable();
  applyTabVisibility();
}