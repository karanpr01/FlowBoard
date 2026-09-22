import { state } from './tasks.js';
import { todayISO } from './utils.js';

export const queryState = { search: '', filter: 'all', sort: 'newest' };

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

function matchesFilter(t, filter) {
  switch (filter) {
    case 'high': case 'medium': case 'low': return t.priority === filter;
    case 'today': return t.due === todayISO() && t.status !== 'done';
    case 'overdue': return !!t.due && t.due < todayISO() && t.status !== 'done';
    case 'done': return t.status === 'done';
    default: return true;
  }
}

function matchesSearch(t, search) {
  if (!search) return true;
  const haystack = `${t.title} ${t.description} ${t.tags.join(' ')}`.toLowerCase();
  return haystack.includes(search.toLowerCase());
}

function compareTasks(a, b, sort) {
  switch (sort) {
    case 'oldest': return a.created.localeCompare(b.created);
    case 'due': return (a.due || '9999') .localeCompare(b.due || '9999');
    case 'priority': return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    case 'az': return a.title.localeCompare(b.title);
    default: return b.created.localeCompare(a.created); // newest
  }
}

// The one function render.js calls: gives back only what should be on screen, in order.
export function getVisibleTasks() {
  return state.tasks
    .filter((t) => matchesFilter(t, queryState.filter) && matchesSearch(t, queryState.search))
    .sort((a, b) => compareTasks(a, b, queryState.sort));
}

export function isFiltering() {
  return queryState.search.trim() !== '' || queryState.filter !== 'all';
}