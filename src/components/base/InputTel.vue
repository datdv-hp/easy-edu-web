<script setup lang="ts">
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';
import { vMaska, MaskOptions } from 'maska';
import { phoneMask } from '@/common/mask';

interface Props {
  name: string;
  label?: string;
  hint?: string;
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo';
  placeholder?: string;
  isRequired?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  autofocus?: boolean;
  validateOnUpdate?: boolean;
  maxLength?: number;
  mask?: MaskOptions;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outlined',
  isRequired: false,
  autofocus: false,
  validateOnUpdate: true,
  clearable: true,
  mask: () => phoneMask,
});

const {
  value: inputValue,
  errorMessage,
  setValue,
  validate,
} = useField(props.name, undefined, {
  validateOnValueUpdate: props.validateOnUpdate,
});

const emit = defineEmits(['change', 'keydown.enter']);

const onChange = (value: string): void => {
  emit('change', value);
};
const onEnter = (): void => {
  emit('keydown.enter');
};

const onClear = () => {
  emit('change', undefined);
  setValue(undefined);
};

const filter = (evt: KeyboardEvent) => {
  if (!evt.target) return;
  const matched = /^(\d|\s)+$/;
  const expect = (evt.target as HTMLInputElement).value.toString() + evt.key.toString();
  if ((props?.maxLength && expect.length > props.maxLength) || !matched.test(expect)) {
    evt.preventDefault();
  } else {
    return true;
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
      v-maska:[mask]
      density="compact"
      type="text"
      :counter="10"
      v-model="inputValue"
      :placeholder="placeholder"
      :variant="variant"
      color="primary"
      :error="!!errorMessage"
      hide-details
      autocomplete="new-password"
      :readonly="readonly"
      :clearable="clearable"
      :disabled="disabled"
      :autofocus="autofocus"
      @update:model-value="onChange"
      @keydown.enter="onEnter"
      @keypress="(e: KeyboardEvent) => filter(e)"
      @blur.once="validate"
    >
      <template #clear v-if="props.clearable">
        <v-icon
          :color="!!errorMessage ? 'red' : ''"
          icon="mdi-close-circle"
          @click="onClear"
          v-if="props.clearable"
        ></v-icon>
      </template>
    </v-text-field>
    <span class="hint-message" v-if="!!hint">{{ props.hint }}</span>
    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" type="error" />
  </div>
</template>
<style lang="scss" scoped>
.input-wrapper {
  width: 100%;
}

.mark-required {
  color: $color-red;
}

.hint-message {
  margin-top: 4px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #5a5c6f;
}
</style>
