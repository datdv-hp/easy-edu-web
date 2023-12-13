import { ICommonListQuery } from '@/common/interfaces';

export type IPaymentMethodListQuery = ICommonListQuery;

export type IPaymentMethodListItem = {
    id: string;
    name: string;
};

export type IPaymentMethodDetail = {
    id: string;
    name: string;
};
