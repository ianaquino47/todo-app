import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createI18n } from 'vue-i18n';
import TodoInput from 'src/components/TodoInput.vue';
import enGB from 'src/i18n/en-GB';

const i18n = createI18n({
  locale: 'en-GB',
  legacy: false,
  messages: { 'en-GB': enGB },
});

function mountComponent() {
  return mount(TodoInput, {
    global: {
      plugins: [Quasar, i18n],
    },
  });
}

describe('TodoInput', () => {
  it('should render an input field with the correct placeholder', () => {
    const wrapper = mountComponent();

    const input = wrapper.find('[data-cy="todo-input"]');
    expect(input.exists()).toBe(true);
  });

  it('should render an add button', () => {
    const wrapper = mountComponent();

    const button = wrapper.find('[data-cy="todo-add-button"]');
    expect(button.exists()).toBe(true);
  });

  it('should emit add event with trimmed title when add button is clicked', async () => {
    const wrapper = mountComponent();
    const input = wrapper.find('[data-cy="todo-input"]');

    await input.setValue('  Buy milk  ');
    await wrapper.find('[data-cy="todo-add-button"]').trigger('click');

    expect(wrapper.emitted('add')).toEqual([['Buy milk']]);
  });

  it('should emit add event when Enter is pressed in the input', async () => {
    const wrapper = mountComponent();
    const input = wrapper.find('[data-cy="todo-input"]');

    await input.setValue('Buy groceries');
    await input.trigger('keyup.enter');

    expect(wrapper.emitted('add')).toEqual([['Buy groceries']]);
  });

  it('should clear the input after emitting add', async () => {
    const wrapper = mountComponent();
    const input = wrapper.find('[data-cy="todo-input"]');

    await input.setValue('Buy milk');
    await input.trigger('keyup.enter');

    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('should not emit add when the input is empty', async () => {
    const wrapper = mountComponent();
    const input = wrapper.find('[data-cy="todo-input"]');

    await input.setValue('');
    await input.trigger('keyup.enter');

    expect(wrapper.emitted('add')).toBeUndefined();
  });

  it('should not emit add when the input is only whitespace', async () => {
    const wrapper = mountComponent();
    const input = wrapper.find('[data-cy="todo-input"]');

    await input.setValue('   ');
    await wrapper.find('[data-cy="todo-add-button"]').trigger('click');

    expect(wrapper.emitted('add')).toBeUndefined();
  });
});
