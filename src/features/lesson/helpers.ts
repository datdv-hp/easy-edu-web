import { DATE_TIME_FORMAT } from '@/common/constants';
import { removeEmptyValue } from '@/common/helpers';
import { ITime } from '@/common/interfaces';
import dayjs from 'dayjs';
import { difference, get, sortBy, uniqWith } from 'lodash';
import { convertToClassroom } from '../classroom/helpers';
import { convertToCourse } from '../courses/helpers';
import { LessonRepeatOption } from '../schedule-tracking/constants';
import { convertToLessonStudent, isLessonUpcoming } from '../schedule-tracking/helpers';
import { IStudentInLesson } from '../schedule-tracking/interfaces';
import { convertToSubject } from '../subject/helpers';
import { convertSyllabusInfo, convertToSyllabusLectureList } from '../syllabus/helpers';
import { convertToTeacher } from '../teacher/helpers';
import { LIMIT_TIME_UPDATE_LESSON, LessonStatus } from './constants';
import {
  ICreateLessonForm,
  ILessonDetail,
  ILessonInfo,
  ILessonPreviewTime,
  ILessonStudent,
  ILessonTimeItem,
  ILessonTimeObject,
  IListLessonItem,
  IUpdateLessonForm,
} from './interfaces';

export const transformLesson = (data: any[]): IListLessonItem[] => {
  const transformData = data.map((item) => {
    return convertToListLessonItem(item);
  });

  return transformData;
};

export const convertToLesson = (params: Record<string, unknown>): ILessonDetail => {
  const startTime = (params?.startTime as string)?.split(':');
  const endTime = (params?.endTime as string)?.split(':');
  const documents = (params.documents as string[]) || [];
  const recordings = (params.recordings as string[]) || [];
  if (!documents.length) {
    documents.push('');
  }
  if (!recordings.length) {
    recordings.push('');
  }
  return {
    id: params._id as string,
    code: params.code as string,
    name: params.name as string,
    course: convertToCourse(params.course as Record<string, unknown>),
    classroom: convertToClassroom(params.classroom as Record<string, unknown>),
    isUseGoogleMeet: params.isUseGoogleMeet as boolean,
    room: params.room as string,
    syllabusId: get(params, 'syllabusId') as string,
    lectureIds: params.lectureIds as string[],
    subject: convertToSubject(params.subject as Record<string, unknown>),
    teacher: convertToTeacher(params.teacher as Record<string, unknown>),
    date: params.date as string,
    startTime: {
      hours: parseInt(startTime?.[0]),
      minutes: parseInt(startTime?.[1]),
    },
    endTime: {
      hours: parseInt(endTime?.[0]),
      minutes: parseInt(endTime?.[1]),
    },
    documents,
    recordings,
    students: convertToStudentsLesson(params.students as Record<string, unknown>[]),
  };
};

export const convertToStudentsLesson = (
  data: Record<string, unknown>[],
): ILessonStudent[] => {
  return (
    data?.map((param) => ({
      id: param._id as string,
      code: param.code as string,
      name: param.name as string,
    })) || []
  );
};

