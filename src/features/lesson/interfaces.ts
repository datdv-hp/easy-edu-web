import { ICommonListQuery, ITime } from '@/common/interfaces';
import { Dayjs } from 'dayjs';
import { IClassroom } from '../classroom/interfaces';
import { ICourse } from '../courses/interfaces';
import { LessonRepeatOption } from '../schedule-tracking/constants';
import { IStudentInLesson } from '../schedule-tracking/interfaces';
import { IDocument, ISubject } from '../subject/interfaces';
import { ISyllabus, ISyllabusLectureListItem } from '../syllabus/interfaces';
import { ITeacher } from '../teacher/interfaces';
import { LessonStatus, LessonStudentStatus } from './constants';

export interface ILessonListQuery extends ICommonListQuery {
  classroomIds?: string[] | string;
  courseIds?: string[] | string;
  statuses?: LessonStatus[] | string;
  subjectIds?: string[] | string;
}
export interface ILesson {
  id: string;
  name: string;
  courses: string;
  classroom: string | IClassroom;
  classroomName: string;
  subject: string;
  teacher: string;
  documents: IDocument[];
}

export interface ILessonTime {
  date: string;
  startTime: string;
  endTime: string;
}

export type ICreateLessonForm = {
  name: string;
  classroomId: string;
  room?: string;
  isUseGoogleMeet: boolean;
  subjectId: string;
  teacherId: string;
  syllabusId?: string;
  lectureIds?: string[];
  times: ILessonTime[];
  documents: string[];
  recordings: string[];
  studentIds: string[];
  googleConfig?: {
    code: string;
    redirectUri: string;
  };
};

export type IUpdateLessonForm = {
  name?: string;
  classroomId?: string;
  room?: string;
  subjectId?: string;
  isUseGoogleMeet?: boolean;
  syllabusId?: string;
  lectureIds?: string[];
  teacherId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  documents?: string[] | null;
  recordings?: string[] | null;
  studentIds?: string[];
};

export interface IListLessonItem {
  id: string;
  name: string;
  code: string;
  classroom: string;
  course: string;
  subject: string;
  teacher: string;
  status: LessonStatus;
  dateTime: string;
  isUseGoogleMeet: boolean;
}
export interface ILessonDetail {
  id: string;
  name: string;
  code: string;
  classroom: IClassroom;
  room?: string;
  isUseGoogleMeet: boolean;
  subject: ISubject;
  teacher: ITeacher;
  course: ICourse;
  syllabusId?: string;
  lectureIds?: string[];
  date: string;
  startTime: ITime;
  endTime: ITime;
  documents: string[];
  recordings?: string[];
  students: ILessonStudent[];
}

export interface ILessonStudent {
  id: string;
  name: string;
  code?: string;
  status?: LessonStudentStatus;
}

export interface ILessonInfo {
  id: string;
  code: string;
  courseName: string;
  name: string;
  classroomName: string;
  subjectName: string;
  teacherName: string;
  isUseGoogleMeet?: boolean;
  room?: string;
  meetUrl?: string;
  date: string;
  timeRange: string; // startTime - endTime
  totalStudents: number;
  totalParticipants: number | string;
  status: LessonStatus;
  students?: IStudentInLesson[];
  documents?: string[];
  recordings?: string[];
  lectures?: ISyllabusLectureListItem[];
  syllabus?: ISyllabus;
}

export interface ILessonTimeObject {
  hours: number;
  minutes: number;
}

export interface ILessonPreviewTime {
  date: string;
  startTime: string;
  endTime: string;
  error?: string;
  index?: number;
  feId?: number;
}

export interface ILessonPreviewItem {
  name: string;
  classroomId: string;
  isUseGoogleMeet: boolean;
  room?: string;
  subjectId: string;
  teacherId: string;
  syllabusId?: string;
  lectureIds?: string[];
  times: ILessonPreviewTime[];
  documents: string[];
  recordings?: string[];
  studentIds: string[];
}

export interface ILessonTimeItem {
  startDate: Date | Dayjs;
  startTime?: ITime;
  endTime?: ITime;
  repeatOption: LessonRepeatOption;
  endDate?: Date | Dayjs;
  repeatDays?: number[];
  feId?: string | number;
  index?: number;
}
