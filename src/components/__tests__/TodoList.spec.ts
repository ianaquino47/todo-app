import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createI18n } from 'vue-i18n';
import TodoList from 'src/components/TodoList.vue';
import enGB from 'src/i18n/en-GB';
import type { ITodo } from 'src/domain/todo';

const i18n = createI18n({
  locale: 'en-GB',
  legacy: false,
  messages: { 'en-GB': enGB },
});

function createTodo(overrides: Partial<ITodo> = {}): ITodo {
  return {
    id: 'todo-1',
    title: 'Test todo',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mountComponent(todos: ITodo[] = []) {
  return mount(TodoList, {
    props: { todos },
    global: {
      plugins: [Quasar, i18n],
    },
  });
}

describe('TodoList', () => {
  it('should render a TodoItem for each todo', () => {
    const todos = [
      createTodo({ id: '1', title: 'First' }),
      createTodo({ id: '2', title: 'Second' }),
    ];
    const wrapper = mountComponent(todos);

    expect(wrapper.find('[data-cy="todo-item-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-cy="todo-item-2"]').exists()).toBe(true);
  });

  it('should display empty state when there are no todos', () => {
    const wrapper = mountComponent([]);

    expect(wrapper.find('[data-cy="empty-state"]').exists()).toBe(true);
  });

  it('should not display empty state when there are todos', () => {
    const wrapper = mountComponent([createTodo()]);

    expect(wrapper.find('[data-cy="empty-state"]').exists()).toBe(false);
  });

  it('should have a data-cy todo-list attribute', () => {
    const wrapper = mountComponent([createTodo()]);

    expect(wrapper.find('[data-cy="todo-list"]').exists()).toBe(true);
  });

  it('should emit toggle when a TodoItem emits toggle', async () => {
    const wrapper = mountComponent([createTodo({ id: 'abc' })]);

    await wrapper.find('[data-cy="todo-checkbox-abc"]').trigger('click');

    expect(wrapper.emitted('toggle')).toEqual([['abc']]);
  });

  it('should emit remove when a TodoItem emits remove', async () => {
    const wrapper = mountComponent([createTodo({ id: 'abc' })]);

    await wrapper.find('[data-cy="todo-delete-abc"]').trigger('click');

    expect(wrapper.emitted('remove')).toEqual([['abc']]);
  });
});
