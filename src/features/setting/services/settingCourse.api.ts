import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse, IGetListResponse } from '@/common/interfaces';
import { ICourseType, IEvaluationItemQuery } from '../interfaces';

class SettingCourseApiService extends ApiService {
  getAllCourseType(
    queryString: IEvaluationItemQuery,
  ): Promise<IBodyResponse<IGetListResponse<ICourseType>>> {
    return this.client.get(`${this.baseUrl}`, { params: queryString });
  }

  getCourseTypeDetail(id: string): Promise<IBodyResponse<ICourseType>> {
    return this.client.get(`${this.baseUrl}/${id}`);
  }

  createCourseType(body: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this.client.post(`${this.baseUrl}`, body);
  }

  updateCourseType(
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

export const settingCourseApiService = new SettingCourseApiService(
  { baseUrl: '/course-form-setting' },
  axiosService,
);
