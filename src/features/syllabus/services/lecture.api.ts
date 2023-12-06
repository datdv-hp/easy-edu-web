import { IBodyResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import {
  convertToCreateLectureFormData,
  convertToUpdateLectureFormData,
} from '../helpers';

class LectureApiService extends ApiService {
  create(
    syllabusId: string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.post(
      this.baseUrl,
      convertToCreateLectureFormData({ ...params, syllabusId }),
    );
  }

  update(
    syllabusId: string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.patch(
      `${this.baseUrl}/${syllabusId}`,
      convertToUpdateLectureFormData(params),
    );
  }

  bulkDelete(syllabusIds: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: syllabusIds });
  }

  getDetails(ids: string[]): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get(this.baseUrl, { params: { ids } });
  }

  getDetailDocument(id: string, fileName: string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/${id}/document`, {
      params: { fileName },
    });
  }
}

export const lectureApiService = new LectureApiService(
  { baseUrl: '/lecture' },
  axiosService,
);
