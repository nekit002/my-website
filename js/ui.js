export const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function element(tag, className = '', text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function button(text, action) {
  const node = element('button', 'button', text);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}

export function courseCard(course) {
  const card = element('article', 'catalog-card');
  card.dataset.id = course.id;
  const image = element('img', 'catalog-image');
  image.src = course.image;
  image.alt = `Illustration for ${course.title}`;
  image.width = 400;
  image.height = 240;
  image.loading = 'lazy';
  const body = element('div', 'catalog-card-body');
  body.append(
    element('span', 'tag', course.category),
    element('h2', '', course.title),
    element('p', 'catalog-description', course.description),
    element('p', 'catalog-facts', `${course.level} · ${course.duration} hours · Rating ${course.rating.toFixed(1)}/5`),
    element('p', 'catalog-price', money.format(course.price))
  );
  const actions = element('div', 'card-actions');
  const details = button('Details', () => document.dispatchEvent(new CustomEvent('course-details', { detail: course })));
  details.dataset.action = 'details';
  actions.append(details);
  body.append(actions);
  card.append(image, body);
  card.addEventListener('click', event => {
    if (!event.target.closest('button, a, input')) document.dispatchEvent(new CustomEvent('course-details', { detail: course }));
  });
  return { card, actions };
}

export function announce(message, isError = false) {
  const notice = document.querySelector('#notice');
  notice.textContent = message;
  notice.classList.toggle('is-error', isError);
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = element('div', 'toast-stack');
    stack.setAttribute('aria-live', 'polite');
    document.body.append(stack);
  }
  const toast = element('div', 'toast' + (isError ? ' is-error' : ''), message);
  stack.append(toast);
  setTimeout(() => toast.remove(), 4500);
}
