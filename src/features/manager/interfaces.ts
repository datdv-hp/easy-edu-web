import { Gender } from '@/common/constants';
import { ICommonListQuery, IRoleDetail, IUserProfile } from '@/common/interfaces';
import { ITeacherDetail } from '../teacher/interfaces';

export interface IManager extends IUserProfile {
  managerDetail?: IManagerDetail;
  teacherDetail?: ITeacherDetail;
  isTeacher?: boolean;
}

export interface IManagerProfileDetail extends IManager {
  role?: IRoleDetail;
}

export interface IManagerDetail {
  isTeacher?: boolean;
  signedContractDate?: string;
}

export type IManagerListQueryParams = ICommonListQuery;

export interface ICreateManagerForm {
  avatar?: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  gender: Gender;
  isTeacher: boolean;
  roleId: string;
  managerDetail?: IManagerDetail;
  teacherDetail?: ITeacherDetail;
}

export interface IUpdateManagerForm {
  avatar?: string | null;
  name?: string;
  dob?: string;
  phone?: string;
  email?: string;
  gender?: Gender;
  isTeacher: boolean;
  roleId?: string;
  managerDetail?: IManagerDetail;
  teacherDetail?: ITeacherDetail;
}
