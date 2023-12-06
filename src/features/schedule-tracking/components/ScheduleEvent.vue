<template>
  <div class="schedule-event-wrap">
    <div class="text-truncate event-name">
      {{ eventInfo?.title }}
    </div>
    <div class="text-truncate event-time">
      <span v-if="!!eventInfo"> {{ eventInfo.timeString }} </span>
      <span v-if="!!eventInfo?.location">{{ `, ${eventInfo?.location}` }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  eventInfo: Object,
});
</script>

<style lang="scss">
.schedule-event-wrap {
  height: 100%;
  .event-name {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
  }
  .event-time {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
  }
}
</style>
