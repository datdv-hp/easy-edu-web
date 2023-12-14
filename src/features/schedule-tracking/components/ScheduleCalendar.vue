<script setup lang="ts">
import { DATE_TIME_FORMAT, ErrorCode } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { LoadingOverlay, ToastUICalendar } from '@/components';
import { listColor } from '@/features/classroom/contants';
import { useLessonDialog, useLessonStore } from '@/features/lesson/stores';
import dayjs from '@/plugins/dayjs';
import Calendar, { EventObject } from '@toast-ui/calendar';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  DayNameColor,
  EventCategory,
  MIN_LESSON_DURATION_TIME,
  ScheduleMode,
} from '../constants';
import { isReadOnlyLesson } from '../helpers';
import {
  useSCheduleTrackingDialog,
  useScheduleMoreEventsDialog,
  useScheduleTrackingStore,
} from '../stores';

interface MoreEventsButton {
  date: Date;
  target: HTMLDivElement;
}

const { t } = useI18n();
const store = useScheduleTrackingStore();
const dialogStore = useSCheduleTrackingDialog();
const moreEventsDialogStore = useScheduleMoreEventsDialog();
const lessonStore = useLessonStore();
const lessonDialog = useLessonDialog();
const role = useRole();

const isReadOnly = computed(() => {
  return !role.schedule?.updateLesson && !role.schedule?.createLesson;
});

const calendarRef = ref<typeof ToastUICalendar>();
const calendars = computed(() => {
  return listColor.map((color) => {
    return {
      id: `id_${color}`,
      name: '',
      borderColor: color,
    };
  });
});

const calendarMap = computed(() => {
  const calendarObj = {};
  calendars.value?.forEach((calendar) => {
    calendarObj[calendar.id] = calendar;
  });
  return calendarObj;
});
const events = computed(() => {
  return store.list?.map((item) => {
    const color = item.classroom?.color || listColor[0];
    const isReadOnlyEvent =
      isReadOnlyLesson(`${item.date} ${item.startTime}`) || !role.schedule?.updateLesson;
    return {
      id: item.id,
      calendarId: calendarMap.value?.[`id_${color}`]?.id,
      title: item.name,
      category: EventCategory.TIME,
      start: `${item.date} ${item.startTime}`,
      end: `${item.date} ${item.endTime}`,
      location: item.isUseGoogleMeet ? item.meetUrl : item.room,
      color: '#ffffff',
      backgroundColor: color,
      borderColor: color,
      raw: item,
      isReadOnly: isReadOnlyEvent,
    };
  });
});

const calendarInstance = computed(() => {
  return calendarRef.value?.getCalendarInstance() as Calendar;
});

onMounted(() => {
  store.getLessonListForSchedule();
});

function prevOrNextOrToday(val: number) {
  switch (val) {
    case -1:
      calendarInstance?.value?.prev();
      break;
    case 0:
      calendarInstance?.value?.today();
      break;
    case 1:
      calendarInstance?.value?.next();
      break;
  }
}

function move(diff: number) {
  calendarInstance?.value?.move(diff);
}
function setDate(date: Date) {
  calendarInstance?.value?.setDate(date);
}

function clickEvent({ event }: EventObject) {
  dialogStore.open(event.id);
}

const template = {
  time(event) {
    const dNoneClass = store.modeView === ScheduleMode.MONTH ? 'd-none' : '';
    const monthTitleClass =
      store.modeView === ScheduleMode.MONTH ? 'schedule-event--month-title' : '';
    const start = dayjs(event.start).format(DATE_TIME_FORMAT.hh_mm_A);
    const end = dayjs(event.end).format(DATE_TIME_FORMAT.hh_mm_A);
    const title = `${store.modeView === ScheduleMode.MONTH ? start : ''} ${event.title}`;
    return `
        <div class="schedule-event" style="height: 100%">
            <div class="schedule-event--title text-truncate ${monthTitleClass}">${title}</div>
            <div class="schedule-event--time text-truncate ${dNoneClass}">
                <span>${start}-${end}</span>
            </div>
            <div class="schedule-event--time text-truncate ${dNoneClass}">
                <span>${event.location}</span>
            </div>
        </div>`;
  },
  weekDayName(model) {
    const isToday = dayjs(model.dateInstance).isSame(dayjs(), 'day');
    const todayClass = isToday ? 'schedule-day-name__today' : '';
    return `<span
                    class="toastui-calendar-day-name__date schedule-day-name__date ${todayClass}"
                >
                    ${model.date}
                </span>&nbsp;&nbsp;
                <span
                    class="toastui-calendar-day-name__name schedule-day-name__name ${todayClass}"
                >
                    ${t(`scheduleTracking.weekDay.${model.day}`)}
                </span>`;
  },
  monthDayName(model) {
    return `<span
                    class="schedule-day-name__name"
                >
                    ${t(`scheduleTracking.weekDay.${model.day}`)}
                </span>`;
  },
  timegridDisplayPrimaryTime({ time }) {
    const timeFormat = dayjs(time).format(DATE_TIME_FORMAT.h_A);
    return `<span style="
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px;
                    letter-spacing: 0em;
                    color: '#6D6F81';
                    ">${timeFormat}</span>`;
  },
  timegridNowIndicatorLabel({ time }) {
    const timeFormat = dayjs(time).format(DATE_TIME_FORMAT.h_mm_A);
    return `<span style="
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px;
                    letter-spacing: 0em;
                    color: ${DayNameColor.TODAY};
                    ">${timeFormat}</span>`;
  },
  monthGridHeader: (cellData) => {
    const date = dayjs(cellData.date).format('D');
    const todayClass = cellData.isToday
      ? 'toastui-calendar-weekday-grid-date-decorator schedule-monthGridHeader__today'
      : '';
    return `<span class="toastui-calendar-weekday-grid-date toastui-calendar-template-monthGridHeader ${todayClass}">${date}</span>`;
  },
  monthGridHeaderExceed: (hiddenEventsCount: number) => {
    return `<span class="">${t('scheduleTracking.hiddenEventsCount', {
      hiddenEventsCount,
    })}</span>`;
  },
};

