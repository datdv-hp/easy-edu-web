<script setup lang="ts">
import type { DatePickerInstance } from '@vuepic/vue-datepicker';
import VueDatePicker from '@vuepic/vue-datepicker';
import { ref } from 'vue';
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';

interface ITime {
  hours: number;
  minutes: number;
  seconds?: number;
}
interface Props {
  modelValue?: Date | undefined;
  name: string;
  label?: string;
  placeholder?: string;
  color?: string;
  isRequired?: boolean;
  clearable?: boolean;
  variant?: 'solo' | 'none';
  max?: ITime;
  min?: ITime;
  validateOnUpdate?: boolean;
  size?: 'default' | 'small';
  disabled?: boolean;
  readonly?: boolean;
}
interface Emits {
  (e: 'update:modelValue', arg: ITime | undefined): void;
}

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  variant: 'solo',
  validateOnUpdate: true,
  clearable: false,
  size: 'default',
  readonly: false,
});
const emits = defineEmits<Emits>();

const datepicker = ref<DatePickerInstance>(null);

const { value: date, errorMessage } = useField<ITime>(props.name);

const filter = (evt: KeyboardEvent) => {
  const matchRegex = /[0-9:]/;
  if (!evt.target) return;
  const key = evt.key.toString();
  if (!(matchRegex as RegExp).test(key)) {
    evt.preventDefault();
  } else {
    return true;
  }
};

const onModelValueUpdate = (modelData: ITime | undefined) => {
  emits('update:modelValue', modelData);
};
</script>

<template>
  <div class="datepicker-wrapper" :class="`size-${size}`">
    <label v-if="variant === 'solo' && label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <VueDatePicker
      ref="datepicker"
      v-model="date"
      :placeholder="placeholder"
      :clearable="clearable"
      :class="{ errored: !!errorMessage }"
      text-input
      :max-time="max"
      :min-time="min"
      :start-time="min"
      :time-picker="true"
      :disabled="disabled"
      :transitions="false"
      @update:model-value="onModelValueUpdate"
      allow-prevent-default
      menu-class-name="menu"
      :select-text="$t('common.button.choose')"
      :cancel-text="$t('common.button.cancel')"
      :readonly="readonly"
      @keypress="(evt: KeyboardEvent) => filter(evt)"
    >
      <template #input-icon>
        <v-icon class="input-icon" :icon="'mdi-clock-outline'" size="24"></v-icon>
      </template>
      <template #clear-icon="{ clear }">
        <v-icon
          icon="mdi-close-circle"
          class="clear-icon"
          size="24"
          :color="!!errorMessage ? 'red' : ''"
          @click="clear"
          v-if="clearable"
        ></v-icon>
      </template>
    </VueDatePicker>
    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" />
  </div>
</template>

<style scoped lang="scss">
.datepicker-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;

  :deep(.v-field) {
    border-radius: 8px;
  }

  :deep(.label) {
    margin-bottom: 10px;
  }

  :deep(.dp__input_wrap) {
    position: relative;

    .dp__input_icon {
      right: 16px;
      left: unset;
    }

    .dp__clear_icon {
      right: 40px;
      left: unset;
      display: none;
    }

    &:hover .dp__clear_icon {
      display: block;
    }
  }

  :deep(.dp__input) {
    height: 48px;
    padding-left: 16px;
    padding-right: 46px;
    line-height: 32px;
    border-radius: 8px;
    border-color: $color-neutral-6;
    font-family: $font-be-vietnam-pro;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    &::placeholder {
      color: $color-neutral-4;
    }

    &:hover {
      border-color: $color-primary-1;
    }

    &:focus {
      border-color: $color-primary-1;
    }
  }

  &.size-small {
    height: 100%;
    justify-content: center;

    :deep(.dp__input) {
      min-height: 32px;
      height: 32px;
    }
  }
}

:global(.dp__menu_inner) {
  font-family: $font-be-vietnam-pro;
}

