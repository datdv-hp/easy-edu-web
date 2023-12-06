<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  title: string;
}
defineProps<Props>();
const isOpen = ref();
</script>
<template>
  <v-expansion-panels v-model="isOpen">
    <v-expansion-panel class="content" :elevation="0" :value="true" :ripple="false">
      <v-expansion-panel-title class="expand-title">
        <span v-if="title" class="content-title">{{ title }}</span>
        <slot name="prepend-inner" :isOpen="isOpen"></slot>
      </v-expansion-panel-title>
      <v-expansion-panel-text><slot></slot></v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<style lang="scss" scoped>
.content {
  box-shadow: 0px 6px 12px 0px #1a478b0f;
  border-radius: 12px;

  .expand-title {
    height: 78px;
    font-weight: 600;
    font-size: 18px;
    color: $color-neutral-1;

    .content-title {
      line-height: 28px;
    }
  }
  :deep(.v-expansion-panel-title--active) {
    padding-top: 24px;
    padding-bottom: 18px;
    height: 70px;
  }
  :deep(.v-expansion-panel-title__overlay) {
    background-color: unset;
  }
}
:deep(.v-expansion-panel--active) {
  .v-expansion-panel-text__wrapper {
    padding-top: 0;
  }
}
</style>
