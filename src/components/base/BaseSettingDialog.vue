<script setup lang="ts">
import Icons from '@/assets/icons';
type Props = {
  title: string;
  subtitle?: string;
  loading?: boolean;
  disabled?: boolean;
  overlay?: boolean;
  minWidth?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  width?: number | string;
  height?: number | string;
  icon?: string;
};
withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  overlay: false,
  maxHeight: '90vh',
  maxWidth: '791',
  width: '480',
  icon: 'settingDialog',
});
</script>

<template>
  <v-dialog
    :model-value="true"
    persistent
    :max-width="maxWidth"
    :max-height="maxHeight"
    :width="width"
    :height="height"
    scrim="rgba(0, 0, 0, 0.56)"
    scrollable
    class="setting-dialog"
  >
    <v-card class="rounded--3 pa-0">
      <template v-slot:title>
        <div class="d-flex justify-space-between px-3">
          <div></div>
          <div class="ml-6"><img :src="Icons[icon]" /></div>
          <div>
            <v-icon class="icon-close" @click="() => $emit('close')"> mdi-close </v-icon>
          </div>
        </div>
        <div class="d-flex align-center justify-center mt-3">
          <h4>{{ title }}</h4>
        </div>
      </template>
      <template v-slot:subtitle>
        <span class="d-flex align-center justify-center">{{ subtitle }}</span>
      </template>
      <div class="px-8 py-4">
        <slot></slot>
      </div>
      <v-card-actions class="pa-8">
        <v-btn
          class="text-none px-8"
          variant="elevated"
          color="primary"
          size="large"
          :disabled="disabled"
          :loading="loading"
          block
          @click="() => $emit('submit')"
        >
          {{ $t('common.button.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-overlay :model-value="overlay" contained class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<style lang="scss" scoped>
:deep(.v-card-text) {
  &::-webkit-scrollbar {
    display: block;
    visibility: hidden;
    background-color: #fff;
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    visibility: hidden;
    background-color: $color-neutral-6;
    border-radius: 6px;
  }

  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
}

.icon-close {
  width: 24px;
  height: 24px;
  color: $color-neutral-4;
  transition: 0.2s ease;
  &:hover {
    opacity: 0.7;
  }
}
</style>
