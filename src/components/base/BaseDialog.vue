<script setup lang="ts">
import { BaseButton } from '..';

type Props = {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  overlay?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  width?: number | string;
  height?: number | string;
  contentClass?: string;
  wrapperClass?: string;
  hideActionButtons?: boolean;
  hideFooter?: boolean;
  isHideHeader?: boolean;
};
withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  overlay: false,
  maxHeight: '90vh',
  maxWidth: '791',
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
    class="profile-dialog"
    :content-class="wrapperClass"
  >
    <v-card class="rounded--2 pa-0">
      <template v-slot:append v-if="!isHideHeader">
        <slot name="append">
          <v-icon class="icon-close" @click="() => $emit('close')"> mdi-close </v-icon>
        </slot>
      </template>
      <template v-slot:title v-if="!isHideHeader">
        <slot name="title" class="a">
          <span class="dialog-title">{{ title }}</span>
        </slot>
      </template>
      <v-card-text :class="contentClass" class="pa-8 ma-0">
        <slot></slot>
      </v-card-text>
      <v-card-actions v-if="!hideFooter" class="dialog-footer">
        <v-row v-if="!hideActionButtons" class="d-flex justify-end gap--4">
          <BaseButton
            size="medium"
            variant="outline"
            @click="() => $emit('close')"
            button-class="px-12"
          >
            <slot name="cancelButtonText">{{ $t('common.button.cancel') }}</slot>
          </BaseButton>
          <BaseButton
            size="medium"
            variant="solid"
            @click="() => $emit('submit')"
            :is-disabled="disabled"
            :is-loading="loading"
            button-class="px-16"
          >
            <slot name="saveButtonText">{{ $t('common.button.save') }}</slot>
          </BaseButton>
        </v-row>
        <slot v-else name="actions"></slot>
      </v-card-actions>
      <v-overlay
        :model-value="overlay"
        contained
        scrim="transparent"
        class="align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          :size="70"
        ></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.dialog-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  line-height: 36px;
  color: $color-black;
}
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
  transition: 0.2s ease;
  &:hover {
    opacity: 0.7;
  }
}
</style>
