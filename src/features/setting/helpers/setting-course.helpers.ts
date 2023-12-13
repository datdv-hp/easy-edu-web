import { get } from 'lodash';
import { IEvaluationType } from '../interfaces/setting-evaluation.interfaces';

export const convertToCourseTypeFormData = (
    data: Record<string, unknown>[],
): IEvaluationType[] => {
    return data.map((param) => ({
        id: get(param, '_id') as string,
        name: get(param, 'name') as string,
    }));
};
