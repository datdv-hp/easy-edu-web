<script lang="ts" setup>
withDefaults(
  defineProps<{
    icon?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'normal' | 'medium' | 'small';
    height?: string;
    color?: string;
    state?: 'default' | 'error' | 'disabled';
  }>(),
  {
    variant: 'primary',
    size: 'normal',
    state: 'default',
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
    :class="`d-inline-block btn-${variant} btn-${size} state-${state}`"
    class="d-flex align-center justify-center"
  >
    <v-btn
      :icon="icon"
      variant="flat"
      :color="color"
      :style="{ alignItems: 'center', height: height }"
      :disabled="isDisabled"
      :loading="isLoading"
      @click="onClick"
    >
      <template v-if="!icon" #default>
        <slot></slot>
      </template>
    </v-btn>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn) {
  border-radius: 4px;
  border: 1px solid transparent;
  .v-btn__overlay {
    background: unset;
  }
}
.btn-normal {
  :deep(.v-btn) {
    height: 64px;
    width: 64px;
    font-size: 16px;
  }
}
.btn-medium {
  :deep(.v-btn) {
    height: 48px;
    width: 48px;
    min-width: 48px;
    font-size: 16px;
  }
}
.btn-small {
  :deep(.v-btn) {
    height: 32px;
    width: 32px;
    font-size: 8px;
  }
}

.btn-primary {
  :deep(.v-btn) {
    background-color: $color-primary-1;
    color: $color-white;

    &:hover {
      background-color: $color-secondary-2;
    }

    &:active {
      background-color: $color-secondary-3;
    }
    &:focus {
      box-shadow:
        0px 0px 0px 4px #d0d4f7,
        0px 0px 2px #1018280a;
    }
    &:disabled {
      background-color: $color-neutral-6;
      color: $color-neutral-5;
    }
  }
}

.btn-secondary {
  :deep(.v-btn) {
    background-color: transparent;
    color: $color-primary-1;
    border: 1px solid transparent;

    &:hover {
      background-color: $color-primary-4;
    }

    &:active {
      border: 1px solid $color-primary-1;
      background-color: $color-primary-4;
    }
    &:focus {
      background-color: $color-primary-4;
      box-shadow:
        0px 0px 0px 4px #d0d4f7,
        0px 0px 2px #1018280a;
    }
    &:disabled {
      background-color: $color-neutral-6;
      color: $color-neutral-5;
    }
  }
}

.state-error {
  :deep(.v-icon) {
    color: $color-state-error;
  }
}

.state-disabled {
  :deep(.v-icon) {
    color: $color-state-disabled;
  }
}
</style>
