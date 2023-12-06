<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
    loading?: boolean;
    opacity?: number;
    bgColor?: string;
  }>(),
  {
    size: 50,
    loading: false,
  },
);
</script>

<template>
  <v-overlay
    :model-value="loading"
    contained
    class="align-center justify-center"
    :style="{
      opacity: opacity,
      backgroundColor: bgColor,
    }"
    scrim="transparent"
    persistent
  >
    <v-progress-circular indeterminate color="primary" :size="size"></v-progress-circular>
  </v-overlay>
</template>

<style scoped lang="scss"></style>
