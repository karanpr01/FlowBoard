import { loadTasks, saveTasks } from './storage.js';
import { todayISO } from './utils.js';

export const state = { tasks: loadTasks() };

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

export function getStats() {
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.status === 'done').length;
  const overdue = state.tasks.filter(
    (t) => t.due && t.due < todayISO() && t.status !== 'done'
  ).length;
  return { total, active: total - done, done, overdue };
}