import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createI18n } from 'vue-i18n';
import TodoFilters from 'src/components/TodoFilters.vue';
import enGB from 'src/i18n/en-GB';
import { TodoFilter } from 'src/domain/todo';

const i18n = createI18n({
  locale: 'en-GB',
  legacy: false,
  messages: { 'en-GB': enGB },
});

function mountComponent(props: {
  activeFilter?: TodoFilter;
  remainingCount?: number;
} = {}) {
  return mount(TodoFilters, {
    props: {
      activeFilter: props.activeFilter ?? TodoFilter.All,
      remainingCount: props.remainingCount ?? 0,
    },
    global: {
      plugins: [Quasar, i18n],
    },
  });
}

describe('TodoFilters', () => {
  it('should render All, Active, and Completed filter buttons', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-cy="filter-all"]').exists()).toBe(true);
    expect(wrapper.find('[data-cy="filter-active"]').exists()).toBe(true);
    expect(wrapper.find('[data-cy="filter-completed"]').exists()).toBe(true);
  });

  it('should render a clear completed button', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-cy="clear-completed"]').exists()).toBe(true);
  });

  it('should display the remaining count', () => {
    const wrapper = mountComponent({ remainingCount: 3 });

    const countEl = wrapper.find('[data-cy="remaining-count"]');
    expect(countEl.exists()).toBe(true);
    expect(countEl.text()).toContain('3');
  });

  it('should emit filterChange with All when All button is clicked', async () => {
    const wrapper = mountComponent({ activeFilter: TodoFilter.Active });

    await wrapper.find('[data-cy="filter-all"]').trigger('click');

    expect(wrapper.emitted('filterChange')).toEqual([[TodoFilter.All]]);
  });

  it('should emit filterChange with Active when Active button is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="filter-active"]').trigger('click');

    expect(wrapper.emitted('filterChange')).toEqual([[TodoFilter.Active]]);
  });

  it('should emit filterChange with Completed when Completed button is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="filter-completed"]').trigger('click');

    expect(wrapper.emitted('filterChange')).toEqual([[TodoFilter.Completed]]);
  });

  it('should emit clearCompleted when clear completed button is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-cy="clear-completed"]').trigger('click');

    expect(wrapper.emitted('clearCompleted')).toHaveLength(1);
  });

  it('should visually distinguish the active filter button', () => {
    const wrapper = mountComponent({ activeFilter: TodoFilter.Active });

    const activeBtn = wrapper.find('[data-cy="filter-active"]');
    expect(activeBtn.classes()).toContain('bg-primary');
  });
});
