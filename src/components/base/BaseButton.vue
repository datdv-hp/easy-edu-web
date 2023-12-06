<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    label?: string;
    leftIcon?: string;
    rightIcon?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    width?: string;
    variant?: 'solid' | 'soft' | 'outline' | 'text' | 'plain';
    size?: 'normal' | 'medium' | 'small' | 'extra-small' | 'xx-small';
    isOnlyIcon?: boolean;
    buttonClass?: string;
    color?: string;
    isCircle?: boolean;
    icon?: string;
  }>(),
  {
    variant: 'solid',
    size: 'normal',
  },
);
const emit = defineEmits<{
  (event: 'click', e: MouseEvent): void;
}>();

const onClick = (e: MouseEvent) => {
  emit('click', e);
};
</script>
<template>
  <div
    class="d-inline-block"
    :class="{
      [`btn-${variant}`]: !!variant,
      [`btn-${size}`]: !!size,
      [`w-${width}`]: !!width,
      isCircle: isCircle,
    }"
  >
    <v-btn
      class="text-none w-100"
      :class="buttonClass"
      :prepend-icon="leftIcon"
      :append-icon="rightIcon"
      variant="flat"
      :icon="icon"
      :loading="isLoading"
      :style="{ alignItems: 'center' }"
      :disabled="isDisabled"
      :color="color"
      @click="onClick"
    >
      <span
        class="d-flex align-center"
        v-if="!isOnlyIcon"
        :class="{ 'ms-2': leftIcon, 'me-2': rightIcon }"
      >
        <template v-if="!props.label">
          <slot></slot>
        </template>
        <template v-else>
          {{ props.label }}
        </template>
      </span>
    </v-btn>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn) {
  border: 1px solid transparent;
  .v-btn__overlay {
    background: unset;
  }

  .v-btn__prepend {
    margin-inline-end: 0 !important;
  }

  .v-btn__append {
    margin-inline-start: 0 !important;
  }
}
.btn-normal {
  &.isCircle {
    :deep(.v-btn) {
      min-width: 56px;
    }
  }
  :deep(.v-btn) {
    height: 56px;
    padding: 0 32px;
    font-size: 20px;
    line-height: 24px;

    .v-btn__append .v-icon,
    .v-btn__prepend .v-icon {
      font-size: 18px;
    }
  }
}
.btn-medium {
  &.isCircle {
    :deep(.v-btn) {
      min-width: 48px;
    }
  }
  :deep(.v-btn) {
    height: 48px;
    padding: 0 32px;
    font-size: 16px;
    line-height: 20px;

    .v-btn__append .v-icon,
    .v-btn__prepend .v-icon {
      font-size: 14px;
    }
  }
}
.btn-small {
  &.isCircle {
    :deep(.v-btn) {
      min-width: 40px;
    }
  }
  :deep(.v-btn) {
    height: 40px;
    padding: 0 24px;
    font-size: 14px;
    line-height: 16px;

    .v-btn__append .v-icon,
    .v-btn__prepend .v-icon {
      font-size: 14px;
    }
  }
}
.btn-extra-small {
  &.isCircle {
    :deep(.v-btn) {
      min-width: 32px;
    }
  }
  :deep(.v-btn) {
    height: 32px;
    padding: 0 24px;
    font-size: 14px;
    line-height: 16px;

    .v-btn__append .v-icon,
    .v-btn__prepend .v-icon {
      font-size: 14px;
    }
  }
}

.btn-xx-small {
  &.isCircle {
    :deep(.v-btn) {
      min-width: 20px;
    }
  }
  :deep(.v-btn) {
    height: 20px;
    font-size: 16px;
    line-height: 16px;

    .v-btn__append .v-icon,
    .v-btn__prepend .v-icon {
      font-size: 16px;
    }
  }
}

.btn-solid {
  :deep(.v-btn) {
    background-color: $color-primary-1;
    color: $color-white;

    &:hover {
      background-color: $color-secondary-2;
    }

    &:active {
      background-color: $color-secondary-3;
    }
    &:disabled {
      background-color: $color-neutral-6;
      color: $color-neutral-5;
    }
  }
}

.btn-soft {
  :deep(.v-btn) {
    background-color: $color-primary-4;
    color: $color-primary-1;

    &:hover {
      background-color: $color-primary-3;
    }

    &:active {
      color: $color-secondary-2;
    }
    &:disabled {
      background-color: $color-neutral-6;
      color: $color-neutral-5;
    }
  }
}
.btn-outline {
  :deep(.v-btn) {
    background-color: $color-background-white;
    color: $color-neutral-2;
    border: 1px solid $color-neutral-5;

    &:hover {
      background-color: $color-neutral-7;
    }

    &:active {
      background-color: $color-neutral-7;
      color: $color-text-black;
      border-color: $color-neutral-3;
    }
    &:disabled {
      background-color: $color-neutral-6;
      color: $color-neutral-5;
    }
  }
}

.btn-text {
  :deep(.v-btn) {
    background-color: transparent;
    color: $color-primary-1;

    &:hover {
      background-color: $color-primary-4;
    }

    &:active {
      background-color: $color-primary-3;
    }
    &:focus {
      border: 1px solid $color-primary-1;
    }
    &:disabled {
      background-color: $color-background-white !important;
      color: $color-neutral-5;
    }
  }
}

.isCircle {
  :deep(.v-btn) {
    padding: 0;
    border-radius: 50%;
    .v-btn__prepend {
      margin-inline-start: 0;
    }
  }
}
</style>
