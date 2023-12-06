<script lang="ts" setup>
import { showErrorNotification } from '@/common/helpers';
import { commonApiService } from '@/features/common/services/common.api';
import DragAndDropUpload from '@/features/syllabus/components/DragAndDropUpload.vue';
import PreviewUploadedFileList from '@/features/syllabus/components/PreviewUploadedFileList.vue';
import { fileSizeInMB, fileLinkFromUrl } from '@/features/syllabus/helpers';
import { IFilePreview } from '@/features/syllabus/interfaces';
import { LIMIT_DOCUMENT_SIZE } from '@/features/syllabus/constants';
import { useField } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
interface Props {
  name: string;
}

const { t } = useI18n();
const props = defineProps<Props>();
const {
  value: filesValue,
  setValue: setFiles,
  errorMessage,
} = useField<IFilePreview[]>(props.name);

const uploadProgresses = ref<Record<string, number>>({});
const controllers = {} as Record<string, AbortController>;

function cancelRequest(key: string) {
  delete uploadProgresses.value[key];
  controllers[key].abort();
  delete controllers[key];
}

async function onClickRemoveFile(index: number) {
  const files = filesValue.value;
  const file = files?.[index];
  if (!file) return;
  const key = file.key;
  const url = file?.link;
  if (key && file.isUploading) {
    cancelRequest(key);
  } else if (url) {
    const res = await commonApiService._deleteUploadedFiles([url]);
    if (!res.success) {
      showErrorNotification(res.error || (res.message as string));
    }
  }
  files.splice(index, 1);
  setFiles(files);
}

async function handleUploadFile(file: File) {
  const key = Math.random().toString(32);

  const fileSize = fileSizeInMB(file.size);
  if (fileSize > LIMIT_DOCUMENT_SIZE) {
    const newFile = { name: file.name, mimeType: file.type, isSuccess: false, key };
    setFiles([newFile, ...filesValue.value]);
    showErrorNotification(t('syllabus.error.fileSize'));
    return;
  }

  const newFile = { name: file.name, mimeType: file.type, isUploading: true, key };
  setFiles([newFile, ...filesValue.value]);
  controllers[key] = new AbortController();
  const signal = controllers[key].signal;
  uploadProgresses.value[key] = 0;
  const signedLinkResponse = await commonApiService._getUploadSyllabusSignedUrl(
    file.type,
    { signal: signal },
  );
  if (!signedLinkResponse.success) {
    const files = filesValue.value;
    const index = filesValue.value.findIndex((file) => file.key === key);
    if (index > -1) {
      files[index] = { ...files[index], isUploading: false, isSuccess: false };
      setFiles(files);
    }
    showErrorNotification(t('syllabus.error.contentType'));
    delete uploadProgresses.value[key];
    delete controllers[key];
    return;
  }
  const uploadUrl = signedLinkResponse.data.signedUrl;
  const uploadedResponse = await commonApiService._uploadFile(uploadUrl, file, {
    signal: signal,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.floor(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        uploadProgresses.value[key] = percentCompleted;
      }
    },
  });
  delete uploadProgresses.value[key];
  delete controllers[key];
  if (!uploadedResponse.success) {
    const files = filesValue.value;
    const index = filesValue.value.findIndex((file) => file.key === key);
    if (index > -1) {
      files[index] = { ...files[index], isUploading: false, isSuccess: false };
      setFiles(files);
    }
    return;
  }
  const fileUrl = fileLinkFromUrl(uploadUrl);
  const files = filesValue.value;
  const index = filesValue.value.findIndex((file) => file.key === key);
  if (index > -1) {
    files[index] = {
      ...files[index],
      isUploading: false,
      isSuccess: true,
      link: fileUrl,
      mimeType: file.type,
    };
    setFiles(files);
  }
}

async function handleChangeUploadFiles(files?: File[]) {
  if (!files?.length) return;
  files.map((file) => handleUploadFile(file));
}
</script>
<template>
  <div class="text-form-label">{{ $t('syllabus.form.lectureFile.label') }}</div>
  <DragAndDropUpload
    @change-files="handleChangeUploadFiles"
    accept="video/mp4, video/x-ms-wmv, video/quicktime, application/pdf"
    height="fit-content"
    :image-types-and-size="$t('syllabus.form.lectureFile.fileTypesAndSize')"
    :upload-text="$t('syllabus.form.lectureFile.pressToUpload')"
    :multiple="true"
    :error-message="errorMessage"
  />
  <PreviewUploadedFileList
    :files="filesValue"
    :progress="uploadProgresses"
    @remove-upload-file="onClickRemoveFile"
  />
</template>
<style lang="scss" scoped>
.mark-required {
  color: $color-red;
}
</style>
