import './search.js';
import './filters.js';
import './dragdrop.js';
import './settings.js';
import { render } from './render.js';
import { openTaskForm } from './modal.js';
import { openMenu } from './menu.js';
import { openDetails } from './details.js';
import { moveTask, loadIssue, retryPersist } from './tasks.js';
import { removeTaskWithUndo } from './delete.js';
import { initTheme } from './theme.js';
import { initTabs } from './tabs.js';
import { showToast } from './toast.js';

initTheme();
initTabs();

const corruptPanel = document.querySelector('#corruptPanel');
const appContent = document.querySelector('#appContent');

if (loadIssue.corrupted) {
  corruptPanel.hidden = false;
  appContent.hidden = true;
}

document.querySelector('#corruptRetry').addEventListener('click', () => location.reload());

document.querySelector('#corruptCopy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(loadIssue.raw || '');
    showToast('Raw data copied to clipboard.');
  } catch {
    showToast("Couldn't copy automatically — check DevTools → Application → Local Storage instead.", { type: 'error' });
  }
});

document.querySelector('#corruptFresh').addEventListener('click', () => {
  retryPersist(); // overwrites the corrupted value with an empty task list
  corruptPanel.hidden = true;
  appContent.hidden = false;
  render();
});

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

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault();
    document.querySelector('#searchInput').focus();
  }
});