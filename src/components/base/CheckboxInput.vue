<script lang="ts" setup>
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';

interface Props {
  modelValue?: boolean;
  label?: string;
  name: string;
  validateOnUpdate?: boolean;
  hideError?: boolean;
  fontSize?: string;
  readonly?: boolean;
  labelClass?: string;
  default?: boolean;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  validateOnUpdate: true,
  hideError: true,
  fontSize: '14px',
  labelClass: '',
});

const emit = defineEmits(['change']);

const { errorMessage, value: isChecked } = useField(props.name, undefined, {
  validateOnValueUpdate: props.validateOnUpdate,
  initialValue: !!props.default,
});

const updateModelValue = (value: boolean | null) => {
  emit('change', !!value);
};
</script>
<template>
  <div class="d-flex flex-column">
    <v-checkbox
      :error="!!errorMessage"
      :name="name"
      v-model="isChecked"
      hide-details="auto"
      density="compact"
      class="checkbox-wrapper"
      :class="{ error: !!errorMessage }"
      color="primary"
      :readonly="readonly"
      @update:model-value="updateModelValue"
    >
      <template v-slot:label>
        <v-label
          class="checkbox-label"
          :class="{ error: !!errorMessage, [labelClass]: !!labelClass }"
          :style="{ fontSize: fontSize, lineHeight: '1.5em' }"
          >{{ label }}</v-label
        >
      </template>
    </v-checkbox>
    <input-status
      :is-show="!!errorMessage && !hideError"
      :message="errorMessage || ''"
      type="error"
    />
  </div>
</template>
<style scoped lang="scss">
.checkbox-wrapper {
  font-size: 14px;
  &.error {
    :deep(.v-icon) {
      color: $color-state-error;
    }
  }

  :deep(.v-label) {
    opacity: 1;
  }
}

.checkbox-label {
  margin-bottom: 0;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: $color-neutral-2;
  &.error {
    color: $color-error-message;
  }
}
</style>
