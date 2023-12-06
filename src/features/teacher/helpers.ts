import dayjs from 'dayjs';
import {
  ICreateTeacherForm,
  ISettingTimeKeepingForm,
  ISettingTimekeeping,
  ISettingTimekeepingValue,
  ITeacher,
  ITeacherClass,
  ITeacherDetail,
  ITeacherListItem,
  ITeacherSubject,
  IUpdateTeacherForm,
} from './interfaces';

import { Gender, ProfileType, Role, SettingType, UserStatus } from '@/common/constants';
import { get } from 'lodash';
import { ICourse } from '../courses/interfaces';
import { convertToRoleDetail } from '../manager/helpers';
import { IManagerDetail } from '../manager/interfaces';
import {
  TIMEKEEPING_END_OF_MONTH,
  TimeKeepingStatus,
  TimekeepingSettingOptions,
} from './constants';

export const transformTeacher = (data: any[]): ITeacher[] => {
  const transformData = data.map((item) => {
    return convertToTeacher(item);
  });

  return transformData;
};

export const convertToTeacherList = (
  params?: Record<string, unknown>[],
): ITeacherListItem[] => {
  return (params || [])?.map((item) => ({
    id: item?._id as string,
    name: item?.name as string,
    code: item?.code as string,
    email: item?.email as string,
    phone: item?.phone as string,
    status: item?.status as UserStatus,
    userRole: item?.userRole as Role,
    subjectNames: item?.subjectNames as string[],
  }));
};

export const convertToTeacherDetail = (params: Record<string, unknown>) => {
  const subjects = get(params, 'subjects', []) as ITeacherSubject[];
  return {
    subjectIds: subjects.map((subject) => subject._id as string),
    subjects,
    degree: get(params, 'degree') as string,
    nationality: get(params, 'nationality') as string,
    identity: get(params, 'identity') as string,
    note: get(params, 'note') as string,
    signedContractDate: get(params, 'signedContractDate') as string,
  } as ITeacherDetail;
};

export const convertToTeacher = (data: Record<string, unknown>): ITeacher => {
  const _teacherDetail = get(data, 'teacherDetail') as Record<string, unknown>;
  const _role = get(data, 'role', {}) as Record<string, unknown>;

  const teacherDetail = convertToTeacherDetail(_teacherDetail);
  const userRole = get(data, 'userRole', '') as Role;
  if (userRole === Role.MANAGER) {
    const managerDetail = get(data, 'managerDetail') as IManagerDetail;
    teacherDetail.signedContractDate = managerDetail?.signedContractDate;
  }
  const teacher: ITeacher = {
    name: get(data, 'name', '') as string,
    email: get(data, 'email', '') as string,
    phone: get(data, 'phone', '') as string,
    avatar: get(data, 'avatar', '') as string,
    dob: get(data, 'dob', '') as string,
    gender: get(data, 'gender') as Gender,
    id: get(data, '_id', '') as string,
    code: get(data, 'code', '') as string,
    teacherDetail,
    type: get(data, 'type', '') as ProfileType,
    userRole,
    subjectNames: get(data, 'subjectName') as string[],
    status: get(data, 'status') as UserStatus,
    role: convertToRoleDetail(_role),
  };

  return teacher;
};

export const getTeacherCreateFormData = (
  params: Record<string, unknown>,
): ICreateTeacherForm => {
  return {
    name: params.name as string,
    phone: (params.phone as string).replaceAll(' ', ''),
    gender: params.gender as Gender,
    email: params.email as string,
    avatar: params.avatar ? (params.avatar as string) : undefined,
    dob: dayjs(params.dob as string).format('YYYY-MM-DD'),
    roleId: get(params, 'roleId') as string,
    teacherDetail: {
      subjectIds: get(params, 'teacherDetail.subjectIds') as string[],
      degree: get(params, 'teacherDetail.degree') as string,
      identity: get(params, 'teacherDetail.identity') as string,
      nationality: get(params, 'teacherDetail.nationality') as string,
      note: get(params, 'teacherDetail.note') as string,
      signedContractDate: get(params, 'teacherDetail.signedContractDate')
        ? dayjs(get(params, 'teacherDetail.signedContractDate') as string).format(
            'YYYY-MM-DD',
          )
        : undefined,
    },
  };
};

