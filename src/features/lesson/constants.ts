import dayjs from 'dayjs';
import { LessonRepeatOption } from '../schedule-tracking/constants';
import { ILessonTimeItem } from './interfaces';

export enum LessonStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export enum LessonFormField {
  PREVIEW_DATA = 'previewData',
}

export enum LessonStudentStatus {
  ABSENCE = 'ABSENCE',
  LEAVE = 'LEAVE',
  ATTENDED = 'ATTENDED',
  UNDEFINED = 'UNDEFINED',
}

export enum LessonTimeItemAction {
  ADD = 'add',
  REMOVE = 'remove',
}

export const lessonTimeItemDefault: ILessonTimeItem = {
  startDate: dayjs(),
  repeatOption: LessonRepeatOption.NO_REPEAT,
  feId: Date.now(),
  repeatDays: [],
};

export const LIMIT_TIME_UPDATE_LESSON =
  import.meta.env.VUE_APP_LIMIT_TIME_UPDATE_LESSON || 8; // hours;
export enum LessonDetailTab {
  ATTENDANCE = 'attendance',
  SYLLABUS = 'syllabus',
}
