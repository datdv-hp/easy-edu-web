<script setup lang="ts">
import { useRole } from '@/common/stores/role.store';
import LessonFormDialog from '@/features/lesson/components/LessonFormDialog.vue';
import { useLessonDialog } from '@/features/lesson/stores';
import { Dayjs } from 'dayjs';
import { onMounted, onUnmounted, ref } from 'vue';
import RequestLeaveDialog from '../components/RequestLeaveDialog.vue';
import ScheduleCalendar from '../components/ScheduleCalendar.vue';
import ScheduleDialog from '../components/ScheduleDialog.vue';
import ScheduleHeaderBar from '../components/ScheduleHeaderBar.vue';
import ScheduleMoreEventsDialog from '../components/ScheduleMoreEventsDialog.vue';
import { ScheduleMode, scheduleQueryDefault } from '../constants';
import { convertToSchedule } from '../helpers';
import {
  useReasonDialog,
  useSCheduleTrackingDialog,
  useScheduleMoreEventsDialog,
  useScheduleTrackingStore,
} from '../stores';

const store = useScheduleTrackingStore();
const dialogStore = useSCheduleTrackingDialog();
const moreEventsDialog = useScheduleMoreEventsDialog();
const reasonDialogStore = useReasonDialog();
const role = useRole();
const lessonDialog = useLessonDialog();

const scheduleCalendarRef = ref<typeof ScheduleCalendar>();

onMounted(async () => {
  //
});

onUnmounted(() => {
  store.modeView = ScheduleMode.WEEK;
  store.setScheduleListQuery({
    ...scheduleQueryDefault,
  });
});

function prevOrNextOrToday(val: number) {
  scheduleCalendarRef.value?.prevOrNextOrToday(val);
}

function move(diff: number) {
  scheduleCalendarRef.value?.move(diff);
}

function setDate(date: Dayjs) {
  scheduleCalendarRef.value?.setDate(date.toDate());
}

function handleUpdateLesson(values: Record<string, unknown>) {
  store.detail = convertToSchedule(values);
}

function changeView(view: ScheduleMode) {
  scheduleCalendarRef.value?.changeView(view);
}

function createLessonSuccess() {
  store.getLessonListForSchedule();
}

function handleUpdateNotExisted() {
  dialogStore.close();
  store.getLessonListForSchedule();
}
</script>

<template>
  <ScheduleHeaderBar
    @prevOrNextOrToday="prevOrNextOrToday"
    @move="move"
    @setDate="setDate"
    @changeView="changeView"
  />
  <ScheduleCalendar ref="scheduleCalendarRef" />
  <ScheduleDialog v-if="dialogStore.isOpen" />
  <RequestLeaveDialog
    v-if="
      reasonDialogStore.isOpen &&
      (role.schedule?.attendance || role.schedule?.createRequestLeave)
    "
  />
  <LessonFormDialog
    v-if="lessonDialog.isOpen"
    @update="handleUpdateLesson"
    @createSuccess="createLessonSuccess"
    @update-not-existed="handleUpdateNotExisted"
  />
  <ScheduleMoreEventsDialog v-if="moreEventsDialog.isOpen" />
</template>

<style scoped lang="scss"></style>
