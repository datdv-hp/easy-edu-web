<script setup lang="ts">
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
</script>

<template>
  <header-bar title="Dashboard"> </header-bar>
</template>

<style lang="scss" scoped>
.page-container {
  margin: auto;
  padding-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  height: calc(100vh - 76px);
}
</style>