const theme = {
  common: {
    holiday: {
      color: DayNameColor.DATE,
    },
    saturday: {
      color: DayNameColor.DATE,
    },
    today: {
      color: DayNameColor.TODAY,
    },
    dayName: {
      color: DayNameColor.DAY,
    },
  },
  week: {
    today: {
      color: DayNameColor.TODAY,
    },
    pastDay: {
      color: DayNameColor.DATE,
    },
    nowIndicatorBullet: {
      backgroundColor: DayNameColor.NOW_INDICATOR,
    },
    nowIndicatorToday: {
      border: `2px solid ${DayNameColor.NOW_INDICATOR}`,
    },
    nowIndicatorPast: {
      border: 'none',
    },
  },
};

function changeView(view: ScheduleMode) {
  calendarInstance?.value?.changeView(view);
}

function clickMoreEventsBtn(moreEventsBtnInfo: MoreEventsButton) {
  const { hideAllPopup } = (calendarInstance.value as any).getStoreDispatchers('popup');
  hideAllPopup();
  moreEventsDialogStore.open(
    dayjs(moreEventsBtnInfo.date).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
  );
}

function selectDateTime(info: any) {
  if (!role.schedule?.createLesson) {
    calendarInstance?.value?.clearGridSelections();
    return;
  }
  const start = dayjs(info.start);
  let end = dayjs(info.end);
  calendarInstance?.value?.clearGridSelections();
  if (dayjs().isAfter(start, 'second')) {
    return;
  }
  if (!start.isSame(end, 'day')) {
    return;
  }
  const timeOffset = end.diff(start, 'hour');
  if (timeOffset < MIN_LESSON_DURATION_TIME) {
    end = start.clone().add(MIN_LESSON_DURATION_TIME, 'hour');
  }
  lessonDialog.open('', {
    startTime: {
      hours: start.hour(),
      minutes: start.minute(),
    },
    endTime: {
      hours: end.hour(),
      minutes: end.minute(),
    },
    date: start.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
  });
}

const handleUpdateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `lesson.update.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
    case ErrorCode.GROUP_MAX_QUANTITY:
    case ErrorCode.ITEM_ALREADY_EXIST:
    case ErrorCode.ITEM_INVALID:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('lesson.notification.error.update'));
      break;
  }
};

async function beforeUpdateEvent(e: any) {
  const newEndDate = dayjs(e.changes?.end);
  const newStartDate = dayjs(e.changes?.start || e.event.start);
  if (newEndDate.isBefore(dayjs(), 'minute')) {
    return;
  }

  if (dayjs(e.changes?.start).isBefore(dayjs(), 'minute')) {
    return;
  }
  calendarInstance?.value.updateEvent(e.event.id, e.event.calendarId, {
    ...e.changes,
    isReadOnly: isReadOnlyLesson(newStartDate),
  });
  const res = await lessonStore.update(e.event.id, {
    timeList: [
      {
        startDate: newEndDate.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
        endTime: {
          hours: newEndDate.hour(),
          minutes: newEndDate.minute(),
        },
        startTime: {
          hours: newStartDate.hour(),
          minutes: newStartDate.minute(),
        },
      },
    ],
  });
  if (res.success) {
    showSuccessNotification(t('lesson.notification.success.edit'));
    return;
  }
  if (res?.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  calendarInstance?.value.updateEvent(e.event.id, e.event.calendarId, {
    start: e.event.start,
    end: e.event.end,
    isReadOnly: isReadOnlyLesson(e.event.start),
  });
}

watch(
  () => store.modeView,
  () => {
    moreEventsDialogStore.close();
  },
);

defineExpose({
  prevOrNextOrToday,
  move,
  setDate,
  changeView,
});
</script>
<template>
  <v-card class="mx-4 pa-0">
    <ToastUICalendar
      class="calendar"
      :class="{ readonly: !role.schedule?.createLesson }"
      :calendars="calendars"
      :events="events"
      :is-read-only="isReadOnly"
      ref="calendarRef"
      :template="template"
      :theme="theme"
      @clickEvent="clickEvent"
      @clickMoreEventsBtn="clickMoreEventsBtn"
      @selectDateTime="selectDateTime"
      @beforeUpdateEvent="beforeUpdateEvent"
    />
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style lang="scss" scoped>
.calendar {
  height: calc(100vh - $offset-table-height-without-tab);
  &.readonly {
    :deep(.toastui-calendar-grid-selection) {
      display: none;
    }
  }
}
:deep(.toastui-calendar-week-view-day-names) {
  overflow: hidden !important;
}
.schedule-event {
  :global(.schedule-event--title) {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
  }

  :global(.schedule-event--month-title) {
    line-height: 24px;
  }

  :global(.schedule-event--time) {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
  }

  :global(.schedule-monthGridHeader__today) {
    background-color: $color-primary-1 !important;
    color: #fff;
  }
}
:global(.schedule-day-name__date) {
  color: $color-text-black;
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
}

:global(.schedule-day-name__name) {
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0em;
  color: #343458;
}
:global(.schedule-day-name__today) {
  color: $color-primary-1;
}

:deep(.toastui-calendar-weekday-resize-handle.toastui-calendar-handle-y) {
  display: none;
}
</style>
