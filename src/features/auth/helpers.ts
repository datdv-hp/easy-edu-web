import { Gender, ProfileType, Role } from '@/common/constants';
import dayjs from '@/plugins/dayjs';
import { get } from 'lodash';
import { convertToManager } from '../manager/helpers';
import { convertToStudent } from '../student/helpers';
import { convertToTeacher } from '../teacher/helpers';
import { type ITeacherDetail } from '../teacher/interfaces';
import type {
  IMaster,
  IUpdateProfileForm,
  IUserActiveAccountBody,
  IUserProfile,
} from './interfaces';

export const convertToMaster = (data: Record<string, unknown>): IMaster => {
  return {
    id: get(data, 'id', '') as string,
    name: get(data, 'name', '') as string,
    type: ProfileType.NONE,
    email: get(data, 'email', '') as string,
    phone: get(data, 'phone', '') as string,
    dob: get(data, 'dob', '') as string,
    gender: get(data, 'gender', '') as Gender,
    avatar: get(data, 'avatar', '') as string,
    userRole: Role.MASTER,
    features: get(data, 'features', '') as string,
  };
};

export const convertToUser = (data: any): IUserProfile => {
  if (data.userRole === Role.MASTER) {
    return convertToMaster(data);
  }
  switch (data?.type) {
    case ProfileType.STUDENT:
      return convertToStudent(data);
    case ProfileType.TEACHER:
      return convertToTeacher(data);
    case ProfileType.NONE:
      return convertToManager(data);
    default:
      return {
        id: data.id as string,
        name: data.name as string,
        email: data.email as string,
        dob: data.dob as string,
        userRole: data.userRole as Role,
      } as IUserProfile;
  }
};

export const getUpdateTeacherProfileFormData = (params: Record<string, unknown>) => {
  const teacherDetail = get(params, 'teacherDetail') as ITeacherDetail;
  return {
    avatar: params?.avatar,
    name: params?.name as string,
    dob: params?.dob ? dayjs(params.dob as string).format('YYYY-MM-DD') : undefined,
    phone: params?.phone ? (params?.phone as string).replaceAll(' ', '') : undefined,
    gender: params?.gender as Gender,
    teacherDetail: teacherDetail,
  };
};

export const getUpdateStudentProfileFormData = (params: Record<string, unknown>) => {
  return {
    avatar: params?.avatar as string,
    name: params?.name as string,
    phone: params?.phone ? (params.phone as string).replaceAll(' ', '') : undefined,
    dob: params?.dob ? dayjs(params.dob as string).format('YYYY-MM-DD') : undefined,
    gender: params?.gender as Gender,
  };
};

export const getUpdateManagerProfileFormData = (params: Record<string, unknown>) => {
  return {
    avatar: params?.avatar as string,
    name: params?.name as string,
    phone: params?.phone ? (params.phone as string).replaceAll(' ', '') : undefined,
    dob: params?.dob ? dayjs(params.dob as string).format('YYYY-MM-DD') : undefined,
    gender: params?.gender as Gender,
  };
};

export const getProfileUpdateFormData = (data: any): IUpdateProfileForm => {
  switch (data.type) {
    case ProfileType.STUDENT:
      return getUpdateStudentProfileFormData(data);
    case ProfileType.TEACHER:
      return getUpdateTeacherProfileFormData(data) as IUpdateProfileForm;
    default:
      return getUpdateManagerProfileFormData(data);
  }
};

export const convertToActiveAccountBody = (
  params: Record<string, string | boolean>,
): IUserActiveAccountBody => {
  return {
    code: get(params, 'code') as string,
    email: get(params, 'email') as string,
  };
};
