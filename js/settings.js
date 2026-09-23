import { state, clearAllTasks, importTasks } from './tasks.js';
import { render } from './render.js';
import { showToast } from './toast.js';
import { applyTheme, syncSettingsRadios } from './theme.js';

const dialog = document.querySelector('#settingsDialog');
const clearDialog = document.querySelector('#clearDialog');
const msg = document.querySelector('#settingsMsg');

document.querySelector('#settingsBtn').addEventListener('click', () => {
  syncSettingsRadios();
  msg.textContent = '';
  dialog.showModal();
});

document.querySelectorAll('dialog [data-close]').forEach((b) =>
  b.addEventListener('click', () => b.closest('dialog').close())
);

dialog.querySelectorAll('input[name="theme"]').forEach((radio) => {
  radio.addEventListener('change', () => applyTheme(radio.value));
});

function showMsg(text, ok = true) {
  msg.textContent = text;
  msg.className = `settings-msg settings-msg--${ok ? 'ok' : 'err'}`;
}

document.querySelector('#exportBtn').addEventListener('click', () => {
  if (!state.tasks.length) return showMsg("You don't have any tasks to export yet.", false);
  const payload = JSON.stringify({ app: 'FlowBoard', exportedAt: new Date().toISOString(), tasks: state.tasks }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), {
    href: url, download: `flowboard-backup-${new Date().toISOString().slice(0, 10)}.json`,
  });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showMsg(`Exported ${state.tasks.length} tasks.`);
});

const fileInput = document.querySelector('#importFile');
document.querySelector('#importBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  fileInput.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const incoming = Array.isArray(data) ? data : data.tasks;
    if (!Array.isArray(incoming)) throw new Error('bad shape');

    const existingIds = new Set(state.tasks.map((t) => t.id));
    const clean = incoming.filter((t) => t && t.title && !existingIds.has(t.id));
    importTasks(clean);
    render();
    showMsg(`Imported ${clean.length} tasks.`);
  } catch {
    showMsg("That file isn't a valid FlowBoard backup.", false);
  }
});

const clearBtn = document.querySelector('#clearDataBtn');
const clearInput = document.querySelector('#clearInput');
const clearConfirmBtn = document.querySelector('#clearConfirmBtn');

clearBtn.addEventListener('click', () => {
  clearInput.value = '';
  clearConfirmBtn.disabled = true;
  clearDialog.showModal();
});

clearInput.addEventListener('input', () => {
  clearConfirmBtn.disabled = clearInput.value.trim().toUpperCase() !== 'DELETE';
});

clearConfirmBtn.addEventListener('click', () => {
  clearAllTasks();
  render();
  clearDialog.close();
  showToast('All tasks deleted.');
});