<script lang="ts" setup>
import { translateYupError } from '@/common/helpers';
import { useField } from 'vee-validate';

const props = withDefaults(
  defineProps<{
    name: string;
    variant?: 'solo';
    isRequired?: boolean;
    label?: string;
    items: { [key: string]: any }[];
    itemTitle?: string;
    itemValue?: string;
    disabledValues?: any[]; // value[]
    direction?: 'inline' | 'column';
    height?: string; //
    color?: string;
    inline?: boolean;
    density?: null | 'default' | 'comfortable' | 'compact';
  }>(),
  {
    variant: 'solo',
    isRequired: false,
    itemTitle: 'title',
    itemValue: 'value',
    direction: 'inline',
    color: 'primary',
    inline: true,
    density: 'default',
  },
);
const emit = defineEmits<{
  (event: 'change', value: any): void;
}>();
const { value: teacherRoles, errorMessage } = useField(props.name);
const onChange = (value): void => {
  emit('change', value as string);
};
const isDisabledButton = (_value: any) => {
  return !!(props?.disabledValues || []).includes(_value);
};
</script>
<template>
  <div class="d-flex flex-column input-wrapper">
    <label v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <v-radio-group
      :name="props.name"
      :color="color"
      hide-details
      class="d-flex"
      :inline="inline"
      v-model="teacherRoles"
      :error="!!errorMessage"
      :density="density"
      @update:model-value="onChange"
    >
      <v-radio
        class="fw-500 text--neutral-2"
        v-for="(item, index) in items"
        :key="index"
        :label="item[itemTitle]"
        :value="item[itemValue]"
        :style="{ height: height }"
        :disabled="disabledValues && isDisabledButton(item.value)"
      ></v-radio>
    </v-radio-group>
    <span v-if="!!errorMessage" class="error-message">{{
      errorMessage ? translateYupError(errorMessage || '') : undefined
    }}</span>
  </div>
</template>
<style lang="scss" scoped>
.input-wrapper {
  width: 100%;
}

.error-message {
  padding: 6px 16px 0;
  color: $color-error-message;
  font-size: 12px;
  line-height: 12px;
}

.mark-required {
  color: $color-red;
}

:deep(.v-radio) {
  border-radius: 8px;
}
</style>
