import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IScheduleDetail, IScheduleListQuery } from '../interfaces';
import { IBodyResponse } from '@/common/interfaces';
import { lessonApiService } from '@/features/lesson/lesson.api';
import { transformToSchedule } from '../helpers';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '@/common/constants';

export const useScheduleMoreEventsDialog = defineStore(
  'schedule-more-events-dialog',
  () => {
    const isOpen = ref<boolean>(false);
    const isFetching = ref<boolean>(false);
    const isSubmitting = ref<boolean>(false);
    const list = ref<IScheduleDetail[]>([]);
    const selectedDate = ref<string>('');

    function open(date: string) {
      selectedDate.value = date;
      isOpen.value = true;
    }

    function close() {
      isOpen.value = false;
      selectedDate.value = '';
      list.value = [];
      isFetching.value = false;
      isSubmitting.value = false;
    }

    async function getLessonListForSchedule(query: IScheduleListQuery) {
      if (!selectedDate.value) return;
      isFetching.value = true;
      const date = dayjs(selectedDate.value).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN);
      const response: IBodyResponse<IScheduleDetail[]> =
        await lessonApiService.getListForSChedule({
          ...query,
          startDate: date,
          endDate: date,
        });
      if (response.success) {
        list.value = transformToSchedule(response.data || []);
      }
      isFetching.value = false;
      return response;
    }

    return {
      isOpen,
      open,
      close,
      isFetching,
      isSubmitting,
      selectedDate,
      list,
      getLessonListForSchedule,
    };
  },
);
