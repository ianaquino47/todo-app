import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ITodo } from 'src/domain/todo';
import { TodoFilter } from 'src/domain/todo';
import * as todoApi from 'src/services/todoApi';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<ITodo[]>([]);
  const filter = ref<TodoFilter>(TodoFilter.All);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

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

  async function loadTodos(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      todos.value = await todoApi.fetchTodos();
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load todos';
    } finally {
      loading.value = false;
    }
  }

  function addTodo(title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTodo: ITodo = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    todos.value = [...todos.value, newTodo];

    todoApi.createTodo(newTodo).catch((err: unknown) => {
      // Revert on failure
      todos.value = todos.value.filter((todo) => todo.id !== newTodo.id);
      error.value = err instanceof Error ? err.message : 'Failed to add todo';
    });
  }

  function updateTodo(id: string, title: string): void {
    const previousTodos = todos.value;

    // Optimistic update
    todos.value = todos.value.map((todo) =>
      todo.id === id ? { ...todo, title } : todo,
    );

    todoApi.updateTodo(id, { title }).catch((err: unknown) => {
      todos.value = previousTodos;
      error.value = err instanceof Error ? err.message : 'Failed to update todo';
    });
  }

  function toggleTodo(id: string): void {
    const todo = todos.value.find((t) => t.id === id);
    if (!todo) return;

    const previousTodos = todos.value;
    const newCompleted = !todo.completed;

    // Optimistic update
    todos.value = todos.value.map((t) =>
      t.id === id ? { ...t, completed: newCompleted } : t,
    );

    todoApi.updateTodo(id, { completed: newCompleted }).catch((err: unknown) => {
      todos.value = previousTodos;
      error.value = err instanceof Error ? err.message : 'Failed to toggle todo';
    });
  }

  function removeTodo(id: string): void {
    const previousTodos = todos.value;

    // Optimistic update
    todos.value = todos.value.filter((todo) => todo.id !== id);

    todoApi.deleteTodo(id).catch((err: unknown) => {
      todos.value = previousTodos;
      error.value = err instanceof Error ? err.message : 'Failed to remove todo';
    });
  }

  function clearCompleted(): void {
    const completedTodos = todos.value.filter((todo) => todo.completed);
    const previousTodos = todos.value;

    // Optimistic update
    todos.value = todos.value.filter((todo) => !todo.completed);

    Promise.all(completedTodos.map((todo) => todoApi.deleteTodo(todo.id))).catch(
      (err: unknown) => {
        todos.value = previousTodos;
        error.value = err instanceof Error ? err.message : 'Failed to clear completed';
      },
    );
  }

  function setFilter(newFilter: TodoFilter): void {
    filter.value = newFilter;
  }

  return {
    todos,
    filter,
    loading,
    error,
    filteredTodos,
    remainingCount,
    loadTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
  };
});
