<script setup lang="ts">
import { translateYupError } from '@/common/helpers';

interface Props {
  isShow: boolean;
  type?: 'warnings' | 'error';
  message:
    | string
    | {
        i18nKey: string;
        params?: Record<string, string>;
      };
}
withDefaults(defineProps<Props>(), {
  type: 'error',
});
</script>
<template>
  <div v-if="isShow" class="status-container">
    <span class="error-message" v-if="type === 'error'">
      {{ message ? translateYupError(message || '') : undefined }}
    </span>
    <span class="warning-message" v-if="type === 'warnings'">{{ message }}</span>
  </div>
</template>
<style scoped lang="scss">
.error-message {
  color: $color-state-error;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
}

.warning-message {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: $color-neutral-3;
}

.status-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}
</style>
