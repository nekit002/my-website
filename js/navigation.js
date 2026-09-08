import './interactions.js';
import { currentUser, clearSession } from './session.js';
import { request } from './api.js';
import { showProfileButton } from './profile.js';

const logout = document.querySelector('#logout');

async function showSession() {
  try {
    const user = await currentUser();
    for (const link of document.querySelectorAll('[data-admin-link]')) link.hidden = user?.role !== 'admin';
    for (const status of document.querySelectorAll('[data-session-status]')) status.textContent = user ? 'Signed in as ' + user.nickname : 'Guest — sign in to save courses and buy.';
    if (logout) logout.hidden = !user;
    showProfileButton(user);
  } catch (error) {
    for (const status of document.querySelectorAll('[data-session-status]')) status.textContent = error.message;
  }
}

if (logout) logout.addEventListener('click', async () => {
  logout.disabled = true;
  try {
    await request('auth/logout', { method: 'POST' });
    clearSession();
  } catch (error) {
    const notice = document.querySelector('#notice');
    if (notice) notice.textContent = error.message;
  } finally {
    logout.disabled = false;
  }
});

window.addEventListener('learnico:session-change', showSession);
showSession();