export const convertToLessonInfo = (data: Record<string, unknown>): ILessonInfo => {
  const startTime = get(data, 'startTime', '') as string;
  const endTime = get(data, 'endTime', '') as string;
  const date = get(data, 'date', '') as string;
  const timeRange = `${startTime} - ${endTime}`;
  const students: IStudentInLesson[] = ((data?.students as any) || []).map((param) =>
    convertToLessonStudent(param),
  );
  const totalParticipants = students.filter(
    (student) => student?.timekeeping?.isAttended,
  ).length;
  const _lectures = get(data, 'lectures', []) as Record<string, unknown>[];
  const _syllabus = get(data, 'syllabus', undefined) as Record<string, unknown>;

  return {
    id: get(data, '_id', '') as string,
    code: get(data, 'code', '') as string,
    name: get(data, 'name', '') as string,
    courseName: get(data, 'course.name', '') as string,
    classroomName: get(data, 'classroom.name', '') as string,
    room: get(data, 'room', '') as string,
    subjectName: get(data, 'subject.name', '') as string,
    teacherName: get(data, 'teacher.name', '') as string,
    isUseGoogleMeet: get(data, 'isUseGoogleMeet', false) as boolean,
    meetUrl: get(data, 'meetUrl', '') as string,
    date,
    totalStudents: students.length,
    totalParticipants: isLessonUpcoming(date, startTime) ? 0 : totalParticipants,
    documents: get(data, 'documents', []) as string[],
    recordings: get(data, 'recordings', []) as string[],
    timeRange,
    status: getLessonStatus(date, startTime, endTime),
    students,
    lectures: convertToSyllabusLectureList(_lectures),
    syllabus: _syllabus ? convertSyllabusInfo(_syllabus) : undefined,
  };
};

export const convertToListLessonItem = (
  params: Record<string, unknown>,
): IListLessonItem => {
  const date = get(params, 'date') as string;
  const startTime = get(params, 'startTime') as string;
  const endTime = get(params, 'endTime') as string;
  return {
    id: params._id as string,
    code: params.code as string,
    isUseGoogleMeet: params.isUseGoogleMeet as boolean,
    name: params.name as string,
    course: get(params, 'course.name', '') as string,
    classroom: get(params, 'classroom.name', '') as string,
    subject: get(params, 'subject.name', '') as string,
    teacher: get(params, 'teacher.name', '') as string,
    status: getLessonStatus(date, startTime, endTime),
    dateTime: formatLessonDate(date, startTime, endTime),
  };
};

export const getLessonCreateFormData = (
  params: Record<string, unknown>,
): ICreateLessonForm => {
  return {
    name: params.name as string,
    classroomId: params.classroomId as string,
    room: params.room as string,
    isUseGoogleMeet: params.isUseGoogleMeet as boolean,
    subjectId: params.subjectId as string,
    teacherId: params.teacherId as string,
    lectureIds: params.lectureIds as string[],
    documents: params.documents as string[],
    recordings: params.recordings as string[],
    times: params.times as ILessonPreviewTime[],
    studentIds: params.studentIds as string[],
  };
};

export const getLessonUpdateFormData = (
  params: Record<string, unknown>,
): IUpdateLessonForm => {
  const isUseGoogleMeet = params.isUseGoogleMeet as boolean;
  const documents = params.documents as string[];
  const recordings = params.recordings as string[];
  const timeList = params.timeList as ILessonTimeItem[];
  const lessonTime = timeList?.[0];
  return {
    name: params.name as string,
    classroomId: params.classroomId as string,
    room: !isUseGoogleMeet ? (params.room as string) : undefined,
    subjectId: params.subjectId as string,
    teacherId: params.teacherId as string,
    syllabusId: params.syllabusId as string,
    lectureIds: params.lectureIds as string[],
    documents: documents ? removeEmptyValue(documents) || null : undefined,
    date: lessonTime?.startDate
      ? dayjs(lessonTime?.startDate).format('YYYY-MM-DD')
      : undefined,
    startTime: lessonTime?.startTime ? timeToString(lessonTime?.startTime) : undefined,
    endTime: lessonTime?.endTime ? timeToString(lessonTime?.endTime) : undefined,
    recordings: recordings ? removeEmptyValue(recordings) || null : undefined,
    isUseGoogleMeet: isUseGoogleMeet,
    studentIds: params.studentIds as string[],
  };
};

function timeToString(time: ILessonTimeObject) {
  return dayjs()
    .hour(time?.hours)
    .minute(time?.minutes)
    .format(DATE_TIME_FORMAT.HH_mm);
}

