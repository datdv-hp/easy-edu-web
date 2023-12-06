import { IBodyResponse, ICommonListQuery, IGetListResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import { convertToRoleFormData } from '../helpers';

class AuthorizationApiService extends ApiService {
  getList(
    params: ICommonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
    return this.client.get(this.baseUrl, { params });
  }

  create(
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.post(this.baseUrl, convertToRoleFormData(params));
  }

  update(
    id: string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.patch(`${this.baseUrl}/${id}`, convertToRoleFormData(params));
  }

  delete(id: string): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.delete(`${this.baseUrl}/${id}`);
  }

  getDefaultFeatures(): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get(`${this.baseUrl}/default-features`);
  }
}

export const authorizationApiService = new AuthorizationApiService(
  { baseUrl: '/role' },
  axiosService,
);
