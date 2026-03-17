import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ITodo } from 'src/domain/todo';
import { TodoFilter } from 'src/domain/todo';

const STORAGE_KEY = 'todos';
const API_URL = 'https://3nio1igy4g.execute-api.eu-west-2.amazonaws.com';

function loadFromLocalStorage(): ITodo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(todos: ITodo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<ITodo[]>(loadFromLocalStorage());
  const filter = ref<TodoFilter>(TodoFilter.All);

  const filteredTodos = computed<ITodo[]>(() => {
    switch (filter.value) {
      case TodoFilter.Active:
        return todos.value.filter((todo) => !todo.completed);
      case TodoFilter.Completed:
        return todos.value.filter((todo) => todo.completed);
      default:
        return todos.value;
    }
  });

  const remainingCount = computed<number>(
    () => todos.value.filter((todo) => !todo.completed).length,
  );

  function addTodo(title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTodo: ITodo = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.value = [...todos.value, newTodo];
    saveToLocalStorage(todos.value);

    fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => console.log('API response:', data))
      .catch((error) => console.error('API error:', error));
  }

  function updateTodo(id: string, title: string): void {
    todos.value = todos.value.map((todo) =>
      todo.id === id ? { ...todo, title } : todo,
    );
    saveToLocalStorage(todos.value);
  }

  function toggleTodo(id: string): void {
    todos.value = todos.value.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    saveToLocalStorage(todos.value);
  }

  function removeTodo(id: string): void {
    todos.value = todos.value.filter((todo) => todo.id !== id);
    saveToLocalStorage(todos.value);
  }

  function clearCompleted(): void {
    todos.value = todos.value.filter((todo) => !todo.completed);
    saveToLocalStorage(todos.value);
  }

  function setFilter(newFilter: TodoFilter): void {
    filter.value = newFilter;
  }

  return {
    todos,
    filter,
    filteredTodos,
    remainingCount,
    addTodo,
    updateTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
  };
});
