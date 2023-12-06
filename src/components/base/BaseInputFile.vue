<script lang="ts" setup>
import { IFilePreview } from '@/features/syllabus/interfaces';
import { useField } from 'vee-validate';
import InputStatus from './InputStatus.vue';

interface Props {
  name: string;
  multiple?: boolean;
  accept?: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  clearable?: boolean;
  errorMessage?: string;
  inputClass?: string;
  appendIcon?: string;
}
const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  clearable: true,
  inputClass: '',
});
const { errorMessage } = useField<IFilePreview>(props.name);

const emit = defineEmits<{
  (e: 'change', files: File[]): void;
}>();

const onChangeUploadFile = async (files: File[]) => {
  emit('change', files);
};
</script>
<template>
  <div class="d-flex flex-column input-wrapper">
    <label v-if="label" class="text-form-label">
      {{ label }}
      <span v-if="isRequired" class="mark-required">*</span>
    </label>
    <v-file-input
      :class="`file-input text-none ${inputClass}`"
      :accept="accept"
      :multiple="multiple"
      @update:model-value="onChangeUploadFile"
      :placeholder="placeholder"
      counter
      :error="!!errorMessage"
      :error-messages="errorMessage"
      color="primary"
      variant="outlined"
      :append-inner-icon="appendIcon"
      :loading="isLoading"
      :clearable="clearable"
    >
      <template v-slot:selection="{ fileNames }">
        <template v-for="(fileName, index) in fileNames" :key="fileName">
          <v-chip v-if="index < 2" color="primary" size="small" class="me-2">
            {{ fileName }}
          </v-chip>

          <span v-else-if="index === 2" class="mx-2 fz-3_5">
            {{ ` +(${fileNames.length - 2})` }}
          </span>
        </template>
      </template>
    </v-file-input>
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

.file-input {
  :deep(.v-input__prepend) {
    display: none;
  }
  :deep(.v-field__input) {
    align-items: center;
  }
}
</style>
