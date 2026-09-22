import { loadTasks, saveTasks } from './storage.js';
import { todayISO } from './utils.js';

export const state = { tasks: loadTasks() };

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
  return saveTasks(state.tasks);
}

export function getTask(id) {
  return state.tasks.find((t) => t.id === id);
}

export function updateTask(id, changes) {
  const task = getTask(id);
  if (!task) return false;
  Object.assign(task, changes);
  touch(task);
  return saveTasks(state.tasks);
}

export function moveTask(id, status) {
  return updateTask(id, { status });
}

export function deleteTask(id) {
  const index = state.tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [removed] = state.tasks.splice(index, 1);
  saveTasks(state.tasks);
  return { removed, index };
}

// Puts a deleted task back at its original position — used by Undo.
export function restoreTask(removed, index) {
  state.tasks.splice(index, 0, removed);
  return saveTasks(state.tasks);
}

export function getStats() {
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.status === 'done').length;
  const overdue = state.tasks.filter(
    (t) => t.due && t.due < todayISO() && t.status !== 'done'
  ).length;
  return { total, active: total - done, done, overdue };
}