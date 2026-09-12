const preloader = document.createElement('div');
preloader.className = 'site-preloader';
preloader.setAttribute('role', 'status');
preloader.setAttribute('aria-label', 'Loading page');
preloader.innerHTML = '<span class="loader-ring" aria-hidden="true"></span><span>Loading Learnico…</span>';
document.body.prepend(preloader);
function hidePreloader() {
  preloader.classList.add('is-done');
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  setTimeout(() => preloader.remove(), 700);
}
if (document.readyState === 'complete') hidePreloader();
else window.addEventListener('load', hidePreloader, { once: true });

const header = document.querySelector('.header, .catalog-header');
const nav = header?.querySelector('nav');
if (header && nav) {
  const toggle = document.createElement('button');
  toggle.className = 'menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'mobile-navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  nav.id = 'mobile-navigation';
  nav.parentElement.append(toggle);
  const scrim = document.createElement('div');
  scrim.className = 'nav-scrim';
  document.body.append(scrim);
  const close = () => {
    header.classList.remove('menu-open');
    document.body.classList.remove('menu-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  toggle.addEventListener('click', () => {
    const open = !header.classList.contains('menu-open');
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  scrim.addEventListener('click', close);
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  window.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  window.matchMedia('(min-width: 769px)').addEventListener('change', close);
}

const dialog = document.createElement('dialog');
dialog.className = 'detail-dialog';
dialog.setAttribute('aria-labelledby', 'detail-title');
document.body.append(dialog);
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.addEventListener('course-details', event => {
  const course = event.detail;
  const inner = document.createElement('div');
  inner.className = 'detail-inner';
  const close = document.createElement('button');
  close.className = 'dialog-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Close course details');
  close.textContent = '×';
  close.addEventListener('click', () => dialog.close());
  const image = document.createElement('img');
  image.src = course.image;
  image.alt = '';
  const title = document.createElement('h2');
  title.id = 'detail-title';
  title.textContent = course.title;
  const description = document.createElement('p');
  description.textContent = course.description;
  const facts = document.createElement('p');
  facts.textContent = course.level + ' · ' + course.duration + ' hours · Rating ' + course.rating.toFixed(1) + '/5';
  const price = document.createElement('strong');
  price.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(course.price);
  inner.append(close, image, title, description, facts, price);
  dialog.replaceChildren(inner);
  dialog.showModal();
});
