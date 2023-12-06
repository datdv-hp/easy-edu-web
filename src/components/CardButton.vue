<script setup lang="ts">
import { BaseButton } from '.';

defineProps<{
  icon?: string;
  title?: string;
}>();

defineEmits<{
  (event: 'handleClick'): void;
}>();
</script>

<template>
  <v-card class="wrapper pa-6">
    <div class="content">
      <div class="content-icon">
        <img :src="icon" alt="" />
      </div>
      <span class="content-title">
        {{ title }}
      </span>
      <div class="content-button">
        <BaseButton
          :label="$t('common.button.view')"
          right-icon="mdi-chevron-right "
          size="small"
          variant="outline"
          @click="() => $emit('handleClick')"
        >
        </BaseButton>
      </div>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;
  .content-title {
    font-size: 16px;
    font-weight: 600;
    height: 48px;
  }
  .content-button {
    width: 104px;
  }
}
</style>
