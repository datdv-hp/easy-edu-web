import dayjs from 'dayjs';
import { IManager } from './interfaces';
import { Gender, ProfileType, Role, UserStatus } from '@/common/constants';
import { get } from 'lodash';
import { IManagerDetail } from './interfaces';
import { ICreateManagerForm } from './interfaces';
import { IUpdateManagerForm } from './interfaces';
import { ITeacherDetail } from '../teacher/interfaces';
import { IRoleDetail } from '@/common/interfaces';

export const transformManager = (data: any[]): IManager[] => {
  const transformData = data.map((item) => {
    return convertToManager(item);
  });

  return transformData;
};

export const convertToManager = (data: Record<string, unknown>): IManager => {
  const managerDetail = get(data, 'managerDetail', {}) as IManagerDetail;
  const profileType = get(data, 'type', '') as ProfileType;
  const role = get(data, 'role', {}) as Record<string, unknown>;
  return {
    name: get(data, 'name', '') as string,
    email: get(data, 'email', '') as string,
    phone: get(data, 'phone', '') as string,
    avatar: get(data, 'avatar', '') as string,
    dob: get(data, 'dob', '') as string,
    gender: get(data, 'gender') as Gender,
    id: get(data, '_id', '') as string,
    code: get(data, 'code', '') as string,
    type: profileType,
    userRole: Role.MANAGER,
    role: convertToRoleDetail(role),
    isTeacher: profileType === ProfileType.TEACHER,
    managerDetail,
    teacherDetail: get(data, 'teacherDetail') as ITeacherDetail,
    isEmailVerified: get(data, 'isEmailVerified') as boolean,
    status: get(data, 'status') as UserStatus,
  };
};

export function convertToManagerDetail(params: Record<string, unknown>) {
  const profileType = params.type as ProfileType;

  return {
    id: params._id as string,
    name: params.name as string,
    code: params.code as string,
    email: params.email as string,
    phone: params.phone as string,
    avatar: params.avatar as string,
    dob: params.dob as string,
    gender: params.gender as Gender,
    userRole: params.userRole as Role,
    roleId: params.roleId as string,
    isTeacher: profileType === ProfileType.TEACHER,
    managerDetail: params.managerDetail as IManagerDetail,
    teacherDetail: params.teacherDetail as ITeacherDetail,
    status: params.status as UserStatus,
  };
}

export const convertToRoleDetail = (params: Record<string, unknown>): IRoleDetail => {
  const isString = typeof params === 'string';
  if (isString) {
    return {
      id: params as string,
    };
  }
  return {
    id: get(params, '_id') as string,
    name: get(params, 'name') as string,
  };
};

export const getManagerCreateFormData = (
  params: Record<string, unknown>,
): ICreateManagerForm => {
  const isTeacher = get(params, 'isTeacher', false) as boolean;
  return {
    name: params.name as string,
    phone: (params.phone as string).replaceAll(' ', ''),
    gender: params.gender as Gender,
    email: params.email as string,
    avatar: params.avatar ? (params.avatar as string) : undefined,
    isTeacher,
    roleId: params?.roleId as string,
    dob: dayjs(params.dob as string).format('YYYY-MM-DD'),
    managerDetail: {
      signedContractDate: get(params, 'managerDetail.signedContractDate')
        ? dayjs(get(params, 'managerDetail.signedContractDate') as string).format(
            'YYYY-MM-DD',
          )
        : undefined,
    },
    teacherDetail: isTeacher
      ? {
          subjectIds: get(params, 'teacherDetail.subjectIds') as string[],
          degree: get(params, 'teacherDetail.degree') as string,
          identity: get(params, 'teacherDetail.identity') as string,
          nationality: get(params, 'teacherDetail.nationality') as string,
          note: get(params, 'teacherDetail.note') as string,
          signedContractDate: get(params, 'managerDetail.signedContractDate')
            ? dayjs(get(params, 'teacherDetail.signedContractDate') as string).format(
                'YYYY-MM-DD',
              )
            : undefined,
        }
      : undefined,
  };
};

export const getManagerUpdateFormData = (
  params: Record<string, unknown>,
): IUpdateManagerForm => {
  const isTeacher = get(params, 'isTeacher', false) as boolean;
  return {
    name: params.name as string,
    phone: (params.phone as string).replaceAll(' ', ''),
    gender: params.gender as Gender,
    avatar: params.avatar ? (params.avatar as string) : null,
    dob: dayjs(params.dob as string).format('YYYY-MM-DD'),
    isTeacher,
    roleId: params?.roleId as string,
    managerDetail: {
      signedContractDate: get(params, 'managerDetail.signedContractDate')
        ? dayjs(get(params, 'managerDetail.signedContractDate', '') as string).format(
            'YYYY-MM-DD',
          )
        : undefined,
    },
    teacherDetail: isTeacher
      ? {
          subjectIds: get(params, 'teacherDetail.subjectIds') as string[],
          degree: get(params, 'teacherDetail.degree') as string,
          identity: get(params, 'teacherDetail.identity') as string,
          nationality: get(params, 'teacherDetail.nationality') as string,
          note: get(params, 'teacherDetail.note') as string,
          signedContractDate: get(params, 'managerDetail.signedContractDate')
            ? dayjs(get(params, 'teacherDetail.signedContractDate') as string).format(
                'YYYY-MM-DD',
              )
            : undefined,
        }
      : undefined,
  };
};
