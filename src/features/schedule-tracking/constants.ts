import { DATE_TIME_FORMAT } from '@/common/constants';
import dayjs from 'dayjs';

export enum EventCategory {
  MILESTONE = 'milestone',
  TASK = 'task',
  ALLDAY = 'allday',
  TIME = 'time',
}

export enum LeaveRequestStatus {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  UNAPPROVED = 'UNAPPROVED',
}

export enum DayNameColor {
  TODAY = '#6d79e8',
  DATE = '#1B1B33',
  DAY = '#343458',
  NOW_INDICATOR = '#ED3A3A',
}

export const scheduleQueryDefault = {
  startDate: dayjs().startOf('week').format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
  endDate: dayjs().endOf('week').format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
  teacherIds: [],
  subjectIds: [],
  classroomIds: [],
};

export enum ScheduleMode {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export const EDIT_LESSON_TIME_OFFSET = 8; // hours
export const MIN_LESSON_DURATION_TIME = 1; // hours
export enum LessonRepeatOption {
  NO_REPEAT = 'no_repeat',
  EVERY_DAY = 'every_day',
  EVEN_DAY = 'even_day',
  ODD_DAY = 'odd_day',
  OTHER_REPEAT = 'other_repeat',
}
