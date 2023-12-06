<script setup lang="ts">
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';
import { ref } from 'vue';
import { vMaska, MaskOptions } from 'maska';
import { onMounted } from 'vue';
import { FORM_VALIDATION } from '@/common/constants';

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
  regex?: RegExp | string;
  trim?: boolean;
  labelClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outlined',
  isRequired: false,
  autofocus: false,
  validateOnUpdate: true,
  size: 'default',
  maxLength: FORM_VALIDATION.textMaxLength,
  clearable: true,
  trim: false,
  labelClass: 'text-form-label',
});

const {
  value: inputValue,
  errorMessage,
  resetField,
  validate,
} = useField(props.name, undefined, {
  validateOnValueUpdate: props.validateOnUpdate,
});

const emit = defineEmits(['change', 'keydown.enter', 'blur', 'focus']);

const onChange = (value: string): void => {
  emit('change', value);
};
const onEnter = (): void => {
  emit('keydown.enter');
};

const onClear = () => {
  emit('change', undefined);
  resetField({ value: undefined });
};

const focus = (value: boolean) => {
  if (!value) {
    emit('blur');
  }
  if (value) {
    emit('focus');
  }
};

onMounted(() => {
  if (props.maxLength) {
    const input: HTMLElement = inputRef.value.$el.querySelector('input');
    input.setAttribute('maxlength', props.maxLength.toString());
  }
});

const filter = (evt: KeyboardEvent) => {
  if (!evt.target) return;
  const input = evt.target as HTMLInputElement;
  const cursorPosition = input.selectionStart;
  if ((cursorPosition === 0 || props.trim) && evt.key === ' ') {
    evt.preventDefault();
  } else if (props.regex) {
    const expect = (evt.target as HTMLInputElement).value.toString() + evt.key.toString();
    if (!(props.regex as RegExp).test(expect)) {
      evt.preventDefault();
    }
  } else {
    return true;
  }
};

const inputRef = ref<any>();
</script>

<template>
  <div class="input-wrapper">
    <div v-if="label" :class="labelClass">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </div>
    <v-text-field
      v-maska:[props.mask]
      ref="inputRef"
      density="compact"
      type="text"
      :counter="10"
      v-model="inputValue"
      :placeholder="props.placeholder"
      :variant="props.variant"
      color="primary"
      :error="!!errorMessage"
      hide-details
      autocomplete="new-password"
      :readonly="props.readonly"
      :clearable="props.clearable"
      :disabled="props.disabled"
      :autofocus="autofocus"
      :maxLength="maxLength"
      @update:model-value="onChange"
      class="bg-white"
      @keydown.enter="onEnter"
      @keypress="(evt: KeyboardEvent) => filter(evt)"
      @blur.once="validate"
      @update:focused="(e) => focus(e)"
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
