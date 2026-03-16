<template>
  <q-item :data-cy="`todo-item-${todo.id}`">
    <q-item-section side>
      <q-checkbox
        :model-value="todo.completed"
        :data-cy="`todo-checkbox-${todo.id}`"
        @update:model-value="emit('toggle', todo.id)"
      />
    </q-item-section>

    <q-item-section>
      <template v-if="isEditing">
        <q-input
          v-model="editTitle"
          :data-cy="`todo-edit-input-${todo.id}`"
          dense
          outlined
          autofocus
          @keyup.enter="confirmEdit"
          @keyup.escape="cancelEdit"
        />
      </template>
      <template v-else>
        <q-item-label :class="{ 'todo-completed': todo.completed }">
          {{ todo.title }}
        </q-item-label>
      </template>
    </q-item-section>

    <q-item-section side>
      <div class="row q-gutter-xs">
        <q-btn
          v-if="!isEditing"
          :data-cy="`todo-edit-${todo.id}`"
          flat
          round
          dense
          icon="edit"
          size="sm"
          :aria-label="t('UI.Actions.EditTodo')"
          @click="startEdit"
        />
        <q-btn
          :data-cy="`todo-delete-${todo.id}`"
          flat
          round
          dense
          icon="delete"
          size="sm"
          color="negative"
          :aria-label="t('UI.Actions.DeleteTodo')"
          @click="emit('remove', todo.id)"
        />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ITodo } from 'src/domain/todo';

const { t } = useI18n();

interface IProps {
  todo: ITodo;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'toggle', id: string): void;
  (e: 'remove', id: string): void;
  (e: 'update', id: string, title: string): void;
}
const emit = defineEmits<IEmits>();

const isEditing = ref(false);
const editTitle = ref('');

function startEdit(): void {
  editTitle.value = props.todo.title;
  isEditing.value = true;
}

function confirmEdit(): void {
  const trimmed = editTitle.value.trim();
  if (trimmed) {
    emit('update', props.todo.id, trimmed);
  }
  isEditing.value = false;
}

function cancelEdit(): void {
  isEditing.value = false;
}
</script>
