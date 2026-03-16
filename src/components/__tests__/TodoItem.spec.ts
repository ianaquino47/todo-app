import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createI18n } from 'vue-i18n';
import TodoItem from 'src/components/TodoItem.vue';
import enGB from 'src/i18n/en-GB';
import type { ITodo } from 'src/domain/todo';

const i18n = createI18n({
  locale: 'en-GB',
  legacy: false,
  messages: { 'en-GB': enGB },
});

function createTodo(overrides: Partial<ITodo> = {}): ITodo {
  return {
    id: 'test-1',
    title: 'Test todo',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mountComponent(todo: ITodo = createTodo()) {
  return mount(TodoItem, {
    props: { todo },
    global: {
      plugins: [Quasar, i18n],
    },
  });
}

describe('TodoItem', () => {
  it('should display the todo title', () => {
    const wrapper = mountComponent(createTodo({ title: 'Buy milk' }));

    expect(wrapper.text()).toContain('Buy milk');
  });

  it('should render a checkbox', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-cy="todo-checkbox-test-1"]').exists()).toBe(true);
  });

  it('should emit toggle when the checkbox is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="todo-checkbox-test-1"]').trigger('click');

    expect(wrapper.emitted('toggle')).toEqual([['test-1']]);
  });

  it('should render a delete button', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-cy="todo-delete-test-1"]').exists()).toBe(true);
  });

  it('should emit remove when the delete button is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="todo-delete-test-1"]').trigger('click');

    expect(wrapper.emitted('remove')).toEqual([['test-1']]);
  });

  it('should render an edit button', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-cy="todo-edit-test-1"]').exists()).toBe(true);
  });

  it('should enter edit mode when edit button is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="todo-edit-test-1"]').trigger('click');

    expect(wrapper.find('[data-cy="todo-edit-input-test-1"]').exists()).toBe(true);
  });

  it('should emit update with new title when Enter is pressed in edit mode', async () => {
    const wrapper = mountComponent(createTodo({ id: 'test-1', title: 'Old title' }));

    await wrapper.find('[data-cy="todo-edit-test-1"]').trigger('click');
    const editInput = wrapper.find('[data-cy="todo-edit-input-test-1"]');
    await editInput.setValue('New title');
    await editInput.trigger('keyup.enter');

    expect(wrapper.emitted('update')).toEqual([['test-1', 'New title']]);
  });

  it('should exit edit mode after confirming an edit', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="todo-edit-test-1"]').trigger('click');
    const editInput = wrapper.find('[data-cy="todo-edit-input-test-1"]');
    await editInput.setValue('Updated');
    await editInput.trigger('keyup.enter');

    expect(wrapper.find('[data-cy="todo-edit-input-test-1"]').exists()).toBe(false);
  });

  it('should revert to original title when Escape is pressed in edit mode', async () => {
    const wrapper = mountComponent(createTodo({ title: 'Original' }));

    await wrapper.find('[data-cy="todo-edit-test-1"]').trigger('click');
    const editInput = wrapper.find('[data-cy="todo-edit-input-test-1"]');
    await editInput.setValue('Changed');
    await editInput.trigger('keyup.escape');

    expect(wrapper.find('[data-cy="todo-edit-input-test-1"]').exists()).toBe(false);
    expect(wrapper.emitted('update')).toBeUndefined();
  });

  it('should not emit update when the edit input is empty', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="todo-edit-test-1"]').trigger('click');
    const editInput = wrapper.find('[data-cy="todo-edit-input-test-1"]');
    await editInput.setValue('');
    await editInput.trigger('keyup.enter');

    expect(wrapper.emitted('update')).toBeUndefined();
  });

  it('should apply completed styling when todo is completed', () => {
    const wrapper = mountComponent(createTodo({ completed: true }));

    expect(wrapper.find('.todo-completed').exists()).toBe(true);
  });

  it('should not apply completed styling when todo is active', () => {
    const wrapper = mountComponent(createTodo({ completed: false }));

    expect(wrapper.find('.todo-completed').exists()).toBe(false);
  });
});
