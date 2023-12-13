import { IBodyResponse, ICommonListQuery, IGetListResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import { convertToTuitionForm } from '../helpers';

class TuitionFeeService extends ApiService {
    bulkDelete(ids: string[]): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.delete(this.baseUrl, { data: ids });
    }

    update(
        id: string,
        data: Record<string, unknown>,
    ): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.patch(`${this.baseUrl}/${id}`, convertToTuitionForm(data));
    }

    getPaymentHistories(
        tuitionFeeId: string,
        query: ICommonListQuery,
    ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
        return this.client.get(`${this.baseUrl}/${tuitionFeeId}/payment-history`, {
            params: query,
        });
    }

    getPaymentInfo(tuitionId: string): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.get(`${this.baseUrl}/${tuitionId}/payment-info`);
    }

    createPayment(
        tuitionFeeId: string,
        params: Record<string, unknown>,
    ): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.post(`${this.baseUrl}/${tuitionFeeId}/payment`, params);
    }
}
export const tuitionFeeService = new TuitionFeeService(
    { baseUrl: '/tuition' },
    axiosService,
);
