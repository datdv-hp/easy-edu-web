import {
    IPaymentMethodDetail,
    IPaymentMethodListItem,
} from '../interfaces/payment-method.interfaces';

export function convertToPaymentMethodListItem(params: Record<string, unknown>) {
    return {
        id: params._id as string,
        name: params.name as string,
    } as IPaymentMethodListItem;
}

export function convertToPaymentMethodList(params: Record<string, unknown>[]) {
    return params.map(convertToPaymentMethodListItem);
}

export function convertToPaymentMethodDetail(params: Record<string, unknown>) {
    return {
        id: params.id as string,
        name: params.name as string,
    } as IPaymentMethodDetail;
}

export function convertToPaymentMethodForm(params: Record<string, unknown>) {
    return {
        name: params.name as string,
    };
}
