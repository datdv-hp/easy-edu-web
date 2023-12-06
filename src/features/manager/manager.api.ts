import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse } from '@/common/interfaces';
import { getManagerCreateFormData, getManagerUpdateFormData } from './helpers';

class ManagerApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this._update(id, getManagerUpdateFormData(params));
  }

  create(params: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this._create(getManagerCreateFormData(params));
  }

  detail(id: number | string): Promise<IBodyResponse<any>> {
    return this._getDetail(id);
  }

  moreDetail(id: string): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.get(`${this.baseUrl}/${id}/detail`);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }
}

export const managerApiService = new ManagerApiService(
  { baseUrl: '/manager' },
  axiosService,
);
