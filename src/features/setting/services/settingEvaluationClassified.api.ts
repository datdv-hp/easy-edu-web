import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse, IGetListResponse } from '@/common/interfaces';
import { IEvaluationItemQuery, IEvaluationType } from '../interfaces/setting-evaluation.interfaces';

class SettingEvaluationClassifiedApiService extends ApiService {
  getAllEvaluationClassified(
    queryString: IEvaluationItemQuery,
  ): Promise<IBodyResponse<IGetListResponse<IEvaluationType>>> {
    return this.client.get(`${this.baseUrl}`, { params: queryString });
  }

  createEvaluationClassified(body: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this.client.post(`${this.baseUrl}`, body);
  }

  getEvaluationClassifiedDetail(id: string): Promise<IBodyResponse<IEvaluationType>> {
    return this.client.get(`${this.baseUrl}/${id}`);
  }

  updateEvaluationClassified(
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

export const settingEvaluationClassifiedApiService =
  new SettingEvaluationClassifiedApiService(
    { baseUrl: '/evaluation-classified-setting' },
    axiosService,
  );
