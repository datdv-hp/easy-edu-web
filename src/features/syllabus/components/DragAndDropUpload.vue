<script lang="ts" setup>
import { translateYupError } from '@/common/helpers';
import { LoadingOverlay } from '@/components';
import { ref } from 'vue';
import { VFileInput } from 'vuetify/lib/components/index.mjs';

interface Props {
  accept?: string;
  height?: string;
  width?: string;
  multiple?: boolean;
  imageTypesAndSize?: string;
  uploadText?: string;
  isLoading?: boolean;
  errorMessage?:
    | string
    | {
        i18nKey: string;
        params?: Record<string, string>;
      };
}
withDefaults(defineProps<Props>(), {
  accept: 'image/*, video/*, application/pdf',
  height: '74px',
  width: '100%',
  multiple: false,
});
const emit = defineEmits<{ (e: 'changeFiles', files?: File[]): void }>();
const isDragging = ref(false);
const fileInput = ref<VFileInput | null>(null);
const currentUploadFile = ref<File[]>();

function dragover(e: DragEvent) {
  e.preventDefault();
  isDragging.value = true;
}

function dragleave() {
  isDragging.value = false;
}
async function onChangeUploadFile(files: File[]) {
  emit('changeFiles', files);
  if (currentUploadFile.value?.length) {
    currentUploadFile.value = [];
  }
}

function drop(e: DragEvent) {
  e.preventDefault();
  if (!fileInput.value) return;
  currentUploadFile.value = Array.from(e.dataTransfer?.files || []);
  onChangeUploadFile(currentUploadFile.value);
  isDragging.value = false;
}

function onClickUpload() {
  fileInput.value?.click();
}
</script>
<template>
  <div
    class="dropzone-container text-center"
    :class="{ error: !!errorMessage }"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <v-file-input
      class="d-none"
      v-model="currentUploadFile"
      ref="fileInput"
      :accept="accept"
      :multiple="multiple"
      @update:model-value="onChangeUploadFile"
    />
    <div class="text-center fz-3_5">
      <div>
        <span class="upload-text" @click="onClickUpload">{{
          uploadText || $t('syllabus.form.image.pressToUpload')
        }}</span>
        <span>{{ $t('syllabus.form.image.orDragAndDrop') }}</span>
      </div>
      <div v-if="imageTypesAndSize">{{ imageTypesAndSize }}</div>
    </div>
    <LoadingOverlay :loading="isLoading" :size="30" />
  </div>
  <div class="error-message" v-if="errorMessage">
    {{ translateYupError(errorMessage || '') }}
  </div>
</template>
<style lang="scss" scoped>
.dropzone-container {
  position: relative;
  width: v-bind(width);
  padding: 16px;
  height: v-bind(height);
  border-radius: 12px;
  border: 1px dashed $color-primary-2;
  background-color: $color-white;

  .upload-text {
    color: $color-primary-1;
    font-weight: 600;
    &:hover {
      cursor: pointer;
    }
  }
  &.error {
    border-color: #ed3a3a;
  }
}
.error-message {
  margin-top: 4px;
  color: #ed3a3a;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
}
</style>
