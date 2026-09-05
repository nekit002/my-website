import { request } from './api.js';
import { requireRole } from './session.js';
import { bindForm, formData } from './forms.js';
import { feedbackErrors } from '../shared/validation.mjs';
import { element, announce } from './ui.js';

const form = document.querySelector('#review-form');
const select = form.elements.courseId;
const payload = () => ({ ...formData(form), courseId: Number(select.value) });

async function loadReviews() {
  const { data } = await request('feedback');
  const list = document.querySelector('#review-list');
  list.replaceChildren();
  if (!data.length) list.append(element('p', '', 'You have not posted any reviews yet.'));
  for (const review of data) {
    const item = element('article', 'review-item');
    const option = [...select.options].find(option => Number(option.value) === review.courseId);
    item.append(element('h3', '', option?.textContent || 'Course #' + review.courseId), element('p', '', review.text));
    list.append(item);
  }
}

bindForm(form, () => feedbackErrors(payload()), async () => {
  await request('feedback', { method: 'POST', body: payload() });
  form.reset();
  announce('Your review has been saved.');
  await loadReviews();
});

try {
  await requireRole('customer');
  const { data } = await request('purchased-courses');
  for (const course of data) {
    const option = element('option', '', course.title);
    option.value = course.id;
    select.append(option);
  }
  document.querySelector('#reviews-panel').hidden = false;
  document.querySelector('#my-reviews').hidden = false;
  if (!data.length) announce('Buy a course first to unlock its review form.');
  await loadReviews();
} catch (error) { announce(error.message, true); }
