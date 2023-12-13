<script lang="ts" setup>
import dayjs from '@/plugins/dayjs';
import { capitalize } from 'lodash';
import { ILessonPreviewTime } from '../interfaces';
defineProps<{
  item: ILessonPreviewTime & { error?: string };
}>();
</script>
<template>
  <div class="d-flex align-center gap-2_5">
    <span>{{ item.startTime }}</span>
    <span class="dash"></span>
    <span>{{ item.endTime }}</span>
    <span class="ws-nowrap">{{
      capitalize(dayjs(item.date).format('dddd, YYYY-MM-DD'))
    }}</span>
  </div>
  <div class="mb-1" v-if="!!item.error">
    <span class="error-message">{{ item.error || '' }}</span>
  </div>
</template>
<style lang="scss" scoped>
.dash {
  display: block;
  height: 0px;
  width: 8px;
  margin: 0 4px;
  border: 1px solid $color-neutral-4;
}

.error-message {
  color: $color-state-error;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
}
</style>
