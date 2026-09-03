export function bindForm(form, validate, submit) {
  const submitButton = form.querySelector('[type="submit"]');
  let busy = false;
  function errors() {
    const result = validate();
    for (const input of form.querySelectorAll('input, select, textarea')) {
      if (!input.disabled && !input.validity.valid && !result[input.name]) result[input.name] = input.validationMessage;
    }
    return result;
  }
  function show(fields) {
    for (const message of form.querySelectorAll('[data-error]')) {
      const name = message.dataset.error;
      message.textContent = fields[name] || '';
      const input = form.elements.namedItem(name);
      if (input?.setAttribute) input.setAttribute('aria-invalid', String(Boolean(fields[name])));
    }
  }
  function refresh() {
    submitButton.disabled = busy || Object.keys(errors()).length > 0;
  }
  form.addEventListener('input', event => {
    const name = event.target.name;
    const message = form.querySelector('[data-error="' + name + '"]');
    if (message) message.textContent = '';
    event.target.removeAttribute('aria-invalid');
    refresh();
  });
  form.addEventListener('change', refresh);
  form.addEventListener('focusout', event => {
    if (!event.target.name) return;
    const message = form.querySelector('[data-error="' + event.target.name + '"]');
    if (message) {
      const error = errors()[event.target.name] || '';
      message.textContent = error;
      event.target.setAttribute('aria-invalid', String(Boolean(error)));
    }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const fields = errors();
    show(fields);
    if (Object.keys(fields).length) return refresh();
    busy = true;
    refresh();
    form.setAttribute('aria-busy', 'true');
    try { await submit(); }
    catch (error) {
      show(error.fields || {});
      const notice = document.querySelector('#notice');
      notice.textContent = error.message;
      notice.classList.add('is-error');
    } finally {
      busy = false;
      form.setAttribute('aria-busy', 'false');
      refresh();
    }
  });
  refresh();
  return { refresh, show };
}

export const formData = form => Object.fromEntries(new FormData(form));
