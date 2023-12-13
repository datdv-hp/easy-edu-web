import { IBodyResponse, IGetListResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import { convertToPaymentMethodForm } from '../helpers/payment-method.helpers';
import { IPaymentMethodListQuery } from '../interfaces/payment-method.interfaces';

class PaymentMethodService extends ApiService {
    bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
        return this.client.delete(this.baseUrl, { data: ids });
    }

    getList(
        query: IPaymentMethodListQuery,
    ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
        return this.client.get(this.baseUrl, { params: query });
    }

    create(
        params: Record<string, unknown>,
    ): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.post(this.baseUrl, convertToPaymentMethodForm(params));
    }
    update(
        id: string,
        params: Record<string, unknown>,
    ): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.patch(
            `${this.baseUrl}/${id}`,
            convertToPaymentMethodForm(params),
        );
    }
}
export const paymentMethodService = new PaymentMethodService(
    { baseUrl: '/payment-method' },
    axiosService,
);
