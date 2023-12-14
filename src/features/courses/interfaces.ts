import { ICommonListQuery } from '@/common/interfaces';

export type ICourseListItem = {
  id: string;
  name: string;
  code: string;
  times: number;
  courseFormNames: string[];
  tuition: number;
};

export interface ICourse {
  id: string;
  _id?: string;
  name: string;
  code: string;
  times?: number;
  tuition: number;
  description?: string;
  subjects?: ICourseSubject[];
  courseFormIds: string[];
  courseFormNames: string[];
  totalClasses?: number;
  activeClasses?: number;
  endedClasses?: number;
  totalStudents?: number;
}

export interface ICourseOption {
  _id?: string;
  name?: string;
}

export type ICourseListQueryParams = ICommonListQuery;
export interface ICreateCourseForm {
  name: string;
  description?: string;
  times: number;
  subjectIds?: string[];
  courseFormIds: string[];
  tuition: number;
}

export type IUpdateCourseForm = Partial<ICreateCourseForm>;

export interface ICourseSubject {
  _id?: string;
  id: string;
  name: string;
  code: string;
  documents: string[];
  subjectCode: string;
}
export interface ICouseSubjectDropdown {
  id: string;
  name: string;
}
