import { getVisibleTasks } from './query.js';

let activeTab = 'todo';
const STATUSES = ['todo', 'progress', 'done'];

export function initTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      applyTabVisibility();
    });
  });
}

// Called after every render() so the right column stays visible and
// the tab counts match whatever search/filter is currently applied.
export function applyTabVisibility() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab.dataset.tab === activeTab));
  });
  document.querySelectorAll('.column').forEach((col) => {
    col.classList.toggle('is-active', col.dataset.status === activeTab);
  });
  STATUSES.forEach((status) => {
    const count = getVisibleTasks().filter((t) => t.status === status).length;
    document.querySelector(`[data-tab-count="${status}"]`).textContent = count;
  });
}