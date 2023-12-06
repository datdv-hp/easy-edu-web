<script setup lang="ts">
import { ref } from 'vue';
import { useField } from 'vee-validate';
import { translateYupError } from '../../common/helpers';
import InputStatus from './InputStatus.vue';
import icons from '@/assets/icons';
import { computed } from 'vue';

interface Props {
  name: string;
  label?: string;
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo';
  placeholder?: string;
  allowShowPassword?: boolean;
  isRequired?: boolean;
  validateOnUpdate?: boolean;
  clearable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  clearable: true,
  allowShowPassword: true,
  isRequired: false,
  variant: 'outlined',
  validateOnUpdate: true,
});

const emit = defineEmits(['change', 'keydown.enter']);

const onEnter = (): void => {
  emit('keydown.enter');
};

const { value: inputValue, errorMessage } = useField(props.name, undefined, {
  validateOnValueUpdate: props.validateOnUpdate,
});

const isShowPassword = ref(false);

function onClickIconEye() {
  isShowPassword.value = !isShowPassword.value;
}

const icon = computed(() => (isShowPassword.value ? icons.eye : icons.eyeSlash));
</script>

<template>
  <div class="d-flex flex-column input-text-wrapper">
    <label v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <v-text-field
      density="compact"
      :type="isShowPassword ? 'text' : 'password'"
      v-model="inputValue"
      :placeholder="props.placeholder"
      :variant="props.variant"
      :clearable="clearable"
      autocomplete="new-password"
      hide-details
      :error="!!errorMessage"
      color="primary"
      :error-messages="errorMessage ? [translateYupError(errorMessage || '')] : undefined"
      @keydown.enter="onEnter"
    >
      <template v-if="props.allowShowPassword" v-slot:append-inner>
        <img class="cursor-pointer" :src="icon" @click="onClickIconEye" />
      </template>
    </v-text-field>
    <input-status :is-show="!!errorMessage" :message="errorMessage || ''" />
  </div>
</template>
<style lang="scss" scoped>
.input-text-wrapper {
  width: 100%;
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

.error-message {
  color: $color-error-message;
  font-size: 0.6rem;
  padding-left: 1rem;
  margin-top: 4px;
}
</style>
