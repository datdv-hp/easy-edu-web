<script lang="ts" setup>
defineProps<{ isRail: boolean }>();
</script>
<template>
  <v-card v-if="isRail"><slot></slot></v-card>
  <slot v-else></slot>
</template>
<style lang="scss" scoped></style>
