<template>
  <div class="row q-gutter-sm items-center">
    <q-input
      v-model="title"
      data-cy="todo-input"
      :placeholder="t('UI.Labels.TodoInputPlaceholder')"
      outlined
      dense
      class="col"
      @keyup.enter="handleAdd"
    />
    <q-btn
      data-cy="todo-add-button"
      color="primary"
      :label="t('UI.Actions.AddTodo')"
      dense
      @click="handleAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface IEmits {
  (e: 'add', title: string): void;
}
const emit = defineEmits<IEmits>();

const title = ref('');

function handleAdd(): void {
  const trimmed = title.value.trim();
  if (!trimmed) return;

  emit('add', trimmed);
  title.value = '';
}
</script>
