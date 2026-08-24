import { request, addFavorite, addToCart } from './api.js';
import { element, button, courseCard, announce } from './ui.js';

const form = document.querySelector('#catalog-filters');
const grid = document.querySelector('#catalog-grid');
const status = document.querySelector('#catalog-status');
const empty = document.querySelector('#empty-state');
const errorBox = document.querySelector('#server-error');
const categories = document.querySelector('#categories');
const pageSize = document.querySelector('#page-size');
const previous = document.querySelector('#previous-page');
const next = document.querySelector('#next-page');
let page = 1;
let total = 0;
let controller;
let revision = 0;
let timer;
let categoriesReady = false;

function validRanges() {
  for (const name of ['price', 'duration']) {
    const min = document.querySelector(`#min-${name}`);
    const max = document.querySelector(`#max-${name}`);
    max.setCustomValidity(min.value !== '' && max.value !== '' && Number(min.value) > Number(max.value)
      ? 'The maximum must be greater than or equal to the minimum.' : '');
  }
  return form.checkValidity();
}

function queryParameters() {
  const params = new URLSearchParams({ _page: page, _limit: pageSize.value });
  const [field, order] = document.querySelector('#sort').value.split(':');
  params.set('_sort', field);
  params.set('_order', order);
  const search = document.querySelector('#search').value.trim();
  if (search) params.set('q', search);
  for (const input of categories.querySelectorAll('input:checked')) params.append('category', input.value);
  const fields = {
    level: 'level', rating: 'rating_gte',
    'min-price': 'price_gte', 'max-price': 'price_lte',
    'min-duration': 'duration_gte', 'max-duration': 'duration_lte'
  };
  for (const [id, parameter] of Object.entries(fields)) {
    const value = document.getElementById(id).value;
    if (value !== '') params.set(parameter, value);
  }
  return params;
}

function pagination(loading = false) {
  const pages = Math.max(1, Math.ceil(total / Number(pageSize.value)));
  previous.disabled = loading || page <= 1;
  next.disabled = loading || page >= pages;
  document.querySelector('#page-status').textContent = total ? `Page ${page} of ${pages}` : 'No pages';
}

async function runAction(control, action, message) {
  control.disabled = true;
  try {
    await action();
    announce(message);
    return true;
  } catch (error) {
    announce(error.message, true);
    return false;
  } finally {
    control.disabled = false;
  }
}

async function load() {
  clearTimeout(timer);
  controller?.abort();
  controller = new AbortController();
  const current = ++revision;
  const signal = controller.signal;
  grid.replaceChildren();
  grid.setAttribute('aria-busy', 'true');
  empty.hidden = true;
  errorBox.hidden = true;
  total = 0;
  pagination(true);
  if (!validRanges()) {
    status.textContent = 'Check the numeric ranges: the minimum cannot exceed the maximum.';
    grid.setAttribute('aria-busy', 'false');
    return;
  }
  status.textContent = 'Loading courses…';
  try {
    if (!categoriesReady) {
      const { data } = await request('categories', { signal });
      if (current !== revision) return;
      categories.replaceChildren();
      for (const category of new Set(data.map(item => item.name))) {
        const label = element('label', 'category-option');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'category';
        input.value = category;
        label.append(input, document.createTextNode(category));
        categories.append(label);
      }
      categoriesReady = true;
    }
    const [result, saved] = await Promise.all([
      request(`courses?${queryParameters()}`, { signal }),
      request('favorites', { signal })
    ]);
    if (current !== revision) return;
    total = result.total;
    const lastPage = Math.max(1, Math.ceil(total / Number(pageSize.value)));
    if (page > lastPage) {
      page = lastPage;
      return load();
    }
    const favoriteIds = new Set(saved.data.map(item => String(item.courseId)));
    const fragment = document.createDocumentFragment();
    for (const course of result.data) {
      const { card, actions } = courseCard(course);
      const favorite = button('Save favorite', async () => {
        const success = await runAction(favorite, () => addFavorite(course.id), `${course.title} saved to favorites.`);
        if (success) {
          favorite.textContent = 'Saved';
          favorite.disabled = true;
        }
      });
      favorite.dataset.action = 'favorite';
      if (favoriteIds.has(String(course.id))) {
        favorite.textContent = 'Saved';
        favorite.disabled = true;
      }
      const cart = button('Add to cart', () => runAction(cart, () => addToCart(course.id), `${course.title} added to cart.`));
      cart.dataset.action = 'cart';
      cart.classList.add('button-green');
      actions.append(favorite, cart);
      fragment.append(card);
    }
    grid.replaceChildren(fragment);
    empty.hidden = total !== 0;
    status.textContent = `${total} courses found · ${result.data.length} shown`;
    pagination();
  } catch (error) {
    if (current !== revision || error.name === 'AbortError') return;
    status.textContent = 'Could not load courses.';
    document.querySelector('#error-message').textContent = error.message;
    errorBox.hidden = false;
  } finally {
    if (current === revision) grid.setAttribute('aria-busy', 'false');
  }
}

function restart() {
  page = 1;
  load();
}

form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', event => {
  if (!event.target.matches('input[type="search"], input[type="number"]')) return;
  controller?.abort();
  revision++;
  pagination(true);
  clearTimeout(timer);
  timer = setTimeout(restart, 250);
});
form.addEventListener('change', event => {
  if (event.target.matches('select, input[type="checkbox"]')) restart();
});
pageSize.addEventListener('change', restart);
previous.addEventListener('click', () => { page--; load(); });
next.addEventListener('click', () => { page++; load(); });
document.querySelector('#reset-catalog').addEventListener('click', () => {
  form.reset();
  pageSize.value = '15';
  restart();
});
document.querySelector('#retry').addEventListener('click', load);
load();
