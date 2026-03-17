<template>
  <q-page class="q-pa-md" style="max-width: 600px; margin: 0 auto;">
    <todo-input class="q-mb-md" @add="todoStore.addTodo" />

    <todo-list
      :todos="todoStore.filteredTodos"
      @toggle="todoStore.toggleTodo"
      @remove="todoStore.removeTodo"
      @update="todoStore.updateTodo"
    />

    <todo-filters
      v-if="todoStore.todos.length > 0"
      class="q-mt-md"
      :active-filter="todoStore.filter"
      :remaining-count="todoStore.remainingCount"
      @filter-change="todoStore.setFilter"
      @clear-completed="todoStore.clearCompleted"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTodoStore } from 'src/stores/todo-store';
import TodoInput from 'src/components/TodoInput.vue';
import TodoList from 'src/components/TodoList.vue';
import TodoFilters from 'src/components/TodoFilters.vue';

const todoStore = useTodoStore();

onMounted(() => {
  todoStore.loadTodos();
});
</script>