export function generateLessons(
  params: Record<string, unknown>,
  times: ILessonPreviewTime[],
): ICreateLessonForm {
  const isUseGoogleMeet = get(params, 'isUseGoogleMeet', true) as boolean;
  const createLesson: ICreateLessonForm = {
    name: params.name as string,
    classroomId: params.classroomId as string,
    subjectId: params.subjectId as string,
    teacherId: params.teacherId as string,
    syllabusId: params.syllabusId as string,
    lectureIds: params.lectureIds as string[],
    isUseGoogleMeet: isUseGoogleMeet,
    room: !isUseGoogleMeet ? (params.room as string) : undefined,
    documents: removeEmptyValue(params.document as string[]) || [],
    recordings: removeEmptyValue(params.recordings as string[]) || [],
    times: times.map((time) => {
      return {
        date: time.date,
        startTime: time.startTime,
        endTime: time.endTime,
      };
    }),
    studentIds: params.studentIds as string[],
    googleConfig: isUseGoogleMeet
      ? {
          code: params.code as string,
          redirectUri: params.redirectUri as string,
        }
      : undefined,
  };
  return createLesson;
}
const overlapTimeComparator = (value: any, other: any) => {
  if (value.date !== other.date) return false;
  return !(value.endTime < other.startTime || value.startTime > other.endTime);
};
export function checkOverlapTimes(
  list: ILessonPreviewTime[],
  removeIndexes: number[],
): ILessonPreviewTime[] {
  const _previewTimes = list.filter((_, index) => !removeIndexes.includes(index));
  const listNotOverlap = uniqWith(_previewTimes, overlapTimeComparator);
  return difference(_previewTimes, listNotOverlap);
}

