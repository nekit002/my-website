import { request } from './api.js';
import { currentUser, saveUser, storedUser } from './session.js';
import { profileErrors } from '../shared/validation.mjs';
import { getTheme, initPreferences, resetSettings, setLanguage, setTheme } from './preferences.js';

const host = document.querySelector('.header-tools, .catalog-nav');
const controls = document.createElement('div');
controls.className = 'preference-controls';
controls.setAttribute('aria-label', 'Language and theme');
controls.innerHTML = '<button type="button" data-language="en" aria-label="English">EN</button><button type="button" data-language="ru" aria-label="Русский">RU</button><button type="button" data-theme-toggle></button><button type="button" data-profile-open aria-label="Profile" hidden><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg></button>';
host?.append(controls);

controls.addEventListener('click', event => {
  const language = event.target.closest('[data-language]');
  if (language) setLanguage(language.dataset.language);
  if (event.target.closest('[data-theme-toggle]')) setTheme(getTheme() === 'dark' ? 'light' : 'dark');
});

const dialog = document.createElement('dialog');
dialog.className = 'profile-dialog';
dialog.setAttribute('aria-labelledby', 'profile-title');
dialog.innerHTML = `<div class="profile-inner">
  <div class="profile-heading"><h2 id="profile-title">Profile</h2><button type="button" data-profile-close aria-label="Close">×</button></div>
  <p>Update your personal information. Your password is never shown here.</p>
  <form id="profile-form" novalidate>
    <div class="profile-fields">
      <label>First name *<input name="firstName" required maxlength="60" autocomplete="given-name"></label>
      <label>Last name *<input name="lastName" required maxlength="60" autocomplete="family-name"></label>
      <label>Middle name (optional)<input name="middleName" maxlength="60" autocomplete="additional-name"></label>
      <label>Date of birth *<input name="birthDate" type="date" required autocomplete="bday"></label>
      <label>Belarus phone *<input name="phone" type="tel" required autocomplete="tel"></label>
      <label>Email *<input name="email" type="email" required autocomplete="email"></label>
      <label>Nickname *<input name="nickname" required minlength="3" maxlength="30" autocomplete="username"></label>
    </div>
    <p id="profile-message" role="status" aria-live="polite"></p>
    <div class="profile-actions"><button class="button button-green" type="submit">Save changes</button><button class="button" type="button" data-reset-settings>Reset settings</button></div>
  </form>
</div>`;
document.body.append(dialog);
const form = dialog.querySelector('form');
const message = dialog.querySelector('#profile-message');
controls.querySelector('[data-profile-open]').addEventListener('click', async () => {
  const user = storedUser();
  if (!user) return;
  for (const input of form.elements) {
    if (input.name) input.value = user[input.name] || '';
    input.removeAttribute('aria-invalid');
  }
  message.textContent = '';
  dialog.showModal();
  try {
    const latest = await currentUser();
    if (!latest || !dialog.open) return;
    for (const input of form.elements) if (input.name) input.value = latest[input.name] || '';
  } catch (error) { message.textContent = error.message; }
});
dialog.querySelector('[data-profile-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.querySelector('[data-reset-settings]').addEventListener('click', () => {
  resetSettings();
  message.textContent = 'Settings reset.';
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const errors = profileErrors(data);
  for (const input of form.elements) if (input.name) input.setAttribute('aria-invalid', String(Boolean(errors[input.name])));
  if (Object.keys(errors).length) {
    message.textContent = Object.values(errors)[0];
    return;
  }
  const save = form.querySelector('[type="submit"]');
  save.disabled = true;
  message.textContent = '';
  try {
    const response = await request('users/me', { method: 'PUT', body: data });
    saveUser(response.data);
    message.textContent = 'Profile saved.';
  } catch (error) {
    for (const input of form.elements) if (input.name) input.setAttribute('aria-invalid', String(Boolean(error.fields?.[input.name])));
    message.textContent = Object.values(error.fields || {})[0] || error.message;
  } finally { save.disabled = false; }
});

export function showProfileButton(user) {
  controls.querySelector('[data-profile-open]').hidden = !user;
}

initPreferences();
