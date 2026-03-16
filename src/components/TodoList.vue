<template>
  <div>
    <q-list v-if="todos.length > 0" data-cy="todo-list" separator>
      <todo-item
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="(id: string) => emit('toggle', id)"
        @remove="(id: string) => emit('remove', id)"
        @update="(id: string, title: string) => emit('update', id, title)"
      />
    </q-list>

    <div v-else data-cy="empty-state" class="text-center q-pa-lg text-grey-6">
      {{ t('UI.Information.EmptyState') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ITodo } from 'src/domain/todo';
import TodoItem from 'src/components/TodoItem.vue';

const { t } = useI18n();

interface IProps {
  todos: ITodo[];
}
defineProps<IProps>();

interface IEmits {
  (e: 'toggle', id: string): void;
  (e: 'remove', id: string): void;
  (e: 'update', id: string, title: string): void;
}
const emit = defineEmits<IEmits>();
</script>