function convertILessonTimeItemToPreview(list: ILessonTimeItem[]): ILessonPreviewTime[] {
  const previewItems = list.map((item) => {
    return {
      date: dayjs(item.startDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
      startTime: timeToString(item.startTime || { hours: 0, minutes: 0, seconds: 0 }),
      endTime: timeToString(item.endTime || { hours: 0, minutes: 0, seconds: 0 }),
      index: item.index,
      feId: item.feId,
    };
  });
  return sortBy(previewItems, 'date') as ILessonPreviewTime[];
}
function generateTimesWithRepeatDays(item: ILessonTimeItem): ILessonTimeItem[] {
  if (!item.startTime || !item.endDate || !item.endTime || !item.repeatDays?.length) {
    return [];
  }
  const result: ILessonTimeItem[] = [];
  let startDate = dayjs(item.startDate);
  if (
    startDate.week() === dayjs().week() &&
    !item.repeatDays?.includes(startDate.day())
  ) {
    result.push(item);
  }
  item.repeatDays?.sort();
  const weekDiff = Math.ceil(dayjs(item.endDate).diff(startDate, 'day') / 7) + 1;
  for (let week = 0; week <= weekDiff; week++) {
    for (const day of item.repeatDays) {
      const date = startDate.day(day);
      if (date.isAfter(dayjs(item.endDate), 'day')) break;
      if (date.isBefore(dayjs(item.startDate), 'day')) continue;
      result.push({
        ...item,
        startDate: date,
      });
    }
    startDate = startDate.add(1, 'week').startOf('week');
  }
  return uniqWith(result, (a, b) => {
    return dayjs(a.startDate).isSame(dayjs(b.startDate), 'day');
  });
}

export function generatePreviewTimes(timeItems: ILessonTimeItem[]): ILessonPreviewTime[] {
  let result: ILessonTimeItem[] = [];
  timeItems.forEach((item, index) => {
    switch (item.repeatOption) {
      case LessonRepeatOption.NO_REPEAT: {
        if (!item.startTime || !item.startDate || !item.endTime) {
          break;
        }
        result.push({ ...item, index });
        break;
      }
      case LessonRepeatOption.EVERY_DAY: {
        const times = generateTimesWithRepeatDays({
          ...item,
          index,
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
        });
        result = [...result, ...times];
        break;
      }
      case LessonRepeatOption.ODD_DAY: {
        const times = generateTimesWithRepeatDays({
          ...item,
          index,
          repeatDays: [2, 4, 6],
        });
        result = [...result, ...times];
        break;
      }
      case LessonRepeatOption.EVEN_DAY: {
        const times = generateTimesWithRepeatDays({
          ...item,
          index,
          repeatDays: [1, 3, 5],
        });
        result = [...result, ...times];
        break;
      }
      case LessonRepeatOption.OTHER_REPEAT: {
        const times = generateTimesWithRepeatDays({ ...item, index });
        result = [...result, ...times];
        break;
      }
      default:
        break;
    }
  });
  return convertILessonTimeItemToPreview(result);
}

export function generatePreviewTimes1(params: Record<string, unknown>) {
  const startDate = get(params, 'date') as string;
  const startTime = timeToString(get(params, 'startTime') as ILessonTimeObject);
  const endTime = timeToString(get(params, 'endTime') as ILessonTimeObject);

  const createdLessons = get(params, 'createdLessons', 0) as number;
  const totalLessons = get(params, 'totalLessons', 0) as number;
  const remainingLessons = totalLessons - createdLessons;
  if (!remainingLessons) {
    return [];
  }
  const isRepeat = get(params, 'isRepeat');
  if (!isRepeat) {
    return [
      {
        date: startDate,
        startTime,
        endTime,
      },
    ];
  }
  const dates = [];
  const sortedRepeatSchedule = (get(params, 'repeatSchedule', []) as number[]).sort(
    (a, b) => a - b,
  ); // ascending
  generateDays(startDate, remainingLessons, sortedRepeatSchedule, dates);
  const times = dates.map((date) => {
    return {
      date: date,
      startTime,
      endTime,
    };
  });
  return times;
}
export const formatLessonDate = (date: string, startTime: string, endTime: string) => {
  const day = dayjs(new Date(date)).format('YYYY-MM-DD');
  return `${startTime} - ${endTime}, ${day}`;
};

const getLessonStatus = (date: string, startTime: string, endTime: string) => {
  const startTimestamp = new Date(`${date}T${startTime}:00`);
  const endTimestamp = new Date(`${date}T${endTime}:00`);
  const currentTimestamp = new Date();
  if (currentTimestamp < startTimestamp) {
    return LessonStatus.UPCOMING;
  } else if (currentTimestamp > endTimestamp) {
    return LessonStatus.COMPLETED;
  }
  return LessonStatus.ONGOING;
};

export const checkActiveDateTime = (date: string, endTime: ITime) => {
  const diff = dayjs(`${date} ${timeToString(endTime)}`).diff(dayjs(), 'minutes');
  return diff > LIMIT_TIME_UPDATE_LESSON * 60; // 8 hours
};

/**
 *
 * @param startDate The start date of lesson
 * @param total Total lessons
 * @param days Repeat schedule of lesson, 0 -> 6 (Sunday -> Saturday). Ex: [1, 3, 5] => repeat on Monday, Wednesday, Friday
 * @param result List of days of the lesson
 */
export function generateDays(
  startDate: string,
  total: number,
  days: number[],
  result: string[],
) {
  let start = dayjs(startDate);
  if (start.week() === dayjs().week() && !days.includes(start.day())) {
    result.push(start.format('YYYY-MM-DD'));
  }
  for (let index = 0; index < days.length; index++) {
    const day = days[index];
    if (start.day() <= day) {
      if (result.length >= total) {
        break;
      }
      start = start.day(day);
      result.push(start.format('YYYY-MM-DD'));
    }
  }
  if (result.length < total) {
    generateDays(
      start.add(1, 'week').startOf('week').format('YYYY-MM-DD'),
      total,
      days,
      result,
    );
  }
}

export function convertToTimeObj(dateTime?: Date | string): ITime {
  const _dateTime = dayjs(dateTime);
  return {
    hours: _dateTime.hour(),
    minutes: _dateTime.minute(),
    seconds: _dateTime.second(),
  };
}