export const getTeacherUpdateFormData = (
  params: Record<string, unknown>,
): IUpdateTeacherForm => {
  return {
    name: params.name as string,
    phone: (params.phone as string).replaceAll(' ', ''),
    gender: params.gender as Gender,
    avatar: params.avatar ? (params.avatar as string) : null,
    dob: dayjs(params.dob as string).format('YYYY-MM-DD'),
    roleId: get(params, 'roleId') as string,
    teacherDetail: {
      subjectIds: get(params, 'teacherDetail.subjectIds') as string[],
      degree: get(params, 'teacherDetail.degree') as string,
      identity: get(params, 'teacherDetail.identity') as string,
      nationality: get(params, 'teacherDetail.nationality') as string,
      note: get(params, 'teacherDetail.note') as string,
      signedContractDate: get(params, 'teacherDetail.signedContractDate')
        ? dayjs(get(params, 'teacherDetail.signedContractDate') as string).format(
            'YYYY-MM-DD',
          )
        : undefined,
    },
  };
};
export const convertToTeacherClass = (data: Record<string, unknown>): ITeacherClass => {
  const teacher: ITeacherClass = {
    id: get(data, 'id', '') as string,
    name: get(data, 'name', '') as string,
    code: get(data, 'code', '') as string,
    course: get(data, 'course') as ICourse,
    startDate: get(data, 'startDate', '') as string,
    endDate: get(data, 'endDate', '') as string,
  };

  return teacher;
};
export const transfromClassListByTeacher = (data: any[]): ITeacherClass[] => {
  const transformData = data.map((item) => {
    return convertToTeacherClass(item);
  });

  return transformData;
};

// setting
export const converToSettingTimekeeping = (
  data: Record<string, unknown>,
): ISettingTimekeeping => {
  return {
    id: get(data, 'id', '') as string,
    name: get(data, 'name', '') as SettingType,
    value: get(data, 'value', '') as ISettingTimekeepingValue,
  };
};

export const coverResponseToSettingTimekeepingForm = (
  data: ISettingTimekeeping,
): ISettingTimeKeepingForm => {
  if (data.value.timekeeping === TIMEKEEPING_END_OF_MONTH) {
    return {
      id: data.id,
      dateClosed: TimekeepingSettingOptions.FINISH_DATE_OF_MONTH,
      date: undefined,
    };
  }
  return {
    id: data.id,
    dateClosed: TimekeepingSettingOptions.OTHER,
    date: data.value.timekeeping as number,
  };
};

export const getCreateSettingTimekeepingForm = (
  params: Record<string, unknown>,
): ISettingTimekeepingValue => {
  const dateClosed = get(params, 'dateClosed', '') as TimekeepingSettingOptions;
  const date = get(params, 'date', undefined) as number;
  if (dateClosed === TimekeepingSettingOptions.FINISH_DATE_OF_MONTH) {
    return {
      timekeeping: TIMEKEEPING_END_OF_MONTH,
    };
  }
  return {
    timekeeping: date,
  };
};

export const getUpdateSettingTimekeepingForm = (
  params: Record<string, unknown>,
): ISettingTimekeepingValue => {
  const dateClosed = get(params, 'dateClosed', '') as TimekeepingSettingOptions;
  const date = get(params, 'date', undefined) as number;
  if (dateClosed === TimekeepingSettingOptions.FINISH_DATE_OF_MONTH) {
    return {
      timekeeping: TIMEKEEPING_END_OF_MONTH,
    };
  }
  return {
    timekeeping: date,
  };
};

// Timekeeping helper
export class CheckMarkRenderer {
  el: Element;
  constructor(props) {
    const el = document.createElement('div');
    // el.style.height = '50px';
    el.style.width = '100%';
    el.style.fontSize = '20px';
    el.style.display = 'flex';
    el.style.justifyContent = 'center';
    el.style.alignItems = 'center';
    if (props.value !== null) {
      if (props.value === TimeKeepingStatus.PRESENCE) {
        el.classList.add('mdi');
        el.classList.add('mdi-check');
        el.style.color = 'green';
      }
      if (props.value === TimeKeepingStatus.ABSENCE) {
        el.classList.add('mdi');
        el.classList.add('mdi-close');
        el.style.color = 'red';
      }
    } else {
      // el.classList.add('tui-grid-cell-disabled');
    }

    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

//end timekeeping helper
