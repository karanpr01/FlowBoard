const KEY = 'flowboard:v1:tasks';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not load tasks:', err);
    return [];
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