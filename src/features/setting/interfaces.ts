import { RoleType } from '@/common/constants';
import { ICommonListQuery, IUserRole } from '@/common/interfaces';
import {
  CriteriaType,
  StatusEvaluationCriteriaType,
  TypeScore,
  TimeKeepingType,
} from './constant';

export interface IRoleInfo {
  name: string;
  id: string;
  features: IUserRole[];
  description?: string;
  type: RoleType;
  isDefault?: boolean;
}
export interface ICourseType {
  id: string;
  name: string;
}

export interface IEvaluationType {
  id: string;
  name: string;
}

export interface IEvaluationItemQuery extends ICommonListQuery {
  status?: StatusEvaluationCriteriaType[];
  courseIds?: string[];
}

export interface IEvaluationItem {
  id: string;
  name: string;
  status: StatusEvaluationCriteriaType;
  description?: string;
  type: CriteriaType;
  listDetail?: IEvaluationItemContent[];
  formulaDetails?: IEvaluationItemRecipe[];
  courseNames?: string[];
  isForAllCourse?: boolean;
  evaluationCriteriaSettingDetailFormulaType?: {
    _id?: string;
    courseId?: string;
    type?: TypeScore;
    formula?: string;
    criteria?: {
      name?: string;
      maxScores?: string;
    }[];
  };
  evaluationCriteriaSettingDetailListType?: {
    isForAllCourse?: boolean;
    contents?: string[];
    courseId?: string;
    _id?: string;
  }[];
}

export interface IEvaluationItemFormResponse {
  id: string;
  name: string;
  status: StatusEvaluationCriteriaType;
  description?: string;
  type: CriteriaType;
  listDetail?: IEvaluationItemContent[];
  formulaDetails?: {
    courseId?: string;
    typeScore?: TypeScore;
    recipe?: string;
    scores?: {
      name: string;
      maxScores: string;
    }[];
  }[];
  courseNames?: string[];
  isForAllCourse?: boolean;
}

export interface IEvaluationItemRecipe {
  courseId?: string;
  typeScore?: TypeScore;
  recipe?: string;
  scores?: IEvaluationRecipeScore[];
}

export interface IEvaluationItemContent {
  isForAllCourse?: boolean;
  contents: string[];
  listContents: IEvaluationItemContentDetail[];
}

export interface IEvaluationItemContentDetail {
  courseId?: string;
  contents: string[];
}

export interface IEvaluationRecipeScore {
  name?: string;
  from?: number | string;
  to?: number;
}

export interface ITimeKeepingSetting {
  day?: number;
  isEndOfMonth?: boolean;
  type?: TimeKeepingType;
}

export interface ITimeKeepingSettingResponse {
  value: ITimeKeepingSetting;
  _id: string;
}

export interface IDefaultFeature {
  type: RoleType;
  keys: Record<string, string[]>;
}
