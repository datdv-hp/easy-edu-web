import { IBodyResponse, ICommonListQuery, IGetListResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import {
  convertToCreateSyllabusFormData,
  convertToUpdateSyllabusFormData,
} from '../helpers';
import { ISyllabusUpdateBody } from '../interfaces';

class SyllabusApiService extends ApiService {
  create(
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.post(this.baseUrl, convertToCreateSyllabusFormData(params));
  }

  update(id: string, params: Record<string, unknown>) {
    return this._update<ISyllabusUpdateBody, IBodyResponse<Record<string, unknown>>>(
      id,
      convertToUpdateSyllabusFormData(params),
    );
  }

  getDetail(id: string) {
    return this._getDetail<IBodyResponse<Record<string, unknown>>>(id);
  }

  getLectureList(
    id: string,
    queryParams: ICommonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
    return this.client.get(`${this.baseUrl}/${id}/lecture`, { params: queryParams });
  }

  getUpdateHistoryList(
    id: string,
    queryParams: ICommonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
    return this.client.get(`${this.baseUrl}/${id}/syllabus-history-edit`, {
      params: queryParams,
    });
  }

  delete(id: string) {
    return this._delete<IBodyResponse<Record<string, unknown>>>(id);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }
}

export const syllabusApiService = new SyllabusApiService(
  { baseUrl: '/syllabus' },
  axiosService,
);
