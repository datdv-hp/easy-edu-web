<script setup lang="ts">
import icons from '@/assets/icons';
import { ref } from 'vue';
import { CircleIcon } from '.';

defineProps<{
  icon?: string;
  iconString?: string;
  title: string;
  description?: string | number | string[];
  link?: string;
  isList?: boolean;
  isLinks?: boolean;
}>();
const isCopied = ref(false);

const handleCopyRoom = async (text: string) => {
  await navigator.clipboard.writeText(text);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};
</script>

<template>
  <div>
    <div class="info-title d-flex align-center mb-2">
      <div class="info-icon" v-if="icon">
        <img class="mr-3" :src="icon" alt="" />
      </div>
      <div class="info-string" v-if="iconString">
        <v-icon class="mr-3" :icon="iconString"></v-icon>
      </div>
      {{ title }}
    </div>
    <div v-if="isList" class="info-description">
      <div
        v-for="(item, index) in description as string[]"
        :key="index"
        class="info-content"
      >
        <span>{{ index + 1 + ': ' }}</span>
        <a v-if="isLinks" :href="item" target="_blank" class="link">{{ item }}</a>
        <span v-else>{{ item }}</span>
      </div>
    </div>
    <div v-else-if="link" class="d-flex align-center">
      <a :href="link" class="info-description link" target="_blank">{{ description }}</a>
      <span class="copy-room">
        <CircleIcon
          :icon="isCopied ? icons.schCopiedPurple : icons.schCopyPurple"
          @click="handleCopyRoom((link as string) || '')"
        />
      </span>
    </div>
    <span v-else class="info-description">{{ description }}</span>
  </div>
</template>

<style scoped lang="scss">
.info-title {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: $color-neutral-4;
  .info-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.info-description {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: $color-text-black;
  white-space: pre-line;
}
.info-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.copy-room {
  cursor: pointer;
  transition: transform 100;
  &:hover {
    transform: scale(1.1);
  }
}
.link {
  color: #6d79e8;
  text-decoration: none;
  font-weight: 600;
  &:active,
  &:hover {
    color: #4057d0;
    text-decoration: underline;
  }
}
</style>
