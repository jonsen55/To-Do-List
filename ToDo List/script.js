// To-Do List App using localStorage
// Author: (Your Name)

// Select DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const tasksCount = document.getElementById('tasks-count');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Key for localStorage
const STORAGE_KEY = 'todo-tasks';
const DARK_MODE_KEY = 'todo-dark-mode';

// App state
let tasks = [];
let currentFilter = 'all'; // all | active | completed

// Utility: Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Utility: Load tasks from localStorage
function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  tasks = data ? JSON.parse(data) : [];
}

// Utility: Save dark mode preference
function saveDarkMode(isDark) {
  localStorage.setItem(DARK_MODE_KEY, isDark ? '1' : '0');
}

// Utility: Load dark mode preference
function loadDarkMode() {
  return localStorage.getItem(DARK_MODE_KEY) === '1';
}

// Render the task list based on filter
function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks;
  if (currentFilter === 'active') {
    filtered = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filtered = tasks.filter(t => t.completed);
  }
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompleted(task.id));

    // Task text or input (for editing)
    let textElem;
    if (task.editing) {
      textElem = document.createElement('input');
      textElem.type = 'text';
      textElem.value = task.text;
      textElem.className = 'task-text-edit';
      textElem.maxLength = 100;
      textElem.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveEdit(task.id, textElem.value);
        if (e.key === 'Escape') cancelEdit(task.id);
      });
      setTimeout(() => textElem.focus(), 0);
    } else {
      textElem = document.createElement('span');
      textElem.className = 'task-text';
      textElem.textContent = task.text;
    }

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    if (task.editing) {
      // Save button
      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-btn';
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', () => saveEdit(task.id, textElem.value));
      actions.appendChild(saveBtn);
      // Cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'cancel-btn';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => cancelEdit(task.id));
      actions.appendChild(cancelBtn);
    } else {
      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => startEdit(task.id));
      actions.appendChild(editBtn);
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));
      actions.appendChild(deleteBtn);
    }

    li.appendChild(checkbox);
    li.appendChild(textElem);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
  updateTasksCount();
}

// Add a new task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({
    id: Date.now().toString(),
    text,
    completed: false,
    editing: false
  });
  saveTasks();
  renderTasks();
  taskInput.value = '';
}

// Toggle task completed
function toggleTaskCompleted(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Start editing a task
function startEdit(id) {
  tasks.forEach(t => t.editing = false);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.editing = true;
    renderTasks();
  }
}

// Save edit
function saveEdit(id, newText) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    const text = newText.trim();
    if (text) {
      task.text = text;
      task.editing = false;
      saveTasks();
      renderTasks();
    }
  }
}

// Cancel edit
function cancelEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.editing = false;
    renderTasks();
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Clear all tasks
function clearAllTasks() {
  if (confirm('Delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Filter tasks
function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  renderTasks();
}

// Update tasks count
function updateTasksCount() {
  const count = tasks.filter(t => !t.completed).length;
  tasksCount.textContent = `${count} task${count !== 1 ? 's' : ''} left`;
}

// Dark mode toggle
function toggleDarkMode() {
  const isDark = !document.body.classList.contains('dark');
  document.body.classList.toggle('dark', isDark);
  saveDarkMode(isDark);
  darkModeToggle.textContent = isDark ? '☀️' : '🌙';
}

// Initialize dark mode on load
function initDarkMode() {
  const isDark = loadDarkMode();
  document.body.classList.toggle('dark', isDark);
  darkModeToggle.textContent = isDark ? '☀️' : '🌙';
}

// Keyboard: Enter to add task
function handleInputKey(e) {
  if (e.key === 'Enter') addTask();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', handleInputKey);
clearAllBtn.addEventListener('click', clearAllTasks);
filterBtns.forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));
darkModeToggle.addEventListener('click', toggleDarkMode);

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderTasks();
  initDarkMode();
}); 