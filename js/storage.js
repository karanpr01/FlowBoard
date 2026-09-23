const KEY = 'flowboard:v1:tasks';

function readRaw() {
  try { return localStorage.getItem(KEY); }
  catch (err) { console.error('Could not read localStorage:', err); return null; }
}

// Returns { tasks, corrupted, raw }. `corrupted` is true only when there
// WAS saved data but it couldn't be parsed as a task list — that's a
// different situation from "no data yet" and gets a different screen.
export function loadTasks() {
  const raw = readRaw();
  if (raw === null) return { tasks: [], corrupted: false, raw: null };
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('saved data is not a task list');
    return { tasks: parsed, corrupted: false, raw: null };
  } catch (err) {
    console.error('Saved task data looks corrupted:', err);
    return { tasks: [], corrupted: true, raw };
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Could not save tasks:', err);
    return false;
  }
}