<template>
  <div class="schedule-day-name-wrap">
    <span
      class="toastui-calendar-day-name__date schedule-date"
      :class="{ 'schedule-date-today': isToday }"
    >
      {{ model?.date }} </span
    >&nbsp;&nbsp;
    <span
      class="toastui-calendar-day-name__name schedule-day-name"
      :class="{ 'schedule-day-name-today': isToday }"
    >
      {{ $t(`scheduleTracking.weekDay.${model?.day}`) }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  model: Object,
  isToday: Boolean,
});
</script>

<style lang="scss">
.schedule-day-name-wrap {
  .schedule-day-name {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0em;
    color: #343458;
  }

  .schedule-day-name-today {
    color: #6d79e8;
  }

  .schedule-date {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    color: #1b1b33;
  }

  .schedule-date-today {
    color: #6d79e8;
  }
}
</style>
