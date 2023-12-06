import { IBodyResponse, IGetListResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import { IScheduleListQuery } from '../schedule-tracking/interfaces';
import { getLessonUpdateFormData } from './helpers';
import { ICreateLessonForm, ILessonDetail, ILessonListQuery } from './interfaces';

class LessonApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this._update(id, getLessonUpdateFormData(params));
  }

  create(body: ICreateLessonForm): Promise<IBodyResponse<any>> {
    return this._create(body);
  }

  detail(id: number | string): Promise<IBodyResponse<any>> {
    return this._getDetail(id);
  }

  detailInfo(id: number | string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/detail/${id}`);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }

  getList(
    queryString: ILessonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<ILessonDetail>>> {
    return this.client.get(`${this.baseUrl}`, {
      params: queryString,
    });
  }

  getListForSChedule(queryString: IScheduleListQuery): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/schedule`, { params: queryString });
  }
}

export const lessonApiService = new LessonApiService(
  { baseUrl: '/lesson' },
  axiosService,
);
