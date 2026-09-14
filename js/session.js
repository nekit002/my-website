import { request } from './api.js';

const tokenKey = 'learnico-lab10-token';
const userKey = 'learnico-lab10-user';

export function storedUser() {
  try { return JSON.parse(localStorage.getItem(userKey) || 'null'); }
  catch { return null; }
}

export function saveUser(user) {
  localStorage.setItem(userKey, JSON.stringify(user));
  window.dispatchEvent(new Event('learnico:session-change'));
}

export async function currentUser() {
  if (!localStorage.getItem(tokenKey)) return null;
  try {
    const user = (await request('auth/me')).data;
    if (JSON.stringify(user) !== JSON.stringify(storedUser())) saveUser(user);
    return user;
  } catch (error) {
    if (error.status === 401) {
      clearSession();
      return null;
    }
    throw error;
  }
}

export function saveSession(data) {
  localStorage.setItem(tokenKey, data.token);
  saveUser(data.user);
}

export function clearSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  window.dispatchEvent(new Event('learnico:session-change'));
}

export async function requireRole(role) {
  const user = await currentUser();
  if (!user) throw new Error('Sign in on the Account page to continue.');
  if (role && user.role !== role) throw new Error(role === 'admin' ? 'Administrator access required.' : 'Administrators cannot submit reviews.');
  return user;
}
