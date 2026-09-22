import { queryState } from './query.js';
import { render } from './render.js';

const input = document.querySelector('#searchInput');
let debounceTimer;

input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    queryState.search = input.value;
    render();
  }, 150); // debounce: wait for a pause in typing before filtering
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && input.value) {
    input.value = '';
    queryState.search = '';
    render();
  }
});

export function clearSearch() {
  input.value = '';
  queryState.search = '';
}