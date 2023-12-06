<script setup lang="ts">
import { VideoPlayer } from '.';

defineProps<{
  icon: string;
  title: string;
  description?: string[];
}>();
</script>

<template>
  <div>
    <div class="info-title d-flex align-center mb-2">
      <img class="mr-3" :src="icon" alt="" />
      {{ title }}
    </div>
    <v-row>
      <v-col v-for="(src, index) in description" :key="index" cols="12">
        <VideoPlayer class="video" :src="src" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.info-title {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: $color-neutral-4;
}

.info-description {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: $color-text-black;
}

.video {
  min-width: 320px !important;
  min-height: 180px !important;
  width: 400px !important;
  padding: 0 !important;
  border-radius: 8px;
  overflow: hidden;
}
</style>
