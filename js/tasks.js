import { loadTasks, saveTasks } from './storage.js';
import { todayISO } from './utils.js';

const loaded = loadTasks();
export const state = { tasks: loaded.tasks, storageOk: true };
export const loadIssue = { corrupted: loaded.corrupted, raw: loaded.raw };

// Every write goes through this one function, so storage-failure
// tracking only has to be handled in one place.
function persist() {
  state.storageOk = saveTasks(state.tasks);
  return state.storageOk;
}
export function retryPersist() { return persist(); }

function touch(task) {
  task.updated = new Date().toISOString();
}

export function createTask({ title, description, priority, due, status, tags }) {
  const now = new Date().toISOString();
  state.tasks.push({
    id: crypto.randomUUID(),
    title, description, priority, due, status, tags,
    created: now,
    updated: now,
  });
  return persist();
}

export function getTask(id) {
  return state.tasks.find((t) => t.id === id);
}

export function updateTask(id, changes) {
  const task = getTask(id);
  if (!task) return false;
  Object.assign(task, changes);
  touch(task);
  return persist();
}

export function moveTask(id, status) {
  return updateTask(id, { status });
}

export function deleteTask(id) {
  const index = state.tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [removed] = state.tasks.splice(index, 1);
  persist();
  return { removed, index };
}

export function restoreTask(removed, index) {
  state.tasks.splice(index, 0, removed);
  return persist();
}

export function clearAllTasks() {
  state.tasks.length = 0; // empty in place — see note below
  return persist();
}

export function importTasks(newTasks) {
  state.tasks.push(...newTasks);
  return persist();
}

export function getStats() {
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.status === 'done').length;
  const overdue = state.tasks.filter(
    (t) => t.due && t.due < todayISO() && t.status !== 'done'
  ).length;
  return { total, active: total - done, done, overdue };
}