<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
}>();
</script>

<template>
  <div class="info-title d-flex align-center mb-2 ws-nowrap">
    <div class="info-icon"><img class="mr-3" :src="icon" alt="" /></div>
    {{ title }}
  </div>
</template>

<style scoped lang="scss">
.info-title {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: $color-neutral-4;
  .info-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
