<script lang="ts" setup>
import { VideoPlayer, type VideoPlayerProps } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import { shallowRef } from 'vue';
interface Props {
  src?: string;
  aspectRatio?: string;
  fluid?: boolean;
  controls?: boolean;
  autoplay?: boolean;
  muted?: false;
  playbackRates?: number[];
  playbackRate?: number;
  volume?: number;
}
const props = withDefaults(defineProps<Props>(), {
  aspectRatio: '16:9',
  fluid: true,
  controls: true,
  autoplay: false,
  muted: false,
  playbackRates: () => [0.5, 1, 1.5, 2],
  playbackRate: 1,
  volume: 1,
});

const mediaConfigs = shallowRef<VideoPlayerProps>({
  muted: props.muted,
  playbackRate: props.playbackRate,
  volume: props.playbackRate,
});
</script>
<template>
  <VideoPlayer
    class="rounded-1 video-player"
    :autoplay="autoplay"
    :src="src"
    :aspectRatio="aspectRatio"
    :fluid="fluid"
    :controls="controls"
    :playbackRates="playbackRates"
    v-model:volume="mediaConfigs.volume"
    v-model:muted="mediaConfigs.muted"
    v-model:playbackRate="mediaConfigs.playbackRate"
  ></VideoPlayer>
</template>
<style lang="scss" scoped></style>
