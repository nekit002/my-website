import { request } from './api.js';
import { requireRole } from './session.js';
import { bindForm, formData } from './forms.js';
import { courseErrors } from '../shared/validation.mjs';
import { element, button, announce } from './ui.js';

const courseDialog = document.querySelector('#course-dialog');
document.querySelector('#open-course-dialog').addEventListener('click', () => courseDialog.showModal());
document.querySelector('#close-course-dialog').addEventListener('click', () => courseDialog.close());
courseDialog.addEventListener('click', event => { if (event.target === courseDialog) courseDialog.close(); });
const form = document.querySelector('#course-form');
const deletion = document.querySelector('#delete-course-form');
const selection = document.querySelector('#edit-course');
const courseFilter = document.querySelector('#filter-course');
const userFilter = document.querySelector('#filter-user');
let courses = [];
let reviewController;
let reviewRevision = 0;
let changingCourse = false;

function payload() {
  const data = formData(form);
  for (const name of ['price', 'duration', 'rating']) data[name] = data[name] === '' ? NaN : Number(data[name]);
  return data;
}

const editor = bindForm(form, () => {
  const errors = courseErrors(payload());
  if (changingCourse) errors.title = 'Wait until the current operation finishes.';
  return errors;
}, async () => {
  const id = selection.value;
  changingCourse = true;
  selection.disabled = true;
  removeForm.refresh();
  try {
    await request('courses' + (id ? '/' + id : ''), { method: id ? 'PUT' : 'POST', body: payload() });
    await loadCourses();
    resetEditor();
    announce(id ? 'Course updated.' : 'Course added.');
    courseDialog.close();
  } finally {
    changingCourse = false;
    selection.disabled = false;
    editor.refresh();
    removeForm.refresh();
  }
});

const removeForm = bindForm(deletion, () => selection.value && deletion.elements.confirmed.checked && !changingCourse ? {} : { confirmed: 'Select a course and confirm its deletion.' }, async () => {
  changingCourse = true;
  selection.disabled = true;
  editor.refresh();
  try {
    await request('courses/' + selection.value, { method: 'DELETE' });
    await loadCourses();
    resetEditor();
    announce('Course deleted. Existing orders keep their purchase details.');
    courseDialog.close();
    await loadReviews();
  } finally {
    changingCourse = false;
    selection.disabled = false;
    editor.refresh();
    removeForm.refresh();
  }
});

function resetEditor() {
  selection.value = '';
  form.reset();
  deletion.reset();
  document.querySelector('#save-course').textContent = 'Add course';
  editor.show({});
  removeForm.show({});
  editor.refresh();
  removeForm.refresh();
}

function setOptions(select, items, placeholder) {
  const previous = select.value;
  const first = element('option', '', placeholder);
  first.value = '';
  select.replaceChildren(first);
  for (const item of items) {
    const option = element('option', '', item.title || item.nickname);
    option.value = item.id;
    select.append(option);
  }
  select.value = [...select.options].some(option => option.value === previous) ? previous : '';
}

async function loadCourses() {
  courses = (await request('courses?_sort=title&_order=asc')).data;
  setOptions(selection, courses, 'Add a new course');
  setOptions(courseFilter, courses, 'All courses');
  const categories = document.querySelector('#category-names');
  categories.replaceChildren(...[...new Set(courses.map(course => course.category))].map(category => {
    const option = element('option');
    option.value = category;
    return option;
  }));
}

selection.addEventListener('change', () => {
  if (!selection.value) return resetEditor();
  const course = courses.find(course => String(course.id) === selection.value);
  for (const name of ['title', 'description', 'category', 'price', 'duration', 'rating', 'level', 'image']) form.elements[name].value = course[name];
  deletion.reset();
  document.querySelector('#save-course').textContent = 'Save changes';
  editor.show({});
  removeForm.show({});
  editor.refresh();
  removeForm.refresh();
});

async function loadReviews() {
  reviewController?.abort();
  reviewController = new AbortController();
  const revision = ++reviewRevision;
  const status = document.querySelector('#moderation-status');
  const list = document.querySelector('#review-list');
  status.textContent = 'Loading reviews…';
  list.replaceChildren();
  const params = new URLSearchParams();
  if (courseFilter.value) params.set('courseId', courseFilter.value);
  if (userFilter.value) params.set('userId', userFilter.value);
  try {
    const { data } = await request('feedback?' + params, { signal: reviewController.signal });
    if (revision !== reviewRevision) return;
    status.textContent = data.length ? data.length + ' reviews found' : 'No reviews match these filters.';
    for (const review of data) {
      const item = element('article', 'review-item');
      const course = courses.find(course => course.id === review.courseId);
      const confirm = element('input');
      confirm.type = 'checkbox';
      const label = element('label', 'check-label');
      label.append(confirm, document.createTextNode('Confirm review deletion'));
      const remove = button('Delete review', async () => {
        remove.disabled = true;
        try {
          await request('feedback/' + review.id, { method: 'DELETE' });
          announce('Review deleted.');
          await loadReviews();
        } catch (error) {
          announce(error.message, true);
          remove.disabled = !confirm.checked;
        }
      });
      remove.disabled = true;
      confirm.addEventListener('change', () => { remove.disabled = !confirm.checked; });
      item.append(element('h3', '', course?.title || 'Deleted course #' + review.courseId), element('p', '', 'By ' + review.nickname), element('p', '', review.text), label, remove);
      list.append(item);
    }
  } catch (error) {
    if (error.name !== 'AbortError' && revision === reviewRevision) status.textContent = error.message;
  }
}

courseFilter.addEventListener('change', loadReviews);
userFilter.addEventListener('change', loadReviews);
document.querySelector('#retry-reviews').addEventListener('click', loadReviews);
try {
  await requireRole('admin');
  await loadCourses();
  setOptions(userFilter, (await request('users')).data, 'All users');
  document.querySelector('#admin-panel').hidden = false;
  await loadReviews();
} catch (error) { announce(error.message, true); }
