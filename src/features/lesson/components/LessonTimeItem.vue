<script lang="ts" setup>
import { DATE_TIME_FORMAT, DaysOfWeek } from '@/common/constants';
import {
  BaseGroupCheckbox,
  BaseIconButton,
  DatePicker,
  SingleSelect,
  TimePicker,
} from '@/components';
import { LessonRepeatOption } from '@/features/schedule-tracking/constants';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LessonTimeItemAction } from '../constants';
import { checkActiveDateTime, convertToTimeObj } from '../helpers';
import { ILessonTimeItem } from '../interfaces';
import { onMounted } from 'vue';

const props = defineProps<{
  index: number;
  item: ILessonTimeItem;
  isUpdate?: boolean;
  errorMessage?: string;
  isAbleToUpdate?: boolean;
}>();
const isDisable = ref(false);

const emit = defineEmits<{
  (event: 'clickAction', action: LessonTimeItemAction): void;
}>();

const { t } = useI18n();
const selectedRepeatOption = ref(props.item.repeatOption);

const isFirstItem = computed(() => {
  return props.index === 0;
});
const repeatOptions = computed(() => {
  return Object.values(LessonRepeatOption).map((option) => ({
    title: t(`lesson.form.repeatOption.${option}`),
    value: option,
  }));
});

const dayRepeatOptions = computed(() => {
  const options = Object.keys(DaysOfWeek).map((day) => ({
    title: t(`common.daysOfWeek.${day.toLowerCase()}`),
    value: DaysOfWeek[day],
  }));
  return options;
});

const minStartTime = computed(() => {
  return dayjs(props.item.startDate).isAfter(dayjs(), 'day')
    ? undefined
    : convertToTimeObj();
});
const minEndTime = computed(() => {
  const hours = props.item.startTime?.hours;
  const minutes = props.item.startTime?.minutes;
  return (hours || hours === 0) && (minutes || minutes === 0)
    ? props.item.startTime
    : minStartTime.value;
});

const maxEndTime = computed(() => {
  const hours = props.item.startTime?.hours;
  const minutes = props.item.startTime?.minutes;
  const endTime = dayjs().endOf('day').toDate();
  return ((hours || hours === 0) && (minutes || minutes === 0)) || minStartTime.value
    ? convertToTimeObj(endTime)
    : undefined;
});

const changeRepeatOption = (value: LessonRepeatOption) => {
  selectedRepeatOption.value = value;
};

const clickAction = () => {
  const action = isFirstItem.value
    ? LessonTimeItemAction.ADD
    : LessonTimeItemAction.REMOVE;
  emit('clickAction', action);
};

onMounted(() => {
  if (props.item && props.isUpdate && props.item.startTime) {
    isDisable.value = !checkActiveDateTime(
      dayjs(props.item.startDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_DASH),
      props.item.startTime,
    );
  }
});
</script>
<template>
  <div class="lesson-time-item">
    <div class="d-flex gap-4 align-start mb-2 lesson-time">
      <div class="start-date">
        <DatePicker
          :name="`timeList[${index}].startDate`"
          label=""
          :format="DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN"
          :is-required="true"
          :placeholder="DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN"
          :min="new Date()"
          :max="item.endDate as Date"
          :clearable="false"
          :disabled="isDisable || !isAbleToUpdate"
        />
      </div>
      <div class="start-time">
        <TimePicker
          label=""
          :name="`timeList[${index}].startTime`"
          :placeholder="$t('lesson.form.placeholder.time')"
          :clearable="true"
          :min="minStartTime"
          :max="item.endTime"
          :disabled="isDisable || !isAbleToUpdate"
        />
      </div>

      <div class="to-text">
        <span>{{ $t('lesson.form.to') }}</span>
      </div>

      <div class="end-time">
        <TimePicker
          label=""
          :name="`timeList[${index}].endTime`"
          :placeholder="$t('lesson.form.placeholder.time')"
          :clearable="true"
          :min="minEndTime"
          :max="maxEndTime"
          :disabled="isDisable || !isAbleToUpdate"
        />
      </div>
      <div
        v-if="
          (!isUpdate && selectedRepeatOption !== LessonRepeatOption.NO_REPEAT) ||
          !selectedRepeatOption
        "
        class="end-date"
      >
        <DatePicker
          :name="`timeList[${index}].endDate`"
          label=""
          :format="DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN"
          :is-required="true"
          :placeholder="DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN"
          :min="item.startDate as Date"
          :clearable="false"
          :disabled="isDisable || !isAbleToUpdate"
        />
      </div>
      <div
        v-if="!isUpdate"
        class="repeat-select"
        :style="{
          flex: selectedRepeatOption === LessonRepeatOption.NO_REPEAT ? 5 : 2,
        }"
      >
        <SingleSelect
          :name="`timeList[${index}].repeatOption`"
          label=""
          :placeholder="$t('lesson.form.repeatOption.placeholder')"
          is-required
          :items="repeatOptions"
          :clearable="false"
          :defaultSelect="LessonRepeatOption.NO_REPEAT"
          @change="changeRepeatOption"
          :disabled="isDisable || !isAbleToUpdate"
        />
      </div>
      <div class="action-button" v-if="!isUpdate">
        <BaseIconButton
          :icon="isFirstItem ? 'mdi-plus-circle' : 'mdi-close-circle'"
          size="medium"
          variant="secondary"
          :state="isFirstItem ? 'default' : 'error'"
          @click="clickAction"
          :is-disabled="isDisable || !isAbleToUpdate"
        />
      </div>
    </div>
    <div v-if="selectedRepeatOption === LessonRepeatOption.OTHER_REPEAT && !isUpdate">
      <BaseGroupCheckbox
        :name="`timeList[${index}].repeatDays`"
        :items="dayRepeatOptions"
        :is-disabled="isDisable || !isAbleToUpdate"
      />
    </div>
    <div v-if="errorMessage">
      <span class="error-message">{{ errorMessage }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.lesson-time-item {
  margin: 16px 0;
  .error-message {
    color: $color-state-error;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
  }
}
.start-date,
.end-date {
  flex: 3;
}

.to-text {
  margin-top: 12px;
}

.start-time,
.end-time {
  flex: 2;
}
</style>
