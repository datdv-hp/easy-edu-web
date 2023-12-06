import { DATE_TIME_FORMAT } from '@/common/constants';
import dayjs from '@/plugins/dayjs';
import { capitalize, get } from 'lodash';
import { IClassroom } from '../classroom/interfaces';
import { EDIT_LESSON_TIME_OFFSET, LeaveRequestStatus } from './constants';
import {
  ICreateLeaveRequest,
  ICreateTeacherTimekeeping,
  ILessonLeave,
  ILessonTimeKeeping,
  IOption,
  IScheduleDetail,
  IStudentInLesson,
} from './interfaces';
import { LessonStudentStatus } from '../lesson/constants';
import { Dayjs } from 'dayjs';

const formatDateTime = (date: string, startTime: string, endTime: string) => {
  const formattedStartTime = dayjs(`${date} ${startTime}`).format(
    DATE_TIME_FORMAT.hh_mm_A,
  );
  const formattedEndTime = dayjs(`${date} ${endTime}`).format(DATE_TIME_FORMAT.hh_mm_A);
  const formattedDate = dayjs(date).format('dddd, DD MMMM');
  return `${formattedStartTime}-${formattedEndTime} - ${capitalize(formattedDate)}`;
};

export const transformToSchedule = (data: any[]): IScheduleDetail[] => {
  const transformData = data.map((item) => {
    return convertToSchedule(item);
  });
  return transformData;
};

export const convertToStudentsObj = (params: Record<string, unknown>[]) => {
  return Object.fromEntries(
    params.map((param) => {
      const student = convertToLessonStudent(param);
      return [student.id, student];
    }),
  );
};

export const convertToSchedule = (data: Record<string, unknown>): IScheduleDetail => {
  const startTime = get(data, 'startTime', '') as string;
  const endTime = get(data, 'endTime', '') as string;
  const date = get(data, 'date', '') as string;
  const dateTime = formatDateTime(date, startTime, endTime);
  const documents = get(data, 'documents', []) as string[];
  const isUseGoogleMeet = get(data, 'isUseGoogleMeet') as boolean;
  return {
    id: get(data, '_id', '') as string,
    code: get(data, 'code', '') as string,
    name: get(data, 'name', '') as string,
    course: get(data, 'course') as IOption,
    classroom: get(data, 'classroom') as IClassroom,
    isUseGoogleMeet: isUseGoogleMeet,
    meetUrl: isUseGoogleMeet ? (get(data, 'meetUrl', '') as string) : '',
    room: get(data, 'room', '') as string,
    subject: get(data, 'subject') as IOption,
    teacher: get(data, 'teacher') as IOption,
    date: get(data, 'date', '') as string,
    dateTime,
    documents,
    startTime: get(data, 'startTime', '') as string,
    endTime: get(data, 'endTime', '') as string,
  };
};

export const convertToLessonLeave = (param: Record<string, any>): ILessonLeave => {
  return {
    id: get(param, '_id') as string,
    userId: get(param, 'userId') as string,
    lessonId: get(param, 'lessonId') as string,
    reason: get(param, 'reason') as string,
    status: get(param, 'status') as LeaveRequestStatus,
  };
};

export const convertToLessonStudent = (param: Record<string, any>): IStudentInLesson => {
  const leave = convertToLessonLeave(get(param, 'leave'));
  const timekeeping = convertToLessonTimekeeping(get(param, 'timekeeping'));
  let status = LessonStudentStatus.LEAVE;
  if (timekeeping?.isAttended) {
    status = LessonStudentStatus.ATTENDED;
  } else if (leave.status === LeaveRequestStatus.APPROVED) {
    status = LessonStudentStatus.ABSENCE;
  }
  return {
    id: get(param, '_id') as string,
    name: get(param, 'name', '') as string,
    avatar: get(param, 'avatar') as string,
    code: get(param, 'code') as string,
    leave,
    timekeeping,
    status,
  };
};

export const convertToLessonTimekeeping = (
  param: Record<string, any>,
): ILessonTimeKeeping => {
  return {
    id: get(param, '_id') as string,
    userId: get(param, 'user') as string,
    isAttended: get(param, 'isAttended') as boolean,
    lessonId: get(param, 'lesson') as string,
  };
};

export const convertToCreateLeaveRequestBody = (
  data: Record<string, unknown>,
): ICreateLeaveRequest => {
  return {
    lessonId: get(data, 'lessonId') as string,
    reason: get(data, 'reason') as string,
  };
};

export const convertToCreateTimeKeepingBody = (
  param: Record<string, unknown>,
): ICreateTeacherTimekeeping => {
  return {
    userId: get(param, 'userId') as string,
    lessonId: get(param, 'lessonId') as string,
    isAttended: get(param, 'isAttended', false) as boolean,
  };
};

export const isLessonUpcoming = (date: string, startTime: string) => {
  return dayjs().isBefore(dayjs(`${date} ${startTime}`), 'minute');
};

export const isLessonCompleted = (date: string, endTime: string) => {
  return dayjs().isAfter(dayjs(`${date} ${endTime}`), 'minute');
};

export const isReadOnlyLesson = (startTime: string | Dayjs) => {
  return dayjs(startTime)
    .subtract(EDIT_LESSON_TIME_OFFSET, 'hour')
    .isSameOrBefore(dayjs(), 'minute');
};
