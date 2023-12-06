import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse } from '@/common/interfaces';
import { getSubjectCreateFormData, getSubjectUpdateFormData } from '../helpers';

class SubjectApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this._update(id, getSubjectUpdateFormData(params));
  }

  create(params: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this._create(getSubjectCreateFormData(params));
  }

  detail(id: number | string): Promise<IBodyResponse<any>> {
    return this._getDetail(id);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }

  getDropDown(param: {
    courseId?: string;
    classroomId?: string;
  }): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/dropdown`, {
      params: {
        ...param,
      },
    });
  }
}

export const subjectApiService = new SubjectApiService(
  { baseUrl: '/subject' },
  axiosService,
);
