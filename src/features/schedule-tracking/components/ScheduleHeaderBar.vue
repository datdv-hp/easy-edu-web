<script setup lang="ts">
import { DATE_TIME_FORMAT, ProfileType, Role } from '@/common/constants';
import { BaseAutoComplete, BaseButton, DatePicker } from '@/components';
import { useUserStore } from '@/features/auth/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import dayjs, { Dayjs } from 'dayjs';
import { useForm } from 'vee-validate';
import { computed, onMounted, watch } from 'vue';
import { ScheduleMode } from '../constants';
import { IScheduleListQuery } from '../interfaces';
import { useScheduleTrackingStore } from '../stores';

const store = useScheduleTrackingStore();
const userStore = useUserStore();

const { values, setFieldValue, handleSubmit } = useForm();
const isShowTeacherDropDown = computed(() => {
  const role = userStore.profile?.userRole;
  if (!role) return false;
  return role === Role.MANAGER || role === Role.MASTER;
});
const initFilterForm = () => {
  setFieldValue('classroomIds', [...(store.scheduleListQuery?.classroomIds || [])]);
  setFieldValue('teacherIds', [...(store.scheduleListQuery?.teacherIds || [])]);

  switch (store.modeView) {
    case ScheduleMode.DAY:
      setFieldValue('month', dayjs());
      break;
    case ScheduleMode.WEEK:
      setFieldValue('month', [
        dayjs(store.scheduleListQuery?.startDate),
        dayjs(store.scheduleListQuery?.endDate),
      ]);
      break;
    case ScheduleMode.MONTH:
      setFieldValue('month', {
        month: dayjs(store.scheduleListQuery?.startDate)
          .startOf('week')
          .month(),
        year: dayjs(store.scheduleListQuery?.startDate)
          .startOf('week')
          .year(),
      });
      break;
    default:
      break;
  }
};
onMounted(() => {
  if (isShowTeacherDropDown.value) {
    store.getTeacherDropdown();
  }
  store.getSubjectDropdown();
  store.getClassroomDropdown();
  initFilterForm();
});

watch(
  () => values,
  (value) => {
    store.setScheduleListQuery(value as IScheduleListQuery);
  },
);

const emit = defineEmits<{
  (event: 'prevOrNextOrToday', val: number): void;
  (event: 'move', diff: number): void;
  (event: 'setDate', date: Dayjs): void;
  (event: 'changeView', view: ScheduleMode): void;
}>();

const getStartDate = (val: number) => {
  const { startDate } = store.scheduleListQuery;
  let _startDate = dayjs(startDate);
  switch (val) {
    case -1: // prev
      _startDate = dayjs(startDate).subtract(1, store.modeView).startOf(store.modeView);

      break;
    case 0: // today
      _startDate = dayjs().startOf(store.modeView);
      break;

    case 1: // next
      _startDate = dayjs(startDate).add(1, store.modeView).startOf(store.modeView);
      break;
  }
  return _startDate;
};

const prevOrNextOrToday = (val: number) => {
  const _startDate = getStartDate(val);
  const _endDate = _startDate.endOf(store.modeView);
  switch (store.modeView) {
    case ScheduleMode.DAY:
      setFieldValue('month', _startDate);
      break;
    case ScheduleMode.WEEK:
      setFieldValue('month', [_startDate, _endDate]);
      break;
    case ScheduleMode.MONTH:
      setFieldValue('month', {
        month: _startDate.month(),
        year: _startDate.year(),
      });
      break;
  }
  store.setScheduleListQuery({
    startDate: _startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    endDate: _endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
  });
  store.getLessonListForSchedule();
  emit('prevOrNextOrToday', val);
};

