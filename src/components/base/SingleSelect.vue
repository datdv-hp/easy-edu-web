<script lang="ts" setup>
import { useField } from 'vee-validate';
import { onMounted } from 'vue';
import InputStatus from './InputStatus.vue';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo';
  size?: 'normal' | 'small';
  items: any[];
  isRequired?: boolean;
  error?: string;
  readonly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  itemTitle?: string | ((item: any) => string);
  itemValue?: string | ((item: any) => any);
  returnObject?: boolean;
  color?: string;
  validateOnUpdate?: boolean;
  defaultSelect?: any;
  noDataText?: string;
  isLoading?: boolean;
  menuWidth?: string;
  valueComparator?: (a: any, b: any) => boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  variant: 'outlined',
  color: 'primary',
  size: 'normal',
  validateOnUpdate: true,
  returnObject: false,
  itemTitle: 'title',
  itemValue: 'value',
  isLoading: false,
  menuWidth: '336px',
});

const {
  errorMessage,
  value: selectedItem,
  setValue,
} = useField(props.name, undefined, {
  initialValue: props.defaultSelect,
  validateOnValueUpdate: props.validateOnUpdate,
});
const emit = defineEmits(['change', 'clear']);

const onUpdateSelection = (value: any) => {
  if (value === null) {
    setValue(undefined);
    return;
  }
  setValue(value);
  emit('change', selectedItem.value);
};

onMounted(() => {
  if (props.defaultSelect) {
    setValue(props.defaultSelect);
  }
});
</script>
<template>
  <div>
    <div v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </div>
    <v-select
      :class="{ clearable }"
      class="input"
      :loading="isLoading"
      density="compact"
      v-model:model-value="selectedItem"
      :placeholder="props.placeholder"
      :items="props.items"
      :variant="props.variant"
      :error="!!errorMessage"
      :item-title="itemTitle"
      :item-value="itemValue"
      :return-object="returnObject"
      :menu-props="{
        maxHeight: 268,
        class: 'select-menu',
        persistent: true,
        closeOnContentClick: true,
        width: menuWidth,
        maxWidth: !menuWidth ? '100%' : undefined,
      }"
      :value-comparator="valueComparator"
      :readonly="readonly"
      hide-details
      :clearable="clearable"
      :color="color"
      :disabled="disabled"
      :noDataText="noDataText || $t('common.noDataText')"
      menu-icon="mdi-chevron-down"
      @update:model-value="(value) => onUpdateSelection(value)"
      @click:clear="$emit('clear')"
    >
      <template #item="{ item }">
        <v-list-item
          :value="item.value"
          :disabled="item.raw.disabled"
          @click="onUpdateSelection(item.value)"
        >
          <span>{{ item.title }}</span>
        </v-list-item>
      </template>
    </v-select>

    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" type="error" />
  </div>
</template>

<style lang="scss" scoped>
.mark-required {
  color: $color-red;
}

.input {
  background-color: $color-white;
}
</style>
