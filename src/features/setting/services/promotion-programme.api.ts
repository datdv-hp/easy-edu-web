import { IBodyResponse, ICommonListQuery, IGetListResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import { convertToPromotionFormData } from '../helpers/promotion-programme.helper';

class PromotionProgrammeService extends ApiService {
    bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
        return this.client.delete(this.baseUrl, { data: ids });
    }

    create(
        params: Record<string, unknown>,
    ): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.post(this.baseUrl, convertToPromotionFormData(params));
    }
    update(
        id: string,
        params: Record<string, unknown>,
    ): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.patch(
            `${this.baseUrl}/${id}`,
            convertToPromotionFormData(params),
        );
    }

    getInfo(id: string): Promise<IBodyResponse<Record<string, unknown>>> {
        return this.client.get(`${this.baseUrl}/${id}/detail`);
    }

    // TODO: update endpoint
    getStudentListUsedPromotionProgramme(
        promotionId: string,
        query: ICommonListQuery,
    ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
        return this.client.get(`${this.baseUrl}/${promotionId}/utilization`, {
            params: query,
        });
    }
}
export const promotionProgrammeService = new PromotionProgrammeService(
    { baseUrl: '/promotion' },
    axiosService,
);
