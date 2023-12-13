import { get } from 'lodash';

import { CriteriaType, StatusEvaluationCriteriaType, TypeScore } from '../constant';
import {
    IEvaluationItemContent,
    IEvaluationItemFormResponse,
    IEvaluationType,
} from '../interfaces/setting-evaluation.interfaces';

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
