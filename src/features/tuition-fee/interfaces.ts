import { ICommonListQuery } from '@/common/interfaces';
import { PromotionPriority, TuitionStatus, PromotionType } from './constants';

export interface ITuitionFeeListQuery extends ICommonListQuery {
    classroomIds?: string[];
    statuses?: TuitionStatus[];
    startDate?: string;
    endDate?: string;
    counselorIds?: string[];
}
export interface ITuitionFeeListItem {
    id: string;
    code: string;
    studentName: string;
    className: string;
    courseName: string;
    startDate: string;
    endDate: string;
    originalValue: string; // original tuition fee of the course
    promotionValue: string;
    payValue: string; // tuition fee after discount
    paidValue: string; // paid tuition fee
    shortageValue: string; // shortage tuition fee: Max(0, value - paidValue)
    status: TuitionStatus;
    presenterName: string;
}

export interface IPromotionInfo {
    id: string;
    name: string;
    type: PromotionType;
    value: number;
    finalValue: number;
    priority: PromotionPriority;
}

export type IPromotionOptionInfo = {
    id: string;
    name: string;
    type: PromotionType;
    value: number;
};

export interface ITuitionFeeDetail {
    id: string;
    code: string;
    studentName: string;
    className: string;
    courseName: string;
    courseId: string;
    presenterName: string; // counselor name
    startDate: string;
    endDate: string;
    originalValue: number; // original tuition fee of the course
    promotions: IPromotionInfo[];
    promotionValue: number;
    payValue: number; // tuition fee after discount
    paidValue: number; // paid tuition fee
    shortageValue: number; // shortage tuition fee: Max(0, value - paidValue)
}

export type IPaymentInfo = {
    id: string;
    code: string;
    payValue: number;
    paidValue: number;
    shortageValue: number;
};

export interface IPaymentHistory {
    id: string;
    value: string | number;
    method: string;
    paymentDate: string;
    editDate: string;
}
