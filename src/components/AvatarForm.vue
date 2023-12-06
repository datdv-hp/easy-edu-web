<template>
  <div class="d-flex flex-column align-center">
    <div class="avatar-wrap">
      <v-avatar class="showing-avatar mb-4" size="100" :image="avatarUrl"></v-avatar>
      <div v-if="props.value" class="delete-icon" @click="handleClickDeleteAvatar">
        <v-img :src="icons.deleteActive" width="16"></v-img>
      </div>
    </div>
    <v-btn
      class="text-none px-4 text--neutral-2"
      color="#464962"
      variant="outlined"
      @click="onUploadNewAvatar()"
      :loading="loading"
    >
      <template v-slot:prepend>
        <v-img :src="IconUpload"></v-img>
      </template>
      {{ $t('common.button.uploadAvatar') }}
    </v-btn>
    <input
      type="file"
      ref="upload"
      class="d-none"
      accept="image/png, image/jpeg, image/bmp, image/webp"
      @input="handleUploadNewImage"
    />
  </div>
</template>
<script lang="ts" setup>
import AvatarDefault from '@/assets/images/avatar-default.png';
import { ref, computed } from 'vue';
import IconUpload from '@/assets/icons/dialog/ic-upload-cloud.svg';
import { commonApiService } from '@/features/common/services/common.api';
import icons from '@/assets/icons';

const emit = defineEmits<{
  (event: 'avatar-change', url?: string): void;
}>();

const props = defineProps<{ value?: string }>();

async function getUploadSignedUrl(_contentType: string) {
  return await commonApiService._getUploadSignedUrl(_contentType);
}

async function uploadFile(_url: string, _file: File) {
  return await commonApiService._uploadFile(_url, _file);
}
const upload = ref<null | HTMLInputElement>(null);
const loading = ref(false);

const avatarUrl = computed(() => {
  return props.value || AvatarDefault;
});

const onUploadNewAvatar = () => {
  if (!upload.value) return;
  upload.value.click();
};

const handleUploadNewImage = async (event: Event) => {
  const _files = (event.target as unknown as { files: FileList }).files;
  if (!_files.length) return;
  const inputFile = _files[0];
  loading.value = true;
  const response = await getUploadSignedUrl(inputFile.type);
  if (!response.success) {
    return;
  }
  const url = response?.data?.signedUrl;
  const uploadResponse = await uploadFile(url, inputFile);
  loading.value = false;
  if (!uploadResponse.success) {
    return;
  }
  const { origin, pathname } = new URL(url);
  const _url = origin + pathname;
  emit('avatar-change', _url);
};

const handleClickDeleteAvatar = () => {
  emit('avatar-change', '');
};
</script>
<style lang="scss" scoped>
.avatar-wrap {
  position: relative;

  .delete-icon {
    position: absolute;
    right: -8px;
    top: 4px;
    padding: 8px;
    background-color: $color-primary-4;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $color-primary-3;
    }
  }
}
</style>
