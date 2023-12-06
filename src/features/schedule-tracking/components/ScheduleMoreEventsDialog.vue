<script setup lang="ts">
import { DATE_TIME_FORMAT } from '@/common/constants';
import { BaseDialog, CircleIcon } from '@/components';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { onMounted } from 'vue';
import { IScheduleDetail } from '../interfaces';
import {
  useSCheduleTrackingDialog,
  useScheduleMoreEventsDialog,
  useScheduleTrackingStore,
} from '../stores';

const store = useScheduleTrackingStore();
const dialogStore = useScheduleMoreEventsDialog();
const detailDialogStore = useSCheduleTrackingDialog();
onMounted(async () => {
  const query = cloneDeep(store.scheduleListQuery);
  dialogStore.getLessonListForSchedule(query);
});

const onCloseDialog = () => {
  dialogStore.close();
};

const clickEvent = (item: IScheduleDetail) => {
  detailDialogStore.open(item.id);
};
</script>
<template>
  <BaseDialog
    :width="480"
    content-class="ps-6 pe-6 pt-0 pb-6"
    wrapper-class="schedule-more-events-dialog"
    :overlay="dialogStore.isFetching"
    :hide-footer="true"
  >
    <template v-slot:title>
      <span class="title">{{
        dayjs(dialogStore.selectedDate).format(DATE_TIME_FORMAT.dddd_vi_DD_MM_YYYY_DASH)
      }}</span>
    </template>
    <template v-slot:append>
      <CircleIcon
        wrapper-class="bg--neutral-7 cursor-pointer"
        @click="onCloseDialog"
        size="small"
      >
        <v-icon icon="mdi-close" size="24" />
      </CircleIcon>
    </template>

    <div class="event-list">
      <div
        class="event-item cursor-pointer my-1 py-1 px-3"
        v-for="item in dialogStore.list || []"
        :key="item.id"
        @click="() => clickEvent(item)"
      >
        <span
          class="toastui-calendar-weekday-event-dot"
          :style="{
            backgroundColor: item.classroom?.color,
          }"
        ></span>
        <span class="pl-4 text-truncate">{{ item.name }}</span>
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.title {
  text-transform: capitalize;
}
.event-item:hover {
  background-color: $color-primary-4;
  border-radius: 4px;
}
:global(.schedule-more-events-dialog .v-card .v-card-item) {
  padding: 16px 24px 8px 24px !important;
  border-bottom: unset;
}
</style>