.errored {
  :deep(.dp__input) {
    border-color: $color-state-error;

    &:hover {
      border-color: $color-state-error;
    }

    &:focus {
      border-color: $color-state-error;
      box-shadow:
        0px 0px 0px 4px #f7d0d0,
        0px 0px 2px rgba(16, 24, 40, 0.04);
    }
  }
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

.label {
  color: $color-text-secondary;
  opacity: 1;
  font-weight: 500;
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

:deep(.dp__input) {
  min-height: 48px;
  border-radius: 8px;
  transition: 0.2s ease;
}

:deep(.dp-btn) {
  transition: 0.2s ease !important;
}

:deep(.dp__menu_transitioned) {
  background: linear-gradient(0deg, #ffffff, #ffffff),
    linear-gradient(0deg, #f2f4f7, #f2f4f7);
  border: 1px solid #f2f4f7;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 1px 3px 0px #130a2e21 !important;
  box-shadow: 0px 3px 14px 0px #130a2e08 !important;
  box-shadow: 0px 8px 32px 0px #130a2e12 !important;
  box-shadow: 0px 30px 84px 0px #130a2e14 !important;
}

:deep(.dp__time_display) {
  width: 60px;
  height: 40px;
  border: 1px solid #e1e3e9 !important;
  border-radius: 8px;
  font-size: 18px !important;
  margin: 8px 0;
  &:hover {
    background-color: transparent !important;
  }
}

:deep(.dp__inc_dec_button) {
  border: 1px solid #e1e3e9 !important;
  &:hover {
    border: 1px solid #6d79e8 !important;
  }
}

:deep(.dp__inc_dec_button_disabled) {
  &:hover {
    border: 1px solid #e1e3e9 !important;
    background-color: #fff !important;
  }
}

:deep(.dp__inc_dec_button[aria-label='Increment hours']) {
  background-image: url('@/assets/icons/plus.svg');
  background-repeat: no-repeat;
  background-position: center center;
  .dp__icon {
    display: none;
  }
  &:hover {
    background-color: #f2f1ff;
  }
}

:deep(.dp__inc_dec_button[aria-label='Increment minutes']) {
  background-image: url('@/assets/icons/plus.svg');
  background-repeat: no-repeat;
  background-position: center center;
  .dp__icon {
    display: none;
  }
  &:hover {
    background-color: #f2f1ff;
  }
}

:deep(.dp__inc_dec_button[aria-label='Decrement hours']) {
  background-image: url('@/assets/icons/minus.svg');
  background-repeat: no-repeat;
  background-position: center center;
  .dp__icon {
    display: none;
  }
  &:hover {
    background-color: #f2f1ff;
  }
}

:deep(.dp__inc_dec_button[aria-label='Decrement minutes']) {
  background-image: url('@/assets/icons/minus.svg');
  background-repeat: no-repeat;
  background-position: center center;
  .dp__icon {
    display: none;
  }
  &:hover {
    background-color: #f2f1ff;
  }
}

:deep(.dp__time_col) {
  font-size: 20px;
}

:deep(.dp__action_row) {
  width: 250px !important;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  .dp__selection_preview {
    display: none;
  }

  .dp__action_buttons {
    width: 100%;
    margin-left: 0;
    flex: none;
    gap: 12px;
  }

  .dp__action_button {
    width: 142px;
    height: 40px;
    margin-left: 0;
    border-radius: 6px;
  }

  .dp__action_select {
    color: $color-white;
    background-color: #6d79e8;
    &:hover {
      background-color: #4057d0;
    }
    &:active {
      background-color: #1625ab;
    }
  }
  .dp__action_cancel {
    border-color: #adaeba;
    #text {
      display: none;
    }
    &:hover {
      border-color: #adaeba;
      background-color: #f3f4f8;
    }
  }
}

:deep(.dp__overlay_cell_active) {
  border-radius: 10px !important;
  background-color: #6d79e8;
  color: #fff;
}

:deep(.dp__overlay_cell) {
  border-radius: 10px !important;
  transition: 0.2s ease;
  &:hover {
    background-color: #f2f1ff;
    color: #6d79e8;
  }
}

:deep(.dp__overlay_cell_disabled) {
  background-color: #fff !important;
  border-radius: 10px !important;
}

:deep(.dp__overlay_action) {
  color: #959595;
  &:hover {
    background-color: #f2f1ff;
  }
}

:deep(.dp__disabled) {
  border: none !important;
  color: #b2b2bb;
}
</style>
