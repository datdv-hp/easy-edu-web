<script setup lang="ts">
import type { EventObject, Options } from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import Calendar from '@toast-ui/calendar';
import { onMounted, ref, watch } from 'vue';

export interface SelectDateTimeInfo {
  start: Date;
  end: Date;
  isAllday: boolean;
  nativeEvent?: MouseEvent;
  gridSelectionElements: Element[];
}
interface UpdatedEventInfo {
  event: EventObject;
  changes: EventObject;
}
interface DayNameInfo {
  date: string;
}
interface EventInfo {
  event: EventObject;
  nativeEvent: MouseEvent;
}
interface MoreEventsButton {
  date: Date;
  target: HTMLDivElement;
}

interface Props extends Options {
  events: EventObject[];
}

const props = withDefaults(defineProps<Props>(), {
  defaultView: 'week',
  useFormPopup: false,
  useDetailPopup: false,
  isReadOnly: undefined,
  usageStatistics: undefined,
  eventFilter: undefined,
  week: () => ({
    startDayOfWeek: 1,
    dayNames: [],
    narrowWeekend: false,
    workweek: false,
    showNowIndicator: true,
    showTimezoneCollapseButton: false,
    timezonesCollapsed: false,
    hourStart: 0,
    hourEnd: 24,
    eventView: ['time'],
    taskView: false,
    collapseDuplicateEvents: false,
  }),
  month: () => ({
    dayNames: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    visibleWeeksCount: 0,
    workweek: false,
    narrowWeekend: false,
    startDayOfWeek: 1,
    isAlways6Weeks: false,
    visibleEventCount: 6,
  }),
  gridSelection: undefined,
  timezone: undefined,
  theme: undefined,
  template: undefined,
  calendars: undefined,
});
const calendarInstance = ref<Calendar>();
const container = ref<HTMLDivElement>();

const emit = defineEmits<{
  selectDateTime: [info: SelectDateTimeInfo];
  beforeCreateEvent: [event: EventObject];
  beforeUpdateEvent: [updatedEventInfo: UpdatedEventInfo];
  beforeDeleteEvent: [event: EventObject];
  afterRenderEvent: [event: EventObject];
  clickDayName: [dayNameInfo: DayNameInfo];
  clickEvent: [eventInfo: EventInfo];
  clickMoreEventsBtn: [moreEventsBtnInfo: MoreEventsButton];
  clickTimezonesCollapseBtn: [prevCollapsedState: boolean];
}>();

function getCalendarInstance() {
  return calendarInstance.value;
}

defineExpose({
  getCalendarInstance,
});

onMounted(() => {
  if (!container.value) {
    return;
  }
  calendarInstance.value = new Calendar(container.value, {
    defaultView: props.defaultView,
    useFormPopup: props.useFormPopup,
    useDetailPopup: props.useDetailPopup,
    isReadOnly: props.isReadOnly,
    usageStatistics: props.usageStatistics,
    eventFilter: props.eventFilter,
    week: props.week,
    month: props.month,
    gridSelection: props.gridSelection,
    timezone: props.timezone,
    theme: props.theme,
    template: props.template,
    calendars: props.calendars,
  });

  if (props.events) {
    calendarInstance.value.createEvents(props.events);
  }
  calendarInstance.value.on('selectDateTime', (info: SelectDateTimeInfo) => {
    emit('selectDateTime', info);
  });
  calendarInstance.value.on('beforeCreateEvent', (event: EventObject) => {
    // open custom popup
    emit('beforeCreateEvent', event);
  });
  calendarInstance.value.on('beforeUpdateEvent', (updatedEventInfo: UpdatedEventInfo) => {
    emit('beforeUpdateEvent', updatedEventInfo);
  });
  calendarInstance.value.on('beforeDeleteEvent', (event: EventObject) => {
    emit('beforeDeleteEvent', event);
  });
  calendarInstance.value.on('afterRenderEvent', (event: EventObject) => {
    emit('afterRenderEvent', event);
  });
  calendarInstance.value.on('clickDayName', (dayNameInfo: DayNameInfo) => {
    emit('clickDayName', dayNameInfo);
  });
  calendarInstance.value.on('clickEvent', (eventInfo: EventInfo) => {
    emit('clickEvent', eventInfo);
  });
  calendarInstance.value.on(
    'clickMoreEventsBtn',
    (moreEventsBtnInfo: MoreEventsButton) => {
      emit('clickMoreEventsBtn', moreEventsBtnInfo);
    },
  );
  calendarInstance.value.on(
    'clickTimezonesCollapseBtn',
    (prevCollapsedState: boolean) => {
      emit('clickTimezonesCollapseBtn', prevCollapsedState);
    },
  );
});

