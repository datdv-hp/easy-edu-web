import { ICommonListQuery } from '@/common/interfaces';
import { RowOptions } from 'tui-grid';
import { ICourse, ICourseOption } from '../courses/interfaces';
import { IStudent } from '../student/interfaces';
import { ClassroomStatus } from './contants';

export interface IClassroomListQuery extends ICommonListQuery {
  courseIds?: string[] | string;
  statuses?: string[] | string;
}

export interface IClassroom {
  id: string;
  code: string;
  name: string;
  course: ICourse | ICourseOption;
  startDate: string;
  endDate: string;
  dateRange?: string; // format: startDate - endDate
  participants: IStudent[];
  totalStudents?: number;
  color?: string;
  status: ClassroomStatus;
  totalLesson?: number;
  countFinishedLesson?: number;
  countInProgressLesson?: number;
  teachers?: string[];
  syllabusIds?: string[];
}
export interface ICreateClassRoomBody {
  name: string;
  courseId: string; // mongo_id
  startDate: string;
  endDate: string;
  participantIds: string[]; // mongo_id[]
  color: string;
  teacherIds?: string[]; // mongo_id[]
  syllabusIds?: string[];
}

export type IUpdateClassroomBody = Partial<ICreateClassRoomBody>;

export interface IEvaluationStudentTimekeeping {
  total?: number;
  attended?: number;
  finishedLesson?: number;
}
export interface TClassroomListSubject {
  _id: string;
  name: string;
  code: string;
  subjectCode: string;
}

export interface TClassroomListStudent {
  _id: string;
  name: string;
  code: string;
  subjects: string[];
}

export interface TClassroomStudentAndSubjectRow extends RowOptions {
  index: string | number;
  studentCode: string;
  studentName: string;
}

export interface IClassroomTimekeepingStudent {
  code: string;
  name: string;
  timekeeping: IEvaluationStudentTimekeeping;
  id: string;
}
