<script setup lang="ts">
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';
import { FORM_VALIDATION } from '@/common/constants';
import { vMaska, MaskOptions } from 'maska';

interface Props {
  name: string;
  label?: string;
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo';
  placeholder?: string;
  isRequired?: boolean;
  value?: string;
  readonly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  autofocus?: boolean;
  min?: number;
  matches?: RegExp;
  validateOnUpdate?: boolean;
  isFloatNumber?: boolean;
  decimal?: number;
  mask?: MaskOptions;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outlined',
  isRequired: false,
  autofocus: false,
  validateOnUpdate: true,
  min: 0,
  isFloatNumber: false,
  decimal: 2,
});

const { value: inputValue, errorMessage } = useField(props.name, undefined, {
  validateOnValueUpdate: props.validateOnUpdate,
});

const filter = (evt: KeyboardEvent) => {
  const matchRegex = props.isFloatNumber
    ? FORM_VALIDATION.floatPattern
    : FORM_VALIDATION.intPattern;
  if (!evt.target) return;
  const expect = (evt.target as HTMLInputElement).value.toString() + evt.key.toString();

  if (!(matchRegex as RegExp).test(expect)) {
    evt.preventDefault();
  } else {
    return true;
  }
};

const emit = defineEmits(['change', 'keydown.enter']);

const onChange = (value: string): void => {
  emit('change', value);
};
const onEnter = (): void => {
  emit('keydown.enter');
};
const onPaste = ($event: Event) => {
  if (
    !FORM_VALIDATION.numberRegExp.test(
      ($event as any).clipboardData.getData('text') as string,
    )
  ) {
    $event.preventDefault();
  }
};
</script>

<template>
  <div class="d-flex flex-column input-wrapper">
    <label v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <v-text-field
      :value="value || inputValue"
      v-maska:[props.mask]
      density="compact"
      type="text"
      v-model="inputValue"
      :placeholder="props.placeholder"
      :variant="props.variant"
      color="primary"
      :error="!!errorMessage"
      hide-details
      :readonly="readonly"
      :clearable="clearable"
      :disabled="disabled"
      :autofocus="autofocus"
      :min="min"
      @update:model-value="onChange"
      @keydown.enter="onEnter"
      @keypress="(evt: KeyboardEvent) => filter(evt)"
      @paste="onPaste"
      ref="inputRef"
    ></v-text-field>
    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" type="error" />
  </div>
</template>
<style lang="scss" scoped>
.input-wrapper {
  width: 100%;
}

.error-message {
  color: rgb(234, 84, 85);
  font-size: 0.6rem;
  padding-left: 1rem;
  margin-top: 4px;
}

.mark-required {
  color: $color-red;
}
</style>
