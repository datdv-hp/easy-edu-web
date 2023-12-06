import { Gender, Role, UserStatus } from '@/common/constants';
import { ICommonListQuery, IUserProfile } from '@/common/interfaces';
import { RowOptions } from 'tui-grid';
import { ICourse } from '../courses/interfaces';
import { TimekeepingSettingOptions } from './constants';

export interface ITeacher extends IUserProfile {
  id: string;
  teacherDetail?: ITeacherDetail;
  subjectNames?: string[];
}

export type ITeacherListItem = {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  status: UserStatus;
  userRole: Role;
  subjectNames: string[];
};

export interface ICourseExam {
  name: string;
  code: string;
}

export interface ITeacherSubject {
  _id: string;
  name: string;
}
export interface ITeacherDetail {
  subjectIds?: string[];
  subjects?: ITeacherSubject[];
  degree?: string;
  nationality?: string;
  identity?: string;
  note?: string;
  signedContractDate?: string;
}
export interface IDeleteTeacherResponse {
  _id: string;
}

export interface ITeacherFormData {
  name: string;
  birthDate: Date | string;
  phone: string;
  signingDate?: Date | string;
  email: string;
  gender?: Gender;
  teachingSubjects?: string[];
  institution?: string;
}

export type ITeacherProfileData = ITeacher;

export interface ITeacherProfileDetail {
  subjectIds?: string[];
  degree?: string;
  signedContractDate?: string;
  nationality?: string;
  identity?: string;
  note?: string;
}

export interface ICreateTeacherForm {
  avatar?: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  gender: Gender;
  teacherDetail?: ITeacherProfileDetail;
  roleId: string;
}

export interface IUpdateTeacherForm {
  avatar?: string | null;
  name?: string;
  dob?: string;
  phone?: string;
  email?: string;
  gender?: Gender;
  teacherDetail?: ITeacherProfileDetail;
  roleId?: string;
}

export interface ITeacherClass {
  id: string;
  name: string;
  code: string;
  course: ICourse;
  startDate: string;
  endDate: string;
}

/*----Timekeeping----*/
export interface ITimeKeepingListQuery extends ICommonListQuery {
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface ITeacherTimeKeepingListQuery extends ICommonListQuery {
  startDate?: string;
  endDate?: string;
  userIds?: string | string[]; // teachers mongoIds, seperated by ','
}

export interface ITeacherTimekeeping {
  _id: string;
  code: string;
  name: string;
  totalLessons: number;
  countCheckIn: number;
}

export interface ITimeKeeping {
  _id: string;
  name: string;
  lessons: {
    _id: string;
    name: string;
    classroom: string;
    code: string;
    date: string;
    isAttended: boolean;
    timekeepingId: string;
  }[];
}

export interface ICreateTimekeeping {
  userId: string;
  lessonId: string;
  isAttended: boolean;
}

export interface IUpdateTimekeeping {
  isAttended: boolean;
}

// Used for table display
export interface ITimeKeepingRow extends RowOptions {
  rawData: Partial<ITimeKeeping>;
  id: string;
  lessonName: string;
  lessonId: string;
  lessonCode: string;
  classroomName?: string;
  classroomId: string;
  date: string;
  _children?: Partial<ITimeKeepingRow>[];
}

// setting
export interface ISettingTimekeeping {
  id: string;
  name: string;
  value: ISettingTimekeepingValue;
}

export interface ISettingTimekeepingValue {
  timekeeping: string | number;
}

export interface ISettingTimeKeepingForm {
  id: string;
  dateClosed: TimekeepingSettingOptions;
  date?: number | null;
}

export interface ICreateSettingTimeKeeping {
  dateClosed: TimekeepingSettingOptions;
  date?: number;
}

export type IUpdateSettingTimeKeeping = Partial<ICreateSettingTimeKeeping>;
