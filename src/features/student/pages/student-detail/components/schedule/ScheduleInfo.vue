<script setup lang="ts">
import { useStudentStore } from '@/features/student/stores';
import { LoadingOverlay, ToastUICalendar } from '@/components';
import { ref } from 'vue';

const store = useStudentStore();

const calendarRef = ref<typeof ToastUICalendar>();
const calendars = [{ id: 'cal1', name: 'Personal' }];
const events = [
  {
    id: '1',
    calendarId: 'cal1',
    title: 'Lunch',
    category: 'time',
    start: '2023-06-15 12:00:00',
    end: '2023-06-15 13:30:00',
  },
  {
    id: '2',
    calendarId: 'cal1',
    title: 'Coffee Break',
    category: 'time',
    start: '2023-06-15 15:00:00',
    end: '2023-06-15 15:30:00',
  },
];
</script>
<template>
  <v-card>
    <ToastUICalendar
      class="calendar"
      :calendars="calendars"
      :events="events"
      :is-read-only="true"
      ref="calendarRef"
    />
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style lang="scss" scoped>
.calendar {
  height: calc(100vh - 133px - 110px);
}
:deep(.toastui-calendar-week-view-day-names) {
  overflow: hidden !important;
}
</style>
