<script lang="ts" setup>
import { IOption } from '@/common/interfaces';
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';

interface Props {
  name: string;
  items: IOption[];
  itemTitle?: string;
  itemValue?: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  color?: string;
  isMultiple?: boolean;
}
type Value = string | number;

const props = withDefaults(defineProps<Props>(), {
  itemTitle: 'title',
  itemValue: 'value',
  color: '#6d79e8',
  isMultiple: true,
});
const emit = defineEmits<{
  (event: 'change', value: string[]): void;
}>();
const { value: selectedItems, errorMessage } = useField<Value[] | Value>(
  props.name,
  undefined,
  {
    initialValue: props.isMultiple ? [] : undefined,
  },
);
const onChange = () => {
  emit('change', selectedItems.value as string[]);
};
</script>
<template>
  <div class="wrapper">
    <label v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <div class="group">
      <v-checkbox
        v-for="(item, index) in items"
        class="fz-3_5"
        :key="index"
        :label="item.title"
        :value="item.value"
        density="compact"
        v-model="selectedItems"
        hide-details="auto"
        :color="color"
        :disabled="isDisabled"
        @update:modelValue="onChange"
      ></v-checkbox>
    </div>
    <InputStatus :is-show="!!errorMessage" :message="errorMessage || ''" type="error" />
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
}
.mark-required {
  color: $color-red;
}
.group {
  display: flex;
}

:deep(.v-label) {
  color: $color-neutral-2;
  font-weight: 500;
  line-height: 20px;
  font-size: 14px;
}
</style>