const changeDate = (value: any) => {
  let startDate = dayjs();
  let endDate = dayjs();

  switch (store.modeView) {
    case ScheduleMode.DAY:
      startDate = dayjs(value);
      endDate = dayjs(value);
      break;
    case ScheduleMode.WEEK:
      startDate = dayjs(value[0]);
      endDate = dayjs(value[1]);
      break;
    case ScheduleMode.MONTH:
      startDate = dayjs().date(1).month(value.month).year(value.year).startOf('month');
      endDate = dayjs().date(1).month(value.month).year(value.year).endOf('month');
      break;
  }
  setFieldValue('month', value);
  store.setScheduleListQuery({
    startDate: startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    endDate: endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
  });
  store.getLessonListForSchedule();
  emit('setDate', startDate);
};
const submit = handleSubmit((value) => {
  store.setScheduleListQuery({
    subjectIds: value?.subjectIds || undefined,
    classroomIds: value?.classroomIds || undefined,
    teacherIds: value?.teacherIds || undefined,
  });
  store.getLessonListForSchedule();
});
const changeModeView = (view: string) => {
  let startDate = dayjs(store.scheduleListQuery.startDate);
  let endDate = dayjs(store.scheduleListQuery.endDate);
  switch (view) {
    case ScheduleMode.DAY:
      startDate = dayjs();
      endDate = dayjs();
      setFieldValue('month', startDate);
      break;
    case ScheduleMode.WEEK:
      startDate = dayjs().startOf('week');
      endDate = dayjs().endOf('week');
      setFieldValue('month', [startDate, endDate]);
      break;
    case ScheduleMode.MONTH:
      startDate = dayjs().startOf('month');
      endDate = dayjs().endOf('month');
      setFieldValue('month', {
        month: startDate.month(),
        year: startDate.year(),
      });
      break;
  }
  store.setModeView(view as ScheduleMode);
  store.setScheduleListQuery({
    startDate: startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    endDate: endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
  });
  store.getLessonListForSchedule();
  emit('setDate', dayjs());
  emit('changeView', view as ScheduleMode);
};

const subjectOptions = computed(() => {
  const type = userStore.profile?.type;
  if (type === ProfileType.TEACHER) {
    let subjectIds: string[] = [];
    store.classroomOptions?.forEach((option) => {
      subjectIds = [...subjectIds, ...(option.other?.subjectIds || [])];
    });
    const _options = store.subjectOptions?.filter((option) => {
      return subjectIds.includes(`${option.value}`);
    });
    return _options;
  }
  return store.subjectOptions;
});

