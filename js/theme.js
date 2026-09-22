const KEY = 'flowboard:v1:theme';

export function loadTheme() {
  try { return localStorage.getItem(KEY) || 'system'; }
  catch { return 'system'; }
}

export function applyTheme(theme) {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch {}
}

// Keeps the Settings radio buttons in sync with whatever the theme
// actually is right now (matters after the quick header toggle is used).
export function syncSettingsRadios() {
  const theme = document.documentElement.getAttribute('data-theme') || 'system';
  document.querySelectorAll('input[name="theme"]').forEach((r) => { r.checked = r.value === theme; });
}

export function initTheme() {
  applyTheme(loadTheme());
  document.querySelector('#themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(current === 'dark' ? 'light' : 'dark');
    syncSettingsRadios();
  });
}