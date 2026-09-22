export function showToast(message, { type = 'success', duration = 4000 } = {}) {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  document.querySelector('#toasts').append(el);
  setTimeout(() => el.remove(), duration);
}