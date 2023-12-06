import dayjs from 'dayjs';
import type {
  ICreateStudentForm,
  IStudent,
  IUpdateStudentForm,
  IStudentDetail,
  ICourseDetail,
  IStudentCourse,
} from './interfaces';
import { get } from 'lodash';
import { Gender, ProfileType, Role, StudentDegree, UserStatus } from '@/common/constants';
import { ICourse } from '../courses/interfaces';
import { convertToRoleDetail } from '../manager/helpers';

export const transferStudent = (data: any[]): IStudent[] => {
  const transferData = data.map((value) => {
    return convertToStudent(value);
  });

  return transferData;
};

export function convertToStudent(data: Record<string, unknown>): IStudent {
  const _role = get(data, 'role', {}) as Record<string, unknown>;
  const courses = (get(data, 'courses', []) as any[])?.map((course) => course.name);
  const student: IStudent = {
    name: get(data, 'name', '') as string,
    email: get(data, 'email', '') as string,
    phone: get(data, 'phone', '') as string,
    avatar: get(data, 'avatar', '') as string,
    dob: get(data, 'dob', '') as string,
    userRole: Role.USER,
    role: convertToRoleDetail(_role),
    gender: get(data, 'gender') as Gender,
    courses,
    id: get(data, '_id', '') as string,
    code: get(data, 'code', '') as string,
    studentDetail: get(data, 'studentDetail') as IStudentDetail,
    type: get(data, 'type', '') as ProfileType,
    status: get(data, 'status') as UserStatus,
  };
  return student;
}

export function getStudentUpdateFormData(
  data: Record<string, unknown>,
): IUpdateStudentForm {
  const dob = data.dob as string;
  return {
    name: data.name as string,
    phone: (get(data, 'phone') as string)?.replaceAll(' ', ''),
    avatar: (data.avatar as string) || null,
    gender: data.gender as Gender,
    dob: dob ? dayjs(dob).format('YYYY-MM-DD') : undefined,
    roleId: get(data, 'roleId') as string,
    studentDetail: {
      degree: get(data, 'studentDetail.degree') as StudentDegree,
      courses: get(data, 'studentDetail.courses', []) as ICourseDetail[],
    },
  };
}

export function getStudentCreateFormData(
  data: Record<string, unknown>,
): ICreateStudentForm {
  return {
    name: data.name as string,
    phone: (get(data, 'phone', '') as string).replaceAll(' ', ''),
    email: data.email as string,
    gender: data.gender as Gender,
    avatar: data.avatar as string,
    dob: dayjs(data.dob as string).format('YYYY-MM-DD'),
    roleId: get(data, 'roleId') as string,
    studentDetail: {
      degree: get(data, 'studentDetail.degree') as StudentDegree,
      courses: get(data, 'studentDetail.courses', []) as ICourseDetail[],
    },
  };
}

export const convertToStudentCourse = (data: Record<string, unknown>): IStudentCourse => {
  const course: IStudentCourse = {
    id: get(data, '_id', '') as string,
    name: get(data, 'name', '') as string,
    code: get(data, 'code', '') as string,
    course: get(data, 'course') as ICourse,
    startDate: get(data, 'startDate', '') as string,
    endDate: get(data, 'endDate', '') as string,
  };

  return course;
};

export const mapStudentCourseList = (data: any[]): IStudentCourse[] => {
  const mapData = data.map((item) => {
    return convertToStudentCourse(item);
  });

  return mapData;
};
