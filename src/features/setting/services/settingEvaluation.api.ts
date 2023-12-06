import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse, IGetListResponse } from '@/common/interfaces';
import { IEvaluationItem, IEvaluationItemQuery } from '../interfaces';

class SettingEvaluationApiService extends ApiService {
  getAllEvaluation(
    queryString: IEvaluationItemQuery,
  ): Promise<IBodyResponse<IGetListResponse<IEvaluationItem>>> {
    return this.client.get(`${this.baseUrl}`, { params: queryString });
  }

  getEvaluationDetail(id: string): Promise<IBodyResponse<IEvaluationItem>> {
    return this.client.get(`${this.baseUrl}/${id}`);
  }

  createEvaluation(body: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this.client.post(`${this.baseUrl}`, body);
  }

  updateEvaluation(
    id: string,
    body: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this.client.patch(`${this.baseUrl}/${id}`, body);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(`${this.baseUrl}/bulk-delete`, {
      data: {
        ids,
      },
    });
  }
}

export const settingEvaluationApiService = new SettingEvaluationApiService(
  { baseUrl: '/evaluation-criteria-setting' },
  axiosService,
);
