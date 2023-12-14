import { DATE_TIME_FORMAT } from '@/common/constants';
import dayjs from '@/plugins/dayjs';
import { PromotionType, TuitionStatus } from './constants';
import {
  IPaymentHistory,
  IPaymentInfo,
  IPromotionInfo,
  IPromotionOptionInfo,
  ITuitionFeeDetail,
  ITuitionFeeListItem,
} from './interfaces';

export function convertToTuitionFeeListItem(
  params: Record<string, unknown>,
): ITuitionFeeListItem {
  const student = params.student as Record<string, unknown>;
  const classroom = params.classroom as Record<string, unknown>;
  const course = params.course as Record<string, unknown>;
  const presenter = params.presenter as Record<string, unknown>;
  const startDate = params.paymentStartDate as string;
  const endDate = params.paymentEndDate as string;
  const originalValue = params.originalValue as number;
  const promotionValue = params.promotionValue as number;
  const payValue = params.payValue as number;
  const paidValue = params.paidValue as number;
  const shortageValue = params.shortageValue as number;
  return {
    id: params._id as string,
    code: params.code as string,
    studentName: student?.name as string,
    className: classroom?.name as string,
    courseName: course?.name as string,
    startDate: startDate
      ? dayjs(startDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
      : '',
    endDate: endDate ? dayjs(endDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN) : '',
    originalValue: formatCurrencyVND(originalValue),
    promotionValue: formatCurrencyVND(promotionValue),
    payValue: formatCurrencyVND(payValue),
    paidValue: formatCurrencyVND(paidValue),
    shortageValue: formatCurrencyVND(shortageValue),
    status: params.status as TuitionStatus,
    presenterName: (presenter?.name as string) || '-',
  };
}
export function convertToTuitionFeeList(
  params: Record<string, unknown>[],
): ITuitionFeeListItem[] {
  return params.map((item) => convertToTuitionFeeListItem(item));
}

export function convertToPromotionsInfo(params: Record<string, unknown>[]) {
  return params.map((item) => {
    return {
      id: item._id || (item.id as string),
      name: item.name as string,
      type: item.type as PromotionType,
      value: item.value as number,
      finalValue: item.finalValue as number,
      priority: item.priority as number,
    } as IPromotionInfo;
  });
}
export function convertToTuitionFeeDetail(
  params: Record<string, unknown>,
): ITuitionFeeDetail {
  const student = params.student as Record<string, unknown>;
  const classroom = params.classroom as Record<string, unknown>;
  const course = params.course as Record<string, unknown>;
  const presenter = params.presenter as Record<string, unknown>;
  const startDate = params.paymentStartDate as string;
  const endDate = params.paymentEndDate as string;
  const originalValue = params.originalValue as number;

  const _promotions = params.promotions as Record<string, unknown>[];
  const promotions = convertToPromotionsInfo(_promotions);
  const promotionValue = params.promotionValue as number;
  const payValue = params.payValue as number;
  const paidValue = params.paidValue as number;
  return {
    id: params._id as string,
    code: params.code as string,
    studentName: student?.name as string,
    className: classroom?.name as string,
    courseName: course?.name as string,
    courseId: course?._id as string,
    originalValue: originalValue,
    presenterName: presenter?.name as string,
    startDate: startDate
      ? dayjs(startDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
      : '',
    endDate: endDate ? dayjs(endDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN) : '',
    promotions: promotions,
    promotionValue: promotionValue,
    payValue: payValue,
    paidValue: paidValue,
    shortageValue: params.shortageValue as number,
  };
}

export function convertToTuitionForm(params: Record<string, unknown>) {
  const promotions = params.promotions as Record<string, unknown>[];
  const paymentInfo = params.payment as Record<string, unknown>;
  return {
    promotions: promotions?.map((item) => ({
      id: item.id as string,
      priority: item.priority as number,
    })),
    payment: paymentInfo
      ? {
          endDate: paymentInfo.endDate
            ? dayjs(paymentInfo.endDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
            : undefined,
          startDate: paymentInfo.startDate
            ? dayjs(paymentInfo.startDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
            : undefined,
        }
      : undefined,
  };
}

export function convertToPaymentInfo(params: Record<string, unknown>): IPaymentInfo {
  return {
    id: params._id as string,
    code: params.code as string,
    payValue: params.payValue as number,
    paidValue: params.paidValue as number,
    shortageValue: params.shortageValue as number,
  };
}

export function convertToPaymentHistory(
  params: Record<string, unknown>,
): IPaymentHistory {
  const editDate = params.createdAt as string;
  const paymentDate = params.paymentDate as string;
  return {
    id: params._id as string,
    method: params.method as string,
    value: params.value as string,
    paymentDate: paymentDate
      ? dayjs(paymentDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
      : '',
    editDate: editDate ? dayjs(editDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN) : '',
  };
}

export function convertToPaymentHistories(
  params: Record<string, unknown>[],
): IPaymentHistory[] {
  return params.map((item) => convertToPaymentHistory(item));
}

export function convertTPromotionOptionsMapObject(
  params: Record<string, unknown>[],
): Record<string, IPromotionOptionInfo> {
  const result: Record<string, IPromotionOptionInfo> = {};
  params?.forEach((item) => {
    result[item._id as string] = {
      id: item._id as string,
      name: item.name as string,
      type: item.type as PromotionType,
      value: item.value as number,
    };
  });
  return result;
}

export function removeEmptyPromotions(promotions?: IPromotionInfo[]) {
  return promotions?.filter((item) => item.id && item.priority);
}

export function formatCurrencyVND(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    currencyDisplay: 'code',
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseCurrencyVND(value?: string | number) {
  if (typeof value === 'number') return value;
  const parsedValue = Number(value?.replace(/[^0-9,-]+/g, '').replace(/,/g, '.'));
  if (!isNaN(parsedValue)) return parsedValue;
  return 0;
}
