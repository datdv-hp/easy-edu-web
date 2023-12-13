<script lang="ts" setup>
import DragAndDropUpload from '@/features/syllabus/components/DragAndDropUpload.vue';
import { useField } from 'vee-validate';
import syllabusIcons from '@/assets/icons/syllabus';
import { commonApiService } from '@/features/common/services/common.api';
import { ref } from 'vue';
import { showErrorNotification } from '@/common/helpers';
import { useI18n } from 'vue-i18n';
import { fileSizeInMB, fileLinkFromUrl } from '../helpers';
import { LIMIT_COVER_IMAGE_SIZE } from '../constants';

const { value: image, setValue: setCoverImage } = useField<string | null>('image');
const previewImage = ref();
const isUploading = ref(false);
const { t } = useI18n();

async function handleChangeUploadFiles(files?: File[]) {
  if (image.value) {
    commonApiService._deleteUploadedFiles([image.value]);
  }
  const file = files?.[0];
  if (!file) {
    setCoverImage(null);
    return;
  }
  const fileSize = fileSizeInMB(file.size);
  if (fileSize > LIMIT_COVER_IMAGE_SIZE) {
    showErrorNotification(t('syllabus.error.fileSize'));
    return;
  }
  isUploading.value = true;
  const res = await commonApiService._getUploadSyllabusCoverSignedUrl(file.type);
  if (!res.success) {
    isUploading.value = false;
    showErrorNotification(t('syllabus.error.contentType'));
    return;
  }
  const url = res?.data?.signedUrl;
  const uploadResponse = await commonApiService._uploadFile(url, file);
  if (!uploadResponse.success) {
    isUploading.value = false;
    return;
  }
  const imageUrl = fileLinkFromUrl(url);
  setCoverImage(imageUrl);
  isUploading.value = false;
}

function onClearCoverImage() {
  handleChangeUploadFiles([]);
}
function onClickShowFullImage() {
  previewImage.value = image.value;
}
function closePreviewImage() {
  previewImage.value = undefined;
}
</script>
<template>
  <div class="large-form-label mb-4">
    {{ $t('syllabus.form.image.label') }}
  </div>
  <div class="d-flex align-center gap-5">
    <div>
      <v-img
        class="mx-auto"
        :src="syllabusIcons.imageUpload"
        :lazy-src="syllabusIcons.imageUpload"
        height="64"
        width="64"
      />
    </div>
    <DragAndDropUpload
      v-if="!image"
      @change-files="handleChangeUploadFiles"
      accept="image/png, image/jpeg"
      :image-types-and-size="$t('syllabus.form.image.fileTypesAndSize')"
      :is-loading="isUploading"
    />
    <v-hover v-slot="{ isHovering, props }">
      <div v-bind="props" class="preview-container flex-1-1 rounded--3" v-show="image">
        <div class="actions">
          <v-icon class="icon-delete" icon="zoom-in" @click.self="onClickShowFullImage" />
          <v-icon icon="delete-white" @click.self="onClearCoverImage" />
        </div>

        <v-img
          class="rounded--3 mx-auto"
          :src="image || undefined"
          :lazy-src="image || undefined"
          cover
          height="74px"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
        <v-overlay
          :model-value="isHovering"
          :style="{ zIndex: 1 }"
          contained
          scrim="#00000066"
        />
      </div>
    </v-hover>
  </div>
  <v-dialog v-model="previewImage" content-class="preview-image pa-8">
    <v-img :src="previewImage" class="rounded--1" />
    <v-icon icon="custom close-white close-icon" @click="closePreviewImage" />
  </v-dialog>
</template>
<style lang="scss" scoped>
.preview-container {
  position: relative;
  &:hover {
    .actions {
      display: flex;
    }
  }
}
.actions {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 16px;
  z-index: 2;
  opacity: 1;
}

.preview-image {
  .v-responsive {
    flex: auto;
  }
}

.close-icon {
  position: absolute;
  left: 4px;
  top: 36px;
}
</style>
