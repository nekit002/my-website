import { request, addToCart } from './api.js';
import { element, button, courseCard, money, announce } from './ui.js';

const collection = document.body.dataset.collection;
const isCart = collection === 'cart';
const grid = document.querySelector('#collection-grid');
const status = document.querySelector('#collection-status');
const empty = document.querySelector('#empty-state');
const errorBox = document.querySelector('#server-error');
const checkout = document.querySelector('#checkout');
let items = [];
let busy = false;

function setBusy(value) {
  busy = value;
  grid.setAttribute('aria-busy', String(value));
  for (const control of grid.querySelectorAll('button, input')) control.disabled = value;
  if (checkout) checkout.disabled = value || items.length === 0 || items.some(item => !item.course);
}

async function mutate(action, successMessage) {
  if (busy) return;
  setBusy(true);
  let message = successMessage;
  let failed = false;
  try {
    await action();
  } catch (error) {
    message = error.message;
    failed = true;
  }
  await load();
  announce(message, failed);
}

function render() {
  const fragment = document.createDocumentFragment();
  let cents = 0;
  for (const item of items) {
    const { course } = item;
    let card;
    let actions;
    if (course) {
      ({ card, actions } = courseCard(course));
    } else {
      card = element('article', 'catalog-card catalog-card-body');
      card.append(element('h2', '', 'Course unavailable'));
      actions = element('div', 'card-actions');
      card.append(actions);
    }
    card.dataset.entryId = item.id;
    const remove = button('Remove', () => mutate(
      () => request(`${collection}/${encodeURIComponent(item.id)}`, { method: 'DELETE' }),
      'Item removed.'
    ));
    remove.dataset.action = 'remove';
    if (isCart && course) {
      const quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.required = true;
      quantity.min = '1';
      quantity.max = '99';
      quantity.step = '1';
      quantity.value = item.quantity;
      quantity.setAttribute('aria-label', `Quantity for ${course.title}`);
      quantity.addEventListener('change', () => {
        if (!quantity.checkValidity()) {
          quantity.reportValidity();
          quantity.value = item.quantity;
          announce('Quantity must be a whole number from 1 to 99.', true);
          return;
        }
        mutate(() => request(`cart/${encodeURIComponent(item.id)}`, {
          method: 'PATCH', body: { quantity: Number(quantity.value) }
        }), 'Quantity updated.');
      });
      const label = element('label', 'quantity-label', 'Quantity');
      label.append(quantity);
      const lineCents = Math.round(course.price * 100) * item.quantity;
      cents += lineCents;
      actions.append(label, element('p', 'line-total', `Subtotal: ${money.format(lineCents / 100)}`));
    } else if (course) {
      const add = button('Add to cart', () => mutate(() => addToCart(course.id), `${course.title} added to cart.`));
      add.dataset.action = 'cart';
      add.classList.add('button-green');
      actions.append(add);
    }
    actions.append(remove);
    fragment.append(card);
  }
  grid.replaceChildren(fragment);
  status.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
  empty.hidden = items.length !== 0;
  if (isCart) document.querySelector('#cart-total').textContent = money.format(cents / 100);
}

async function load() {
  setBusy(true);
  errorBox.hidden = true;
  empty.hidden = true;
  status.textContent = 'Loading…';
  let loaded = false;
  try {
    const { data } = await request(`${collection}?_expand=course`);
    items = data;
    render();
    loaded = true;
  } catch (error) {
    items = [];
    grid.replaceChildren();
    status.textContent = 'Could not load items.';
    if (isCart) document.querySelector('#cart-total').textContent = '—';
    document.querySelector('#error-message').textContent = error.message;
    errorBox.hidden = false;
  } finally {
    setBusy(false);
    if (checkout && !loaded) checkout.disabled = true;
  }
}

if (checkout) checkout.addEventListener('click', () => mutate(async () => {
  await request('orders', { method: 'POST' });
}, 'Purchase saved to your order history. Your cart is now empty. No payment was charged.'));

document.querySelector('#retry').addEventListener('click', () => { if (!busy) load(); });
load();
