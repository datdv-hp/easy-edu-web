import { IClassroom } from '../classroom/interfaces';
import { LessonStudentStatus } from '../lesson/constants';
import { LeaveRequestStatus } from './constants';
export interface ICreateLeaveRequest {
  lessonId: string;
  reason: string;
}

export interface IHandleLeaveRequestBody {
  status: LeaveRequestStatus;
}

export interface IScheduleListQuery {
  classroomIds?: string[];
  teacherIds?: string[];
  subjectIds?: string[];
  startDate?: string;
  endDate?: string;
}

export interface ILessonTimeKeeping {
  id: string;
  userId: string;
  isAttended: boolean;
  lessonId: string;
}

export interface ILessonLeave {
  id: string;
  userId: string;
  lessonId: string;
  reason: string;
  status: LeaveRequestStatus;
}

export interface IStudentInLesson {
  id: string;
  name: string;
  code?: string;
  avatar?: string;
  leave?: ILessonLeave;
  timekeeping?: ILessonTimeKeeping;
  status?: LessonStudentStatus;
}

export interface IOption {
  _id: string;
  name: string;
}

export interface ITeacherInLesson extends IOption {
  timekeeping?: ILessonTimeKeeping;
}
export interface IScheduleDetail {
  id: string;
  classroom: IClassroom;
  subject: IOption;
  teacher: ITeacherInLesson;
  course: IOption;
  name: string;
  code: string;
  room?: string;
  roomName?: string;
  meetUrl?: string;
  isUseGoogleMeet?: boolean;
  date: string;
  startTime: string;
  endTime: string;
  dateTime?: string;
  documents: string[];
  students?: IStudentInLesson[];
}

export interface ICreateTeacherTimekeeping {
  userId: string;
  lessonId: string;
  isAttended: boolean;
}
