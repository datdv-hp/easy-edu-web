<script lang="ts" setup>
import { computed } from 'vue';

type Props = {
  name?: string;
  src?: string;
  fileType?: string;
};
const props = defineProps<Props>();
const emit = defineEmits(['close']);

const isPdf = computed(() => props.fileType?.includes('pdf'));
const isVideo = computed(() => props.fileType?.includes('video'));
</script>
<template>
  <v-dialog content-class="align-center" :model-value="true" height="90%">
    <v-card class="h-100 w-100" v-click-outside="() => emit('close')">
      <div class="pdf-wrap">
        <span class="pdf-title">{{ name }}</span>
        <v-icon class="close-icon" icon="mdi-close" @click.stop="() => emit('close')" />
      </div>
      <iframe
        v-if="isPdf"
        class="pdf-content"
        :src="props.src"
        :title="name"
        loading="lazy"
        width="100%"
        height="100%"
      ></iframe>
      <div v-if="isVideo" class="video-wrap">
        <video
          class="video"
          oncontextmenu="return false;"
          preload="auto"
          controls
          controlsList="nodownload"
        >
          <source :src="src" :type="fileType" :title="name" />
        </video>
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="scss">
.pdf-wrap {
  background-color: $color-neutral-6;
  color: $color-text-black;
  padding: 4px 10px 4px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .pdf-title {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80%;
  }
  .close-icon {
    transition: 0.1s;
    &:hover {
      transform: scale(1.05);
    }
  }
}
.pdf-content {
  border: none !important;
}
.video-wrap {
  display: flex;
  justify-content: space-around;
  height: calc(100% - 36px);
  background-color: rgba(0, 0, 0, 0.9);
}
.video {
  max-width: 100%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
</style>
