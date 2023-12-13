import { PromotionType, PromotionStatus } from '../constant';

export interface IPromotionProgrammeListItem {
    id: string;
    name: string;
    applyForCourses: string; // course names joined by comma. Eg: 'course1, course2'
    value: string;
    type: PromotionType;
    usedCount: string; // number of used times, format: <usedTimes>/<times>. Eg: '10/100'
    startDate: string | Date;
    endDate: string | Date;
    status: PromotionStatus;
}

export interface IPromotionProgrammeDetail {
    id: string;
    description?: string;
    name: string;
    type: PromotionType;
    value: number;
    applyForCourseIds: string[];
    times: number;
    startDate: string | Date;
    endDate: string | Date;
}

export interface IPromotionProgrammeInfo {
    id: string;
    name: string;
    description?: string;
    type: PromotionType;
    value: string;
    times: number;
    startDate: string | Date;
    endDate: string | Date;
    status: PromotionStatus;
}

export interface IUserUsedPromotionProgramme {
    student: string;
    course: string;
}
