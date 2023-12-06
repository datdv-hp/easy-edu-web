<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, ref } from 'vue';
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { onMounted } from 'vue';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  density?: 'comfortable' | 'compact' | 'default';
  color?: string;
  isRequired?: boolean;
  clearable?: boolean;
  max?: Date;
  min?: Date;
  validateOnUpdate?: boolean;
  format?: string;
  valueType?: 'date' | 'string';
  disabled?: boolean;
  size?: 'default' | 'small';
  monthPicker?: boolean;
  weekPicker?: boolean;
  defaultValue?: Date | string | { month: number; year: number };
  readonly?: boolean;
}
interface Emits {
  (
    e: 'update:modelValue',
    arg: Date | string | undefined | { month: number; year: number },
  ): void;
  (e: 'updateMonthYear', arg: { month: number; year: number }): void;
}

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  validateOnUpdate: true,
  format: 'YYYY-MM-DD',
  clearable: true,
  valueType: 'date',
  size: 'default',
  monthPicker: false,
  weekPicker: false,
  readonly: false,
});
const emits = defineEmits<Emits>();

const isOpen = ref(false);

const {
  value: date,
  errorMessage,
  resetField,
  setValue,
  validate,
} = useField<
  Date | string | { month: number; year: number } | undefined | Date[] | string[]
>(props.name);

const onModelValueUpdate = (modelData: Date | string | undefined) => {
  if (!modelData) {
    resetField();
    emits('update:modelValue', undefined);
  } else if (typeof modelData === 'string' && modelData.length > 0) {
    const _val = props.valueType === 'date' ? new Date(modelData) : modelData;
    setValue(_val);
    emits('update:modelValue', _val);
  } else if (modelData instanceof Date && !isNaN(modelData.valueOf())) {
    const _val =
      props.valueType === 'date' ? modelData : dayjs(modelData).format(props.format);
    setValue(_val);
    emits('update:modelValue', _val);
  } else if (typeof modelData === 'object') {
    const _val =
      props.valueType === 'date' ? modelData : dayjs(modelData).format(props.format);
    setValue(_val);
    emits('update:modelValue', modelData);
  }
  isOpen.value = false;
};

const onClear = () => {
  setValue(undefined);
  emits('update:modelValue', undefined);
};

const updateMonthYear = (value) => {
  emits('updateMonthYear', value);
};

onMounted(() => {
  if (props.defaultValue) {
    setValue(props.defaultValue);
  }
});

const dateValue = computed(() => {
  if (!date.value) return undefined;
  if (props.weekPicker) {
    const _dates = date.value as any[];
    if (!_dates.length) return undefined;
    return `${capitalize(dayjs(_dates[0]).format(props.format))} - ${capitalize(
      dayjs(_dates[1]).format(props.format),
    )}`;
  }
  if (props.monthPicker) {
    const _date = date.value as any;
    return capitalize(dayjs().month(_date.month).year(_date.year).format(props.format));
  }
  return capitalize(dayjs(date.value as any).format(props.format));
});
const onClickOutside = () => {
  validate();
  isOpen.value = false;
};
</script>

<template>
  <div class="d-flex flex-column input-wrapper" :class="`size-${size}`" v-bind="props">
    <label v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <v-text-field
      :class="`size-${size}`"
      ref="inputRef"
      density="compact"
      type="text"
      :counter="10"
      :model-value="dateValue"
      :placeholder="props.placeholder as string"
      variant="outlined"
      color="primary"
      :error="!!errorMessage"
      hide-details
      autocomplete="new-password"
      :readonly="true"
      :clearable="clearable"
      :disabled="disabled"
    >
      <template #append-inner>
        <v-icon
          class="input-icon"
          :icon="'mdi-calendar-blank-outline'"
          size="24"
        ></v-icon>
      </template>
      <template #clear v-if="props.clearable">
        <v-icon
          :color="!!errorMessage ? 'red' : ''"
          icon="mdi-close-circle"
          @click.stop="onClear"
          v-if="props.clearable"
        ></v-icon>
      </template>

      <v-menu
        v-if="!disabled || !readonly"
        v-model="isOpen"
        activator="parent"
        :close-on-content-click="false"
      >
        <VueDatePicker
          @update:model-value="onModelValueUpdate"
          @update-month-year="updateMonthYear"
          :enable-time-picker="false"
          :max-date="max"
          :min-date="min"
          :model-value="date"
          inline
          auto-apply
          locale="vi"
          :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
          :month-picker="props.monthPicker"
          :week-picker="props.weekPicker"
          :readonly="readonly"
          v-click-outside="() => onClickOutside()"
        >
          <template #dp-input=""></template>
        </VueDatePicker>
      </v-menu>
    </v-text-field>
    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" />
  </div>
</template>

<style scoped lang="scss">
.mark-required {
  color: $color-red;
}

.input-wrapper {
  width: 100%;
}

.mark-required {
  color: $color-red;
}

:deep(.dp__menu_inner) {
  padding: 20px;
}

:deep(.dp__month_picker_header) {
  padding: 30px 20px;
}

:deep(.dp__calendar_header_separator) {
  display: none;
}

:deep(.dp__calendar_header_item) {
  font-weight: 400;
}

:deep(.dp__month_year_wrap) {
  padding: 0 6px;
}

:deep(.dp__month_year_select) {
  border-radius: 10px;
}

:deep(.dp__overlay_cell_active) {
  border-radius: 10px !important;
  background-color: $color-primary-1;
  color: #fff;
}

:deep(.dp__overlay_cell) {
  border-radius: 10px !important;
  transition: 0.2s ease;
  &:hover {
    background-color: $color-primary-4;
    color: $color-primary-1;
  }
}

:deep(.dp__button_bottom) {
  color: #959595;
}

:deep(.dp__overlay_cell_disabled) {
  background-color: #fff;
  &:hover {
    background-color: #fff;
  }
}

:deep(.dp__inner_nav) {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e1e3e9;
  transition: all 0.2s ease;
  &:hover {
    background-color: $color-primary-4;
    border: 1px solid $color-primary-1;
    color: inherit;
  }
}

:deep(.dp__cell_inner) {
  border-radius: 10px;
  &:hover {
    background-color: $color-primary-4;
    color: $color-primary-1;
  }

  &.dp__range_between_week {
    border-radius: 0;
    background-color: $color-primary-1;
    color: #fff;
    border-top: 1px solid $color-primary-1;
    border-bottom: 1px solid $color-primary-1;
  }

  &.dp__range_end {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: $color-primary-1;
    color: #fff;
  }

  &.dp__range_start {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: $color-primary-1;
    color: #fff;
  }
  &.dp__cell_auto_range {
    border-radius: 0;
  }
  &.dp__cell_auto_range_end {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &.dp__cell_auto_range_start {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

:deep(.dp__active_date) {
  background-color: $color-primary-1;
  color: #fff;
  &:hover {
    background-color: $color-primary-1;
    color: #fff;
  }
}

:deep(.dp__today) {
  background-color: $color-primary-4;
  color: $color-primary-1;
  border: none;
}

:deep(.dp__cell_offset) {
  &:hover {
    background-color: #fff;
    color: #c0c4cc;
  }
}

:deep(.dp__month_year_select) {
  &:hover {
    background-color: $color-primary-4;
  }
}

:deep(.dp__overlay_action) {
  &:hover {
    background-color: $color-primary-4;
  }
}
</style>
