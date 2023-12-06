<script lang="ts" setup>
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';
import { onMounted, ref } from 'vue';

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
  isLoading?: boolean;
  color?: string;
  validateOnUpdate?: boolean;
  defaultSelect?: any;
  multiple?: boolean;
  noDataText?: string;
  isEllipsis?: boolean;
  searchProperty?: string | ((item: any) => string);
  menuWidth?: number | string;
  valueComparator?: (a: any, b: any) => boolean;
  labelClass?: string;
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
  multiple: false,
  clearable: true,
  menuWidth: '336px',
  labelClass: 'text-form-label',
});
const emit = defineEmits(['change']);

const {
  value: selectedItems,
  errorMessage,
  setValue,
  validate,
} = useField<any>(props.name, undefined, {
  validateOnValueUpdate: props.validateOnUpdate,
});
const inputSearch = ref<string>('');

onMounted(() => {
  if (props.defaultSelect) {
    setValue(props.defaultSelect);
  }
});

const onUpdateSelection = (value: any) => {
  emit('change', value);
  inputSearch.value = '';
  if (props.multiple && props.isRequired && value instanceof Array && !value.length) {
    setValue(undefined);
  } else {
    setValue(value);
  }
};

const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const customFilter = (itemText: string, queryText: string) => {
  if (itemText == null || queryText == null) return -1;
  const normalizedQuery = normalizeString(queryText);
  const normalizedItem = normalizeString(itemText);
  return normalizedItem.indexOf(normalizedQuery);
};
const onUpdateSearch = (value: any) => {
  inputSearch.value = value;
};
</script>
<template>
  <div>
    <div v-if="label" :class="labelClass">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </div>
    <v-autocomplete
      v-model:model-value="selectedItems"
      :name="props.name"
      :placeholder="props.placeholder"
      :search="inputSearch"
      :items="props.items"
      :variant="props.variant"
      :error="!!errorMessage"
      :loading="isLoading"
      :disabled="isDisabled"
      :item-title="itemTitle"
      :item-value="itemValue"
      :return-object="returnObject"
      :value-comparator="valueComparator"
      :readonly="readonly"
      density="compact"
      hide-details
      :clearable="clearable"
      :color="color"
      :no-data-text="noDataText || $t('common.noDataText')"
      :multiple="props.multiple"
      :menu-props="{
        maxHeight: 268,
        width: menuWidth,
        maxWidth: !menuWidth ? '100%' : undefined,
        contentClass: 'menu-content',
      }"
      menu-icon="mdi-chevron-down"
      transition="slide-y-transition"
      :class="{
        'max-width-ellipsis':
          selectedItems instanceof Array &&
          (selectedItems || []).length > 1 &&
          isEllipsis,
        clearable: clearable,
      }"
      @update:model-value="onUpdateSelection"
      :custom-filter="(value: string, query: string) => customFilter(value, query)"
      @update:search="onUpdateSearch"
      @blur.once="validate"
    >
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
      <template #details>
        <div></div>
      </template>
    </v-autocomplete>
    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" type="error" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-field) {
  background-color: $color-white;
}
.mark-required {
  color: $color-red;
}

:deep(.v-field__input) {
  flex-wrap: nowrap;
  padding-right: 20px;
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

:global(.v-overlay__content.menu-content .v-list::-webkit-scrollbar) {
  display: block;
  visibility: hidden;
  background-color: #fff;
  width: 8px;
  height: 8px;
}
:global(.v-overlay__content.menu-content .v-list::-webkit-scrollbar-thumb) {
  visibility: hidden;
  background-color: $color-neutral-6;
  border-radius: 6px;
}
:global(.v-overlay__content.menu-content .v-list:hover::-webkit-scrollbar-thumb) {
  visibility: visible;
}

.max-width-ellipsis {
  :deep(.v-autocomplete__selection:first-of-type) {
    max-width: calc(100% - 44px) !important;
  }
}
</style>
