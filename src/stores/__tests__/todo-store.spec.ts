import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTodoStore } from 'src/stores/todo-store';
import { TodoFilter } from 'src/domain/todo';

describe('useTodoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('addTodo', () => {
    it('should add a new todo with correct defaults when given a title', () => {
      const store = useTodoStore();

      store.addTodo('Buy groceries');

      expect(store.todos).toHaveLength(1);
      expect(store.todos[0]).toEqual(
        expect.objectContaining({
          title: 'Buy groceries',
          completed: false,
        }),
      );
      expect(store.todos[0].id).toBeDefined();
      expect(store.todos[0].createdAt).toBeDefined();
    });

    it('should generate unique IDs when adding multiple todos', () => {
      const store = useTodoStore();

      store.addTodo('First');
      store.addTodo('Second');

      expect(store.todos[0].id).not.toBe(store.todos[1].id);
    });

    it('should trim the title when adding a todo', () => {
      const store = useTodoStore();

      store.addTodo('  Buy milk  ');

      expect(store.todos[0].title).toBe('Buy milk');
    });

    it('should not add a todo when the title is empty', () => {
      const store = useTodoStore();

      store.addTodo('');
      store.addTodo('   ');

      expect(store.todos).toHaveLength(0);
    });
  });

  describe('updateTodo', () => {
    it('should update the title of an existing todo when given a valid id', () => {
      const store = useTodoStore();
      store.addTodo('Original title');
      const id = store.todos[0].id;

      store.updateTodo(id, 'Updated title');

      expect(store.todos[0].title).toBe('Updated title');
    });

    it('should not mutate the original todo object when updating', () => {
      const store = useTodoStore();
      store.addTodo('Original');
      const originalTodo = store.todos[0];
      const id = originalTodo.id;

      store.updateTodo(id, 'Updated');

      // The array element should be a new object (immutable update)
      expect(store.todos[0]).not.toBe(originalTodo);
      expect(store.todos[0].title).toBe('Updated');
    });

    it('should do nothing when the id does not exist', () => {
      const store = useTodoStore();
      store.addTodo('Existing');

      store.updateTodo('non-existent-id', 'New title');

      expect(store.todos[0].title).toBe('Existing');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle completed to true when a todo is active', () => {
      const store = useTodoStore();
      store.addTodo('Test');
      const id = store.todos[0].id;

      store.toggleTodo(id);

      expect(store.todos[0].completed).toBe(true);
    });

    it('should toggle completed back to false when a todo is completed', () => {
      const store = useTodoStore();
      store.addTodo('Test');
      const id = store.todos[0].id;

      store.toggleTodo(id);
      store.toggleTodo(id);

      expect(store.todos[0].completed).toBe(false);
    });

    it('should not mutate the original todo object when toggling', () => {
      const store = useTodoStore();
      store.addTodo('Test');
      const originalTodo = store.todos[0];
      const id = originalTodo.id;

      store.toggleTodo(id);

      expect(store.todos[0]).not.toBe(originalTodo);
    });
  });

  describe('removeTodo', () => {
    it('should remove a todo by id', () => {
      const store = useTodoStore();
      store.addTodo('To remove');
      const id = store.todos[0].id;

      store.removeTodo(id);

      expect(store.todos).toHaveLength(0);
    });

    it('should only remove the targeted todo when multiple exist', () => {
      const store = useTodoStore();
      store.addTodo('Keep');
      store.addTodo('Remove');
      const removeId = store.todos[1].id;

      store.removeTodo(removeId);

      expect(store.todos).toHaveLength(1);
      expect(store.todos[0].title).toBe('Keep');
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      const store = useTodoStore();
      store.addTodo('Active');
      store.addTodo('Completed');
      store.toggleTodo(store.todos[1].id);

      store.clearCompleted();

      expect(store.todos).toHaveLength(1);
      expect(store.todos[0].title).toBe('Active');
    });

    it('should do nothing when no todos are completed', () => {
      const store = useTodoStore();
      store.addTodo('Active 1');
      store.addTodo('Active 2');

      store.clearCompleted();

      expect(store.todos).toHaveLength(2);
    });
  });

  describe('setFilter', () => {
    it('should update the active filter', () => {
      const store = useTodoStore();

      store.setFilter(TodoFilter.Active);

      expect(store.filter).toBe(TodoFilter.Active);
    });
  });

  describe('filteredTodos', () => {
    it('should return all todos when filter is All', () => {
      const store = useTodoStore();
      store.addTodo('Active');
      store.addTodo('Completed');
      store.toggleTodo(store.todos[1].id);
      store.setFilter(TodoFilter.All);

      expect(store.filteredTodos).toHaveLength(2);
    });

    it('should return only active todos when filter is Active', () => {
      const store = useTodoStore();
      store.addTodo('Active');
      store.addTodo('Completed');
      store.toggleTodo(store.todos[1].id);
      store.setFilter(TodoFilter.Active);

      expect(store.filteredTodos).toHaveLength(1);
      expect(store.filteredTodos[0].title).toBe('Active');
    });

    it('should return only completed todos when filter is Completed', () => {
      const store = useTodoStore();
      store.addTodo('Active');
      store.addTodo('Completed');
      store.toggleTodo(store.todos[1].id);
      store.setFilter(TodoFilter.Completed);

      expect(store.filteredTodos).toHaveLength(1);
      expect(store.filteredTodos[0].title).toBe('Completed');
    });
  });

  describe('remainingCount', () => {
    it('should return the count of active todos', () => {
      const store = useTodoStore();
      store.addTodo('Active 1');
      store.addTodo('Active 2');
      store.addTodo('Completed');
      store.toggleTodo(store.todos[2].id);

      expect(store.remainingCount).toBe(2);
    });

    it('should return 0 when all todos are completed', () => {
      const store = useTodoStore();
      store.addTodo('Todo');
      store.toggleTodo(store.todos[0].id);

      expect(store.remainingCount).toBe(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist todos to localStorage when a todo is added', () => {
      const store = useTodoStore();

      store.addTodo('Persisted');

      const stored = JSON.parse(localStorage.getItem('todos') ?? '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Persisted');
    });

    it('should hydrate todos from localStorage on initialisation', () => {
      const existingTodos = [
        { id: '1', title: 'Hydrated', completed: false, createdAt: new Date().toISOString() },
      ];
      localStorage.setItem('todos', JSON.stringify(existingTodos));

      const store = useTodoStore();

      expect(store.todos).toHaveLength(1);
      expect(store.todos[0].title).toBe('Hydrated');
    });
  });
});
