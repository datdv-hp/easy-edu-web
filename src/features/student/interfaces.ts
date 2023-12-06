import { Gender, StudentDegree } from '@/common/constants';
import { ICommonListQuery, IRoleDetail, IUserProfile } from '@/common/interfaces';
import { ICourseOption } from '../courses/interfaces';

export interface IStudentListQuery extends ICommonListQuery {
  courseIds?: string[];
}

export interface IStudent extends IUserProfile {
  courses?: ICourseOption[];
  studentDetail?: IStudentDetail;
}
export interface IStudentAvatar {
  original: string;
  showing: string;
}
export interface IStudentProfileData extends IStudent {
  role?: IRoleDetail;
}
export type ICourseDetail = {
  courseId: string;
  subjectIds: string;
};
export interface IStudentDetail {
  degree?: StudentDegree;
  courses: ICourseDetail[];
}

export interface ICreateStudentForm {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: Gender;
  avatar?: string;
  roleId: string;
  studentDetail: IStudentDetail;
}

export interface IUpdateStudentForm {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
  dob?: string;
  gender?: Gender;
  roleId?: string;
  studentDetail?: IStudentDetail;
}

export interface IStudentCourse {
  id: string;
  name: string;
  code: string;
  course: {
    id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
}
