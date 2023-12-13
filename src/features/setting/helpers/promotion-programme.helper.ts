import dayjs from '@/plugins/dayjs';
import { PromotionType, PromotionStatus } from '../constant';
import {
  IPromotionProgrammeDetail,
  IPromotionProgrammeInfo,
  IUserUsedPromotionProgramme,
  type IPromotionProgrammeListItem,
} from '../interfaces/promotion-programme.interfaces';
import { DATE_TIME_FORMAT } from '@/common/constants';

export const formatPromotionValue = (value: number, type: PromotionType) => {
  if (type === PromotionType.PERCENTAGE) {
    return Intl.NumberFormat('vi-VN', {
      style: 'percent',
      maximumFractionDigits: 2,
    }).format(value / 100);
  }
  return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export function convertToPromotionListItem(
  item: Record<string, unknown>,
): IPromotionProgrammeListItem {
  const times = item.times as number;
  const usedTimes = item.usedTimes as number;
  const applyForCourses = item.courseNames as string[];
  const type = item.type as PromotionType;
  return {
    id: item._id as string,
    name: item.name as string,
    value: formatPromotionValue(item.value as number, type),
    applyForCourses: applyForCourses.join(', '),
    type: type,
    usedCount: `${usedTimes}/${times}`,
    startDate: dayjs(item.startAt as Date).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    endDate: dayjs(item.endAt as Date).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    status: item.status as PromotionStatus,
  };
}

export function convertToPromotionList(params?: Record<string, unknown>[]) {
  return params?.map((item) => convertToPromotionListItem(item)) || [];
}

export function convertToPromotionDetail(
  params: Record<string, unknown>,
): IPromotionProgrammeDetail {
  return {
    id: params._id as string,
    description: params.description as string,
    name: params.name as string,
    type: params.type as PromotionType,
    value: params.value as number,
    applyForCourseIds: params.applyForCourseIds as string[],
    times: params.times as number,
    startDate: params.startAt as Date,
    endDate: params.endAt as Date,
  };
}

export function convertToPromotionFormData(params: Record<string, unknown>) {
  const info = params.info as Record<string, unknown>;
  return {
    name: params.name as string,
    description: params.description as string,
    info: info
      ? {
          type: info.type as PromotionType,
          value: info.value as number,
        }
      : undefined,
    applyForCourseIds: params.applyForCourseIds as string[],
    times: params.times as number,
    startAt: params.startDate as Date,
    endAt: params.endDate as Date,
  };
}

export function convertToPromotionProgrammeInfo(
  params: Record<string, unknown>,
): IPromotionProgrammeInfo {
  const type = params.type as PromotionType;
  return {
    id: params._id as string,
    name: params.name as string,
    description: params.description as string,
    type: type,
    value: formatPromotionValue(params.value as number, type),
    times: params.times as number,
    startDate: dayjs(params.startAt as Date).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    endDate: dayjs(params.endAt as Date).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    status: params.status as PromotionStatus,
  };
}

export function convertToUserUsedPromotion(
  params: Record<string, unknown>,
): IUserUsedPromotionProgramme {
  const student = params.student as Record<string, unknown>;
  const course = params.course as Record<string, unknown>;
  return {
    student: student?.name as string,
    course: course?.name as string,
  };
}

export function convertToUserUsedPromotionList(
  params: Record<string, unknown>[],
): IUserUsedPromotionProgramme[] {
  return params?.map((item) => convertToUserUsedPromotion(item)) || [];
}
