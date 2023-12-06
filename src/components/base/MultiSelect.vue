<script lang="ts" setup>
import { useField } from 'vee-validate';
import { translateYupError } from '../../common/helpers';
import InputStatus from './InputStatus.vue';
import { onMounted } from 'vue';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo';
  items: any[];
  isRequired?: boolean;
  error?: string;
  readonly?: boolean;
  clearable?: boolean;
  itemTitle?: string | ((item: any) => string);
  itemValue?: string | ((item: any) => any);
  returnObject?: boolean;
  isDisabled?: boolean;
  menuWidth?: string;
  isLoading?: boolean;
  color?: string;
  validateOnUpdate?: boolean;
  defaultSelect?: any;
  noDataText?: string;
  isEllipsis?: boolean;
  valueComparator?: (a: any, b: any) => boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  variant: 'outlined',
  color: 'primary',
  validateOnUpdate: true,
  isDisabled: false,
  isLoading: false,
  returnObject: false,
  itemTitle: 'title',
  itemValue: 'value',
  isEllipsis: true,
  menuWidth: '336px',
});
const emit = defineEmits(['change', 'enter']);

const {
  value: selectedItems,
  errorMessage,
  setValue,
  validate,
} = useField<any>(props.name, undefined, {
  initialValue: props.defaultSelect,
  validateOnValueUpdate: props.validateOnUpdate,
});

const onUpdateSelection = (value: any) => {
  emit('change', value);
  setValue(value);
};

const onEnter = () => {
  emit('enter');
};

onMounted(() => {
  if (props.defaultSelect) {
    setValue(props.defaultSelect);
  }
});
</script>
<template>
  <div class="d-flex flex-column select-wrapper gap--1">
    <label v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <v-select
      v-model="selectedItems"
      :placeholder="props.placeholder"
      :items="props.items"
      :variant="props.variant"
      :error="!!errorMessage"
      density="compact"
      :loading="isLoading"
      :disabled="isDisabled"
      :item-title="itemTitle"
      :item-value="itemValue"
      :return-object="returnObject"
      :error-messages="errorMessage ? [translateYupError(errorMessage || '')] : undefined"
      :menu-props="{
        maxHeight: 268,
        class: 'select-menu',
        persistent: true,
        width: menuWidth,
        maxWidth: !menuWidth ? '100%' : undefined,
      }"
      :value-comparator="valueComparator"
      :readonly="readonly"
      hide-details
      :clearable="clearable"
      :color="color"
      bg-color="#ffffff"
      :noDataText="noDataText"
      menu-icon="mdi-chevron-down"
      multiple
      :class="{
        'max-width-ellipsis':
          selectedItems instanceof Array &&
          (selectedItems || []).length > 1 &&
          isEllipsis,
        clearable: clearable,
      }"
      @update:model-value="(value) => onUpdateSelection(value)"
      @keydown.enter="onEnter"
      @blur.once="validate"
    >
      <template #item="{ props }">
        <v-list-item v-bind="props" class="select-item">
          <template #prepend="{ isSelected, select }">
            <v-checkbox
              color="primary"
              :model-value="isSelected"
              density="compact"
              @update:model-value="(value) => select(!!value)"
              hide-details
              readonly
              :ripple="false"
            ></v-checkbox>
          </template>
        </v-list-item>
      </template>
      <template v-if="isEllipsis" v-slot:selection="{ item, index }">
        <p v-if="index < 1" class="ellipsis-one-line">
          {{ item.title }}
        </p>
        <p
          v-else-if="index === 1"
          class="ms-2 extra-selection-text"
          style="line-height: inherit"
        >
          {{
            $t('common.multiselectOther', {
              length: `${selectedItems.length - 1}`,
            })
          }}
        </p>
      </template>
    </v-select>
    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" type="error" />
  </div>
</template>

<style lang="scss" scoped>
.mark-required {
  color: $color-red;
}

:global(.v-overlay__content.v-select__content .v-list::-webkit-scrollbar) {
  display: block;
  visibility: hidden;
  background-color: #fff;
  width: 8px;
  height: 8px;
}
:global(.v-overlay__content.v-select__content .v-list::-webkit-scrollbar-thumb) {
  visibility: hidden;
  background-color: $color-neutral-6;
  border-radius: 6px;
}
:global(.v-overlay__content.v-select__content .v-list:hover::-webkit-scrollbar-thumb) {
  visibility: visible;
}

.max-width-ellipsis {
  :deep(.v-select__selection:first-of-type) {
    max-width: calc(100% - 44px) !important;
  }
}

:deep(.v-field--dirty) {
  .v-field__clearable,
  .v-field__append-inner {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-inline-end: 0;
    transition: display 0.2 linear;
  }
  &:hover,
  &:focus-within {
    .v-field__append-inner {
      display: none;
    }
  }
}
</style>
