export function showToast(message, { type = 'success', duration = 4000, action = null } = {}) {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;

  const text = document.createElement('span');
  text.textContent = message;
  el.append(text);

  if (action) {
    const btn = document.createElement('button');
    btn.className = 'toast__action';
    btn.type = 'button';
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      action.onClick();
      el.remove();
    });
    el.append(btn);
  }

  document.querySelector('#toasts').append(el);
  setTimeout(() => el.remove(), duration);
}