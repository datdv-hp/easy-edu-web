<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    label?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    width?: string;
    size?: 'normal' | 'small';
    buttonClass?: string;
  }>(),
  {
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
  <div :class="`d-inline-block btn-${size} ${width ? 'w-' + width : ''}`">
    <v-btn
      class="text-none w-100"
      :class="buttonClass"
      variant="text"
      :loading="isLoading"
      :style="{ alignItems: 'center' }"
      :disabled="isDisabled"
      @click="onClick"
      :ripple="false"
    >
      <template v-if="!props.label">
        <slot></slot>
      </template>
      <template v-else>
        {{ props.label }}
      </template>
    </v-btn>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn) {
  border: 1px solid transparent;
  padding: 0 2px;
  color: $color-primary-1;
  min-width: unset;

  .v-btn__overlay,
  .v-btn__underlay {
    display: none !important;
  }

  &:hover {
    background-color: unset !important;
    .v-btn__content {
      text-decoration: underline;
    }
  }

  &:active {
    .v-btn__content {
      text-decoration: underline;
    }
  }
  &:focus {
    .v-btn__content {
      text-decoration: underline;
    }
    box-shadow:
      0px 0px 2px 0px #1018280a,
      0px 0px 0px 2px #bfc4ea;
  }
  &:disabled {
    .v-btn__content {
      text-decoration: underline;
      color: $color-neutral-5;
    }
  }
}
.btn-normal {
  :deep(.v-btn) {
    height: 24px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
}
.btn-small {
  :deep(.v-btn) {
    height: 16px;
    font-size: 12px;
    font-weight: 500;
    line-height: 12px;
  }
}
</style>