watch(
  () => props.defaultView,
  (value) => {
    calendarInstance.value?.changeView(value);
  },
);
watch(
  () => props.useFormPopup,
  (value) => {
    calendarInstance.value?.setOptions({ useFormPopup: value });
  },
);
watch(
  () => props.useDetailPopup,
  (value) => {
    calendarInstance.value?.setOptions({ useDetailPopup: value });
  },
);
watch(
  () => props.isReadOnly,
  (value) => {
    calendarInstance.value?.setOptions({ isReadOnly: value });
  },
);
watch(
  () => props.eventFilter,
  (value) => {
    calendarInstance.value?.setOptions({ eventFilter: value });
  },
);
watch(
  () => props.week,
  (value) => {
    calendarInstance.value?.setOptions({ week: value });
  },
);
watch(
  () => props.month,
  (value) => {
    calendarInstance.value?.setOptions({ month: value });
  },
);
watch(
  () => props.gridSelection,
  (value) => {
    calendarInstance.value?.setOptions({ gridSelection: value });
  },
);
watch(
  () => props.timezone,
  (value) => {
    calendarInstance.value?.setOptions({ timezone: value });
  },
);
watch(
  () => props.template,
  (value) => {
    calendarInstance.value?.setOptions({ template: value });
  },
);
watch(
  () => props.theme,
  (value) => {
    calendarInstance.value?.setTheme(value);
  },
);
watch(
  () => props.calendars,
  (value) => {
    calendarInstance.value?.setCalendars(value || []);
  },
);
watch(
  () => props.events,
  (value) => {
    calendarInstance.value?.clear();
    calendarInstance.value?.createEvents(value || []);
  },
);
</script>

<template>
  <div ref="container" class="toastui-vue-calendar"></div>
</template>

<style scoped lang="scss">
:deep(
    .toastui-calendar-day-view .toastui-calendar-panel.toastui-calendar-day-view-day-names
  ) {
  overflow-y: hidden !important;
}
:deep(.toastui-calendar-template-time) {
  height: 100% !important;
}
:deep(.toastui-calendar-time) {
  &::-webkit-scrollbar {
    visibility: hidden;
    background-color: #fff;
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    visibility: hidden;
    background-color: $color-neutral-6;
    border-radius: 6px;
  }

  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
:deep(.toastui-calendar-see-more-container) {
  z-index: -1;
}
:deep(.toastui-calendar-timegrid-current-time) {
  visibility: hidden;
}
:deep(.toastui-calendar-timegrid-time) {
  visibility: visible !important;
  &.toastui-calendar-timegrid-time-first {
    visibility: hidden !important;
  }
  &.toastui-calendar-timegrid-time-last {
    visibility: hidden !important;
  }
}

:deep(.toastui-calendar-day-names) {
  border: none !important;
  border-radius: 8px;
}

:deep(.toastui-calendar-layout) {
  border: 1px solid rgb(229, 229, 229);
  border-radius: 4px;
}

:deep(.toastui-calendar-week-view-day-names) {
  height: 43px !important;
}

:deep(.toastui-calendar-time:not(.toastui-calendar-grid-selection)) {
  height: calc(100% - 37px) !important; // 37px is height of header
}

:deep(.toastui-calendar-grid-selection) {
  border-radius: 8px;
}
</style>
