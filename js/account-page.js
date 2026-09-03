import { request } from './api.js';
import { currentUser, saveSession } from './session.js';
import { bindForm, formData } from './forms.js';
import { registrationErrors, passwordError } from '../shared/validation.mjs';
import { element, money, announce } from './ui.js';

const register = document.querySelector('#register-form');
const login = document.querySelector('#login-form');
const fields = register.elements;
let attempts = 0;
let availableNickname = '';
let nicknameBusy = false;
let nicknameRevision = 0;
let nicknameTimer;
let registering = false;

function registrationData() {
  return { ...formData(register), acceptedTerms: fields.acceptedTerms.checked };
}

const registration = bindForm(register, () => {
  const errors = registrationErrors(registrationData());
  if (!fields.nickname.value || availableNickname !== fields.nickname.value.trim() || nicknameBusy) errors.nickname = 'Generate or enter an available nickname.';
  if (fields.passwordMode.value === 'generated' && !fields.savedPassword.checked) errors.savedPassword = 'Save your generated password before continuing.';
  return errors;
}, async () => {
  registering = true;
  try {
    const { data } = await request('users', { method: 'POST', body: registrationData() });
    saveSession(data);
    resetRegistration();
    announce('Account created. You are signed in.');
  } finally { registering = false; }
});

const signIn = bindForm(login, () => ({}), async () => {
  const { data } = await request('auth/login', { method: 'POST', body: formData(login) });
  saveSession(data);
  login.reset();
  signIn.refresh();
  announce('Signed in.');
});

async function checkNickname() {
  const revision = ++nicknameRevision;
  const nickname = fields.nickname.value.trim();
  availableNickname = '';
  nicknameBusy = true;
  fields.nickname.setAttribute('aria-busy', 'true');
  registration.refresh();
  try {
    const { data } = await request('availability?nickname=' + encodeURIComponent(nickname));
    if (revision !== nicknameRevision) return;
    if (data.available) availableNickname = nickname;
    const message = register.querySelector('[data-error="nickname"]');
    message.textContent = data.available ? '' : 'This nickname is already taken.';
  } catch (error) {
    if (revision === nicknameRevision) register.querySelector('[data-error="nickname"]').textContent = error.message;
  } finally {
    if (revision === nicknameRevision) { nicknameBusy = false; fields.nickname.setAttribute('aria-busy', 'false'); registration.refresh(); }
  }
}

function generateNickname() {
  if (registering || nicknameBusy || attempts >= 5) return;
  if (!fields.firstName.value.trim() || !fields.lastName.value.trim()) {
    register.querySelector('[data-error="nickname"]').textContent = 'Enter your first and last name first.';
    return;
  }
  attempts++;
  const prefix = (fields.firstName.value.trim().slice(0, 3) + fields.lastName.value.trim().slice(0, 3)).replace(/[^\p{L}\p{N}]/gu, '');
  fields.nickname.value = prefix + crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  fields.nickname.readOnly = attempts < 5;
  document.querySelector('#generate-nickname').disabled = attempts >= 5;
  document.querySelector('#nickname-status').textContent = attempts < 5 ? 'Generation ' + attempts + ' of 5.' : 'Five generations used. You may now edit the nickname yourself.';
  checkNickname();
}

function resetRegistration() {
  register.reset();
  attempts = 0;
  availableNickname = '';
  nicknameBusy = false;
  nicknameRevision++;
  clearTimeout(nicknameTimer);
  fields.nickname.readOnly = true;
  fields.nickname.setAttribute('aria-busy', 'false');
  document.querySelector('#generate-nickname').disabled = false;
  document.querySelector('#nickname-status').textContent = 'Enter your first and last name. After 5 generations, you can edit the nickname.';
  fields.password.readOnly = false;
  fields.confirmPassword.disabled = false;
  fields.savedPassword.disabled = true;
  document.querySelector('#confirmation-field').hidden = false;
  document.querySelector('#generated-confirmation').hidden = true;
  document.querySelector('#generate-password').hidden = true;
  agreement.setAttribute('aria-expanded', 'false');
  agreementText.hidden = true;
  agreementText.scrollTop = 0;
  fields.acceptedTerms.disabled = true;
  document.querySelector('#terms-help').textContent = 'Open the agreement and read to the end to enable this checkbox.';
  registration.show({});
  registration.refresh();
}

