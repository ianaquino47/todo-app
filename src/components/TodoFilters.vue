<template>
  <div class="row items-center q-gutter-sm">
    <span data-cy="remaining-count" class="text-body2">
      {{ t('UI.Labels.ItemsRemaining', { count: remainingCount }) }}
    </span>

    <q-space />

    <q-btn-group flat>
      <q-btn
        data-cy="filter-all"
        :label="t('UI.Labels.FilterAll')"
        dense
        :class="activeFilter === TodoFilter.All ? 'bg-primary text-white' : ''"
        @click="emit('filterChange', TodoFilter.All)"
      />
      <q-btn
        data-cy="filter-active"
        :label="t('UI.Labels.FilterActive')"
        dense
        :class="activeFilter === TodoFilter.Active ? 'bg-primary text-white' : ''"
        @click="emit('filterChange', TodoFilter.Active)"
      />
      <q-btn
        data-cy="filter-completed"
        :label="t('UI.Labels.FilterCompleted')"
        dense
        :class="activeFilter === TodoFilter.Completed ? 'bg-primary text-white' : ''"
        @click="emit('filterChange', TodoFilter.Completed)"
      />
    </q-btn-group>

    <q-btn
      data-cy="clear-completed"
      :label="t('UI.Actions.ClearCompleted')"
      flat
      dense
      color="negative"
      @click="emit('clearCompleted')"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TodoFilter } from 'src/domain/todo';

const { t } = useI18n();

interface IProps {
  activeFilter: TodoFilter;
  remainingCount: number;
}
defineProps<IProps>();

interface IEmits {
  (e: 'filterChange', filter: TodoFilter): void;
  (e: 'clearCompleted'): void;
}
const emit = defineEmits<IEmits>();
</script>
