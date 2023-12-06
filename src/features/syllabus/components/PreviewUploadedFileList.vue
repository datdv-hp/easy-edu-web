<script lang="ts" setup>
import { IFilePreview } from '../interfaces';

interface Props {
  files: IFilePreview[];
  progress: Record<string, number>;
}

const emit = defineEmits<{
  (e: 'removeUploadFile', index: number);
}>();
withDefaults(defineProps<Props>(), {});
function handleRemoveFile(index: number) {
  emit('removeUploadFile', index);
}
</script>
<template>
  <v-list class="preview-uploaded-files" density="compact" bg-color="transparent">
    <v-list-item
      v-for="(file, index) in files"
      :key="index"
      density="compact"
      class="pa-0 uploaded-file"
      :height="24"
      :min-height="24"
    >
      <template #default>
        <div class="d-flex align-center">
          <span class="d-flex align-center">
            <v-icon
              v-show="!(file.isSuccess === false)"
              icon="$syllabus.file"
              color="#343458"
              class="preview-icon"
            />
            <v-icon
              v-show="file.isSuccess === false && !file.isUploading"
              icon="$syllabus.info-circle"
              color="#ed3a3a"
              class="preview-icon"
            />
          </span>
          <span class="file-name">{{ file.name }}</span>
          <span
            v-show="file.isSuccess === false && !file.isUploading"
            class="error-upload-text"
            >{{ $t('syllabus.error.upload') }}</span
          >
          <v-spacer></v-spacer>
          <span class="d-flex align-center mr-1">
            <v-icon
              v-show="file.isSuccess"
              icon="$syllabus.check-circle"
              color="#439f6e"
              class="ma-0 success-state preview-icon"
            />
            <v-icon
              icon="$syllabus.close"
              color="#343458"
              class="ma-0 remove-file preview-icon"
              @click.stop="handleRemoveFile(index)"
            />
          </span>
          <span class="counter-progress" v-if="file.key && file.isUploading"
            >{{ progress[file.key] }}%</span
          >
        </div>
        <v-progress-linear
          v-if="file.key && file.isUploading"
          :style="{ width: 'calc(100% - 14px)' }"
          location="bottom"
          color="#6D79E8"
          bg-color="#BFC4EA"
          bg-opacity="1"
          rounded-bar
          absolute
          :model-value="progress[file.key]"
          height="2"
        />
      </template>
    </v-list-item>
  </v-list>
</template>
<style lang="scss" scoped>
.uploaded-file {
  border-radius: 4px;
  &div:not(:first-of-type) {
    margin-top: 10px;
  }
  &:hover {
    background-color: #e5e5f5;
    color: $color-primary-1;

    .remove-file {
      display: block;
    }

    .success-state,
    .counter-progress {
      display: none;
    }
  }

  .file-name {
    font-size: 12px;
    line-height: 23px;
    color: $color-neutral-1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.remove-file {
  cursor: pointer;
  display: none;
}
.counter-progress {
  font-size: 12px;
  color: $color-neutral-1;
}
.preview-icon {
  font-size: 12px;
  height: 12px;
  width: 12px;
  margin: 0 6px;
}

.error-upload-text {
  margin: 0 6px 0 20px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0;
  color: #6d6f81;
}
</style>
