<script setup lang="ts">
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';
import { FORM_VALIDATION } from '@/common/constants';

interface Props {
  name: string;
  label?: string;
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo';
  placeholder?: string;
  isRequired?: boolean;
  value?: string;
  readonly?: boolean;
  clearable?: boolean;
  autoGrow?: boolean;
  rows?: number | string;
  autofocus?: boolean;
  counter?: number;
  maxLength?: number;
  isResize?: boolean;
  hideDetails?: boolean | 'auto';
  labelClass?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outlined',
  isRequired: false,
  autoGrow: false,
  autofocus: false,
  isResize: false,
  counter: FORM_VALIDATION.textAreaMaxLength,
  maxLength: FORM_VALIDATION.textAreaMaxLength,
  hideDetails: true,
  labelClass: 'text-form-label',
});

const { value: inputValue, errorMessage, validate } = useField<string>(props.name);

const emit = defineEmits(['change', 'keydown.enter', 'focus', 'blur']);

const onChange = (value: string): void => {
  emit('change', value);
};
const onEnter = (): void => {
  emit('keydown.enter');
};
const onFocus = (_focused: boolean) => {
  _focused ? emit('focus') : emit('blur');
};
const filter = (evt: KeyboardEvent) => {
  if (!evt.target) return;
  const input = evt.target as HTMLInputElement;
  const cursorPosition = input.selectionStart;
  if (cursorPosition === 0 && evt.key === ' ') {
    evt.preventDefault();
  } else {
    return true;
  }
};
</script>

<template>
  <div class="d-flex flex-column input-wrapper">
    <label v-if="label" :class="labelClass">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <v-textarea
      v-model="inputValue"
      density="compact"
      class="input"
      :rows="props?.rows"
      :placeholder="props.placeholder"
      :variant="props.variant"
      color="primary"
      :error="!!errorMessage"
      :hide-details="hideDetails"
      spellcheck="false"
      :readonly="readonly"
      :clearable="clearable"
      :auto-grow="props.autoGrow"
      :autofocus="props.autofocus"
      :no-resize="!isResize"
      :counter="counter"
      :maxLength="maxLength"
      :disabled="disabled"
      @update:model-value="onChange"
      @keydown.enter="onEnter"
      @update:focused="(focused) => onFocus(focused)"
      @keypress="(evt: KeyboardEvent) => filter(evt)"
      @blur.once="validate"
    />
    <input-status
      class="status-message"
      :is-show="!!errorMessage"
      :message="errorMessage || ''"
      type="error"
    />
    <span v-if="!!counter" class="counter" :class="{ error: !!errorMessage }">{{
      (inputValue?.length || 0) + '/' + maxLength
    }}</span>
  </div>
</template>
<style lang="scss" scoped>
.input {
  background-color: $color-white;
}
.input-wrapper {
  width: 100%;
  position: relative;
}
.counter {
  position: absolute;
  right: 8px;
  color: $color-neutral-3;
  font-size: 12px;
  line-height: 16px;
  bottom: -20px;

  &.error {
    bottom: -4px;
  }
}

.label {
  margin-bottom: 10px;
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #343458;
}

.mark-required {
  color: $color-red;
}

:deep(.v-input__details) {
  position: relative;

  .v-counter {
    position: absolute;
    right: 0;
    font-size: 12px;
    color: $color-neutral-3;
  }
}
:deep(.v-field__input) {
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
</style>
