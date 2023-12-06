<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineProps<{
  name: string;
  code: string;
}>();

const tooltip = ref(false);

onMounted(() => {
  setTimeout(() => {
    tooltip.value = true;
  }, 150);
});
</script>

<template>
  <v-tooltip v-model="tooltip" location="top" :text="name" eager>
    <template v-slot:activator="{ props }">
      <div v-bind="props">
        {{ code }}
      </div>
    </template>
  </v-tooltip>
</template>

<style scoped lang="scss"></style>