document.querySelector('#generate-nickname').addEventListener('click', generateNickname);
fields.lastName.addEventListener('blur', () => { if (!attempts) generateNickname(); });
fields.firstName.addEventListener('blur', () => { if (!attempts && fields.lastName.value.trim()) generateNickname(); });
fields.nickname.addEventListener('input', () => {
  availableNickname = '';
  nicknameBusy = true;
  fields.nickname.setAttribute('aria-busy', 'true');
  nicknameRevision++;
  clearTimeout(nicknameTimer);
  nicknameTimer = setTimeout(checkNickname, 250);
  registration.refresh();
});

function randomIndex(length) {
  const limit = Math.floor(4294967296 / length) * length;
  let value;
  do { value = crypto.getRandomValues(new Uint32Array(1))[0]; } while (value >= limit);
  return value % length;
}

function generatePassword() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*-_?';
  let password;
  do {
    password = Array.from({ length: 16 }, () => alphabet[randomIndex(alphabet.length)]).join('');
  } while (passwordError(password));
  fields.password.value = password;
  fields.savedPassword.checked = false;
  registration.show({});
  registration.refresh();
}

fields.passwordMode.addEventListener('change', () => {
  const generated = fields.passwordMode.value === 'generated';
  fields.password.readOnly = generated;
  fields.confirmPassword.disabled = generated;
  fields.confirmPassword.value = '';
  fields.savedPassword.disabled = !generated;
  fields.savedPassword.checked = false;
  document.querySelector('#confirmation-field').hidden = generated;
  document.querySelector('#generated-confirmation').hidden = !generated;
  document.querySelector('#generate-password').hidden = !generated;
  if (generated) generatePassword();
  else fields.password.value = '';
  registration.show({});
  registration.refresh();
});
document.querySelector('#generate-password').addEventListener('click', generatePassword);
document.querySelector('#show-password').addEventListener('click', event => {
  const show = fields.password.type === 'password';
  fields.password.type = show ? 'text' : 'password';
  event.target.textContent = show ? 'Hide password' : 'Show password';
  event.target.setAttribute('aria-pressed', String(show));
});
for (const event of ['paste', 'drop']) fields.confirmPassword.addEventListener(event, event => {
  event.preventDefault();
  register.querySelector('[data-error="confirmPassword"]').textContent = 'Type the confirmation yourself; pasting is disabled by the assignment.';
});
fields.confirmPassword.addEventListener('beforeinput', event => {
  if (['insertFromPaste', 'insertFromDrop'].includes(event.inputType)) event.preventDefault();
});

const agreement = document.querySelector('#agreement-toggle');
const agreementText = document.querySelector('#agreement-text');
function checkAgreement() {
  if (agreement.getAttribute('aria-expanded') === 'true' && agreementText.scrollHeight - agreementText.scrollTop <= agreementText.clientHeight + 2) {
    fields.acceptedTerms.disabled = false;
    document.querySelector('#terms-help').textContent = 'You have reached the end. Confirm your acceptance above.';
  }
}
agreement.addEventListener('click', () => {
  const open = agreement.getAttribute('aria-expanded') !== 'true';
  agreement.setAttribute('aria-expanded', String(open));
  agreementText.hidden = !open;
  if (open) requestAnimationFrame(checkAgreement);
});
agreementText.addEventListener('scroll', checkAgreement);
window.addEventListener('resize', checkAgreement);

let accountRevision = 0;
async function renderAccount() {
  const revision = ++accountRevision;
  try {
    const user = await currentUser();
    if (revision !== accountRevision) return;
    document.querySelector('#account-forms').hidden = Boolean(user);
    document.querySelector('#account-summary').hidden = !user;
    const orders = document.querySelector('#orders');
    orders.replaceChildren();
    if (!user) return;
    orders.append(element('p', '', 'Loading purchases…'));
    const { data } = await request('orders');
    if (revision !== accountRevision) return;
    orders.replaceChildren();
    if (!data.length) orders.append(element('p', '', 'No purchases yet. Explore the course catalog to get started.'));
    for (const order of data) {
      const item = element('article', 'review-item');
      item.append(element('h3', '', 'Order · ' + new Date(order.createdAt).toLocaleDateString()));
      for (const course of order.items) item.append(element('p', '', course.title + ' × ' + course.quantity));
      item.append(element('strong', '', money.format(order.totalCents / 100)));
      orders.append(item);
    }
  } catch (error) { if (revision === accountRevision) announce(error.message, true); }
}

window.addEventListener('learnico:session-change', renderAccount);
renderAccount();
