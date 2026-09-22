import { queryState } from './query.js';
import { render } from './render.js';
import { clearSearch } from './search.js';

const chips = document.querySelectorAll('.chip');
const sortSelect = document.querySelector('#sortSelect');
const clearBtn = document.querySelector('#clearFiltersBtn');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    queryState.filter = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    render();
  });
});

sortSelect.addEventListener('change', () => {
  queryState.sort = sortSelect.value;
  render();
});

clearBtn.addEventListener('click', () => {
  clearSearch();
  queryState.filter = 'all';
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === 'all')));
  render();
});