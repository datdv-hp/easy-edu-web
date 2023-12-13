<script lang="ts" setup>
defineProps<{
  color: string;
}>();
</script>
<template>
  <div class="dot"></div>
</template>
<style lang="scss" scoped>
.dot {
  display: inline-block;
  margin-right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: v-bind(color);
}
</style>
