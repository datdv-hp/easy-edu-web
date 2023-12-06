import { get } from 'lodash';
import {
  ICourse,
  ICourseListItem,
  ICourseSubject,
  ICreateCourseForm,
  IUpdateCourseForm,
} from './interfaces';

export const convertToCourseList = (
  params: Record<string, unknown>[],
): ICourseListItem[] => {
  return params?.map((item) => {
    const courseForms = (item.courseForms || []) as Record<string, unknown>[];
    return {
      id: item._id as string,
      name: item.name as string,
      code: item.code as string,
      times: item.times as number,
      courseFormNames: courseForms?.map((courseForm) => courseForm.name as string) || [],
    };
  });
};

export const transformCourse = (data: any[]): ICourse[] => {
  const transformData = data?.map((item) => {
    return convertToCourse(item);
  });
  return transformData;
};

export const convertToCourse = (data: Record<string, unknown>): ICourse => {
  return {
    id: get(data, '_id', '') as string,
    name: get(data, 'name', '') as string,
    code: get(data, 'code', '') as string,
    description: get(data, 'description', '') as string,
    subjects: get(data, 'subjects', []) as ICourseSubject[],
    courseFormIds: get(data, 'courseFormIds', []) as string[],
    courseFormNames: get(data, 'courseFormNames', []) as string[],
    times: get(data, 'times', 0) as number,
  };
};

export const convertToCourseDetail = (params: Record<string, unknown>) => {
  return {
    _id: params._id as string,
    name: params.name as string,
    description: params.description as string,
    times: params.times as number,
    courseFormIds: params.courseFormIds as string[],
    subjectIds: params.subjectIds as string[],
  };
};

export const convertToCourseMoreDetail = (data: Record<string, unknown>): ICourse => {
  return {
    ...convertToCourse(data),
    totalClasses: get(data, 'totalClasses', 0) as number,
    activeClasses: get(data, 'activeClasses', 0) as number,
    endedClasses: get(data, 'endedClasses', 0) as number,
    totalStudents: get(data, 'totalStudents', 0) as number,
  };
};

export const getCourseCreateFormData = (
  params: Record<string, unknown>,
): ICreateCourseForm => {
  return {
    name: params.name as string,
    description: params.description as string,
    times: params.times as number,
    subjectIds: params.subjectIds as string[],
    courseFormIds: params.courseType as string[],
  };
};

export const getCourseUpdateFormData = (
  params: Record<string, unknown>,
): IUpdateCourseForm => {
  return {
    name: params.name as string,
    description: params.description as string,
    times: params.times as number,
    subjectIds: params.subjectIds as string[],
    courseFormIds: params.courseType as string[],
  };
};

export const convertSubjectOptions = (subjects: Record<string, string>[]) => {
  return subjects.map((subject) => ({
    value: subject._id,
    title: subject.name + (subject?.subjectCode ? ` (${subject.subjectCode})` : ''),
  }));
};

export const convertCourseTypeOptions = (courseTypes: Record<string, string>[]) => {
  return courseTypes.map((courseType) => ({
    value: courseType._id,
    title: courseType.name,
  }));
};

export const getSelectedSubjects = (subjects: ICourseSubject[]) => {
  return subjects.map((subject) => subject._id);
};