const datePickerOptions = computed(() => {
  switch (store.modeView) {
    case ScheduleMode.WEEK:
      return { week: true, format: DATE_TIME_FORMAT.DD_MM_YYYY_DASH };
    case ScheduleMode.MONTH:
      return { month: true, format: DATE_TIME_FORMAT.MMMM_YYYY };
  }
  return { format: DATE_TIME_FORMAT.DD_MM_YYYY_DASH };
});
</script>
<template>
  <header-bar :title="$t('scheduleTracking.filterForm.classroom.placeholder')">
    <template #title>
      <div class="d-flex gap-2 align-center time-control py-1">
        <div class="title">
          <span>{{ $t('scheduleTracking.title') }}</span>
        </div>
        <BaseButton
          size="small"
          :label="$t('scheduleTracking.today')"
          variant="outline"
          class="ml-8"
          @click="() => prevOrNextOrToday(0)"
        />
        <div>
          <BaseButton
            size="extra-small"
            variant="plain"
            class="navigate-button"
            @click="() => prevOrNextOrToday(-1)"
          >
            <v-icon class="text--black" icon="mdi-chevron-left" size="24"></v-icon>
          </BaseButton>
          <BaseButton
            size="extra-small"
            variant="plain"
            class="navigate-button"
            @click="() => prevOrNextOrToday(1)"
          >
            <v-icon class="text--black" icon="mdi-chevron-right" size="24"></v-icon>
          </BaseButton>
        </div>

        <div class="month-picker">
          <DatePicker
            name="month"
            :monthPicker="datePickerOptions.month"
            :weekPicker="datePickerOptions.week"
            :format="datePickerOptions.format"
            :clearable="false"
            @update:modelValue="changeDate"
          />
        </div>
      </div>
    </template>
  </header-bar>
  <div class="d-flex justify-space-between my-4 mx-4 lesson-filter-form">
    <div class="divided-left"></div>
    <div class="divided-right"></div>
    <v-btn-toggle
      :model-value="store.modeView"
      mandatory
      selected-class="mode-btn-group"
      class="mode-view-btn-group"
      @update:modelValue="changeModeView"
    >
      <v-btn
        v-for="mode in Object.values(ScheduleMode)"
        size="small"
        rounded="4"
        :key="mode"
        :value="mode"
        class="mode-btn-item"
        :class="`mode-btn-item__${mode}`"
      >
        {{ $t(`scheduleTracking.modeView.${mode}`) }}</v-btn
      >
    </v-btn-toggle>
    <v-menu></v-menu>
    <div class="d-flex gap-4 justify-end align-center filter-form">
      <div class="flex-1-1 dropdown-filter-wrap">
        <BaseAutoComplete
          name="classroomIds"
          :placeholder="$t('scheduleTracking.filterForm.classroom.placeholder')"
          :items="store.classroomOptions"
          :no-data-text="$t('scheduleTracking.filterForm.noData')"
          :menuWidth="'400px'"
          clearable
          multiple
        />
      </div>
      <div class="flex-1-1 dropdown-filter-wrap" v-if="isShowTeacherDropDown">
        <BaseAutoComplete
          name="teacherIds"
          :placeholder="$t('scheduleTracking.filterForm.teacher.placeholder')"
          :items="store.teacherOptions"
          :no-data-text="$t('scheduleTracking.filterForm.noData')"
          :menuWidth="'400px'"
          clearable
          multiple
        />
      </div>
      <div class="flex-1-1 dropdown-filter-wrap">
        <BaseAutoComplete
          name="subjectIds"
          :placeholder="$t('scheduleTracking.filterForm.subject.placeholder')"
          :items="subjectOptions"
          :no-data-text="$t('scheduleTracking.filterForm.noData')"
          :menuWidth="'400px'"
          clearable
          multiple
        />
      </div>
      <div>
        <BaseButton
          size="small"
          variant="solid"
          class="search-button"
          @click="submit"
          :label="$t('scheduleTracking.filterForm.searchText')"
        >
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-form {
  min-width: 480px;
}
.schedule-title {
  color: $color-black;
}

.dropdown-filter-wrap {
  width: 154px;
}

.month-picker {
  min-width: 250px;
}
.navigate-button {
  :deep(.v-btn) {
    padding: 0 !important;
  }
  :deep(.v-btn--size-default) {
    min-width: 32px;
  }
}

.lesson-filter-form {
  position: relative;
  .divided-left {
    position: absolute;
    width: 1px;
    height: 16px;
    top: 12px;
    left: 128px;
    border-left: 1px solid $color-neutral-6;
  }
  .divided-right {
    position: absolute;
    width: 1px;
    height: 16px;
    top: 12px;
    left: 246px;
    border-left: 1px solid $color-neutral-6;
  }
}
.mode-btn-group {
  background-color: #6d79e8;
  color: #ffffff;
  text-transform: capitalize;
}

.mode-view-btn-group {
  text-transform: capitalize;
  border: 1px solid $color-neutral-6;
  border-radius: 8px;
  height: 40px !important;
  background-color: #ffffff;
  .mode-btn-item {
    padding: 0 24px;
  }
}

:deep(.mode-view-btn-group .v-btn) {
  text-transform: capitalize;
  font-size: 14px;
  transition: 0.2s ease;
}

:deep(.v-field__input) {
  min-height: 40px !important;
  line-height: 22px !important;
  font-size: 14px !important;
  display: flex;
  align-items: center;
  input {
    align-self: center !important;
  }
}
</style>
