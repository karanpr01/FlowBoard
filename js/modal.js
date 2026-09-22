import { createTask, updateTask, getTask } from './tasks.js';
import { render } from './render.js';
import { showToast } from './toast.js';

const dialog = document.querySelector('#taskDialog');
const form = document.querySelector('#taskForm');
const submitBtn = document.querySelector('#submitBtn');
const titleEl = document.querySelector('#taskDialogTitle');
const FIELDS = { title: 'errTitle', description: 'errDesc', due: 'errDue', tags: 'errTags' };

let editingId = null;

dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));

export function openTaskForm(status = 'todo', taskId = null) {
  editingId = taskId;
  form.reset();
  clearErrors();
  submitBtn.disabled = false;

  const task = taskId ? getTask(taskId) : null;
  titleEl.textContent = task ? 'Edit task' : 'New task';
  submitBtn.textContent = task ? 'Save changes' : 'Create task';

  if (task) {
    form.elements.title.value = task.title;
    form.elements.description.value = task.description;
    form.elements.priority.value = task.priority;
    form.elements.due.value = task.due;
    form.elements.status.value = task.status;
    form.elements.tags.value = task.tags.join(', ');
  } else {
    form.elements.status.value = status;
  }

  dialog.showModal();
  form.elements.title.focus();
}

function readForm() {
  const f = form.elements;
  return {
    title: f.title.value.trim(),
    description: f.description.value.trim(),
    priority: f.priority.value,
    due: f.due.value,
    status: f.status.value,
    tags: f.tags.value.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5),
  };
}

function validate(data) {
  const errors = {};
  if (!data.title) errors.title = 'Enter a title so you can find this task later.';
  else if (data.title.length > 80) errors.title = 'Keep the title to 80 characters or fewer.';
  if (data.description.length > 500) errors.description = 'Keep the description to 500 characters or fewer.';
  if (form.elements.due.validity.badInput) errors.due = 'Enter a complete, valid date.';
  if (data.tags.length > 5) errors.tags = 'Use up to 5 tags.';
  else if (data.tags.some((t) => t.length > 20)) errors.tags = 'Each tag can be up to 20 characters.';
  return errors;
}

function clearErrors() {
  Object.entries(FIELDS).forEach(([name, errId]) => {
    document.querySelector(`#${errId}`).textContent = '';
    form.elements[name].removeAttribute('aria-invalid');
  });
}

function showErrors(errors) {
  clearErrors();
  Object.entries(errors).forEach(([name, message]) => {
    document.querySelector(`#${FIELDS[name]}`).textContent = message;
    form.elements[name].setAttribute('aria-invalid', 'true');
  });
  form.elements[Object.keys(errors)[0]].focus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = readForm();
  const errors = validate(data);
  if (Object.keys(errors).length) return showErrors(errors);

  submitBtn.disabled = true;
  const saved = editingId ? updateTask(editingId, data) : createTask(data);
  const message = editingId
    ? (saved ? 'Task updated.' : "Changes made, but we couldn't save them.")
    : (saved ? 'Task created successfully.' : "Task added, but we couldn't save it.");

  dialog.close();
  render();
  showToast(message, { type: saved ? 'success' : 'error' });
  editingId = null;
});