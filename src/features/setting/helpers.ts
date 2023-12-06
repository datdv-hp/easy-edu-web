import { RoleType } from '@/common/constants';
import { IUserRole } from '@/common/interfaces';
import { get } from 'lodash';
import {
  IEvaluationItemContent,
  IEvaluationItemFormResponse,
  IEvaluationType,
  IRoleInfo,
} from './interfaces';
import { CriteriaType, StatusEvaluationCriteriaType, TypeScore } from './constant';

export const convertToRole = (params: Record<string, unknown>) => {
  const features = get(params, 'features') as string | IUserRole;
  return {
    id: get(params, '_id') as string,
    features:
      typeof features === 'string' ? JSON.parse(features) : (features as IUserRole),
    name: get(params, 'name') as string,
    type: get(params, 'type') as RoleType,
    isDefault: get(params, 'isDefault') as boolean,
    description: get(params, 'description', '') as string,
  } as IRoleInfo;
};

export const convertToRoleFormData = (params: Record<string, unknown>) => {
  return {
    name: get(params, 'name') as string,
    description: get(params, 'description'),
    features: get(params, 'features') as IUserRole,
    type: get(params, 'type') as RoleType,
  };
};

export const convertToEvaluationItemFormData = (
  params: Record<string, unknown>,
): IEvaluationItemFormResponse => {
  return {
    id: get(params, '_id') as string,
    name: get(params, 'name') as string,
    status: get(params, 'status') as StatusEvaluationCriteriaType,
    description: get(params, 'description') as string,
    type: get(params, 'description') as CriteriaType,
    courseNames: get(params, 'courseNames') as string[],
    listDetail: get(params, 'listDetail') as IEvaluationItemContent[],
    formulaDetails: get(params, 'listDetail') as {
      courseId?: string;
      typeScore?: TypeScore;
      recipe?: string;
      scores?: {
        name: string;
        maxScores: string;
      }[];
    }[],
  };
};

export const convertToEvaluationTypeFormData = (
  data: Record<string, unknown>[],
): IEvaluationType[] => {
  return data.map((param) => ({
    id: get(param, '_id') as string,
    name: get(param, 'name') as string,
  }));
};

export const convertToCourseTypeFormData = (
  data: Record<string, unknown>[],
): IEvaluationType[] => {
  return data.map((param) => ({
    id: get(param, '_id') as string,
    name: get(param, 'name') as string,
  }));
};
