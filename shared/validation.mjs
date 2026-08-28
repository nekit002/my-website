import { commonPasswords } from './common-passwords.mjs';

export const normalizePhone = value => String(value || '').replace(/[\s()-]/g, '');
export const normalizeEmail = value => String(value || '').trim().toLowerCase();
const text = value => String(value || '').trim();
const namePattern = /^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u;

export function ageOn(birthDate, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return -1;
  const birth = new Date(`${birthDate}T12:00:00`);
  if (!Number.isFinite(birth.getTime()) || birth.toISOString().slice(0, 10) !== birthDate) return -1;
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

export function passwordError(value) {
  if (commonPasswords.has(String(value).toLowerCase())) return 'This password is in the 2024 TOP-100 list.';
  if (!/^(?=.{8,20}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/.test(value || '')) {
    return 'Use 8–20 characters, an uppercase and lowercase Latin letter, a digit and a special character; no spaces.';
  }
  return '';
}

export function registrationErrors(data, today = new Date()) {
  const errors = {};
  for (const field of ['firstName', 'lastName', 'middleName']) {
    const value = text(data[field]);
    if ((!value && field !== 'middleName') || (value && (!namePattern.test(value) || value.length > 60))) errors[field] = 'Use letters, spaces, hyphens or apostrophes (up to 60 characters).';
  }
  if (!/^\+375[1-9]\d{8}$/.test(normalizePhone(data.phone))) errors.phone = 'Enter a Belarus number, for example +375 29 123-45-67.';
  if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(normalizeEmail(data.email)) || text(data.email).length > 254) errors.email = 'Enter a valid email address.';
  const age = ageOn(data.birthDate || '', today);
  if (age < 16 || age > 120) errors.birthDate = 'You must be at least 16 years old; enter a valid birth date.';
  const password = passwordError(data.password);
  if (password) errors.password = password;
  if (!['manual', 'generated'].includes(data.passwordMode)) errors.passwordMode = 'Choose how to create your password.';
  if (data.passwordMode === 'manual' && data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match. Type the confirmation yourself.';
  if (!/^[\p{L}\p{N}_-]{3,30}$/u.test(text(data.nickname))) errors.nickname = 'Use 3–30 letters, digits, underscores or hyphens.';
  if (data.acceptedTerms !== true) errors.acceptedTerms = 'Read and accept the user agreement.';
  return errors;
}

export function profileErrors(data, today = new Date()) {
  const errors = {};
  for (const field of ['firstName', 'lastName', 'middleName']) {
    const value = text(data[field]);
    if ((!value && field !== 'middleName') || (value && (!namePattern.test(value) || value.length > 60))) errors[field] = 'Use letters, spaces, hyphens or apostrophes (up to 60 characters).';
  }
  if (!/^\+375[1-9]\d{8}$/.test(normalizePhone(data.phone))) errors.phone = 'Enter a Belarus number, for example +375 29 123-45-67.';
  if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(normalizeEmail(data.email)) || text(data.email).length > 254) errors.email = 'Enter a valid email address.';
  const age = ageOn(data.birthDate || '', today);
  if (age < 16 || age > 120) errors.birthDate = 'You must be at least 16 years old; enter a valid birth date.';
  if (!/^[\p{L}\p{N}_-]{3,30}$/u.test(text(data.nickname))) errors.nickname = 'Use 3–30 letters, digits, underscores or hyphens.';
  return errors;
}

export function courseErrors(data) {
  const errors = {};
  for (const [field, min, max] of [['title', 3, 100], ['description', 10, 1000], ['category', 2, 60]]) {
    if (text(data[field]).length < min || text(data[field]).length > max) errors[field] = `Use ${min}–${max} characters.`;
  }
  if (!['Beginner', 'Intermediate', 'Advanced'].includes(data.level)) errors.level = 'Select a level.';
  if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0 || data.price > 100000 || Math.abs(data.price * 100 - Math.round(data.price * 100)) > 0.000001) errors.price = 'Enter a price from 0 to 100000 with up to two decimal places.';
  if (!Number.isInteger(data.duration) || data.duration < 1 || data.duration > 1000) errors.duration = 'Enter a whole number of hours from 1 to 1000.';
  if (typeof data.rating !== 'number' || !Number.isFinite(data.rating) || data.rating < 0 || data.rating > 5) errors.rating = 'Enter a rating from 0 to 5.';
  if (!/^(?:images\/[A-Za-z0-9_-]+\.(?:png|jpg|jpeg|webp|svg)|https:\/\/[^\s]+)$/i.test(text(data.image))) errors.image = 'Use an images/file.png path or an HTTPS image URL.';
  return errors;
}

export function feedbackErrors(data) {
  const errors = {};
  if (!Number.isInteger(data.courseId) || data.courseId < 1) errors.courseId = 'Select a purchased course.';
  if (text(data.text).length < 20 || text(data.text).length > 2000) errors.text = 'Write between 20 and 2000 characters.';
  return errors;
}
