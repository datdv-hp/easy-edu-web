import { IBodyResponse, IGetListResponse } from '@/common/interfaces';
import axiosInstance, { ApiService } from '@/plugins/axios';
import {
  ICreateTimekeeping,
  ITeacherTimeKeepingListQuery,
  ITimeKeeping,
  ITimeKeepingListQuery,
  IUpdateTimekeeping,
} from '../interfaces';

export class TimeKeepingApiService extends ApiService {
  get(
    query: ITimeKeepingListQuery,
  ): Promise<IBodyResponse<IGetListResponse<ITimeKeeping>>> {
    return this.client.get(this.baseUrl, {
      params: query,
    });
  }

  create(body: ICreateTimekeeping): Promise<IBodyResponse<ITimeKeeping>> {
    return this._create<any, IBodyResponse<ITimeKeeping>>(body);
  }

  update(
    timekeepingId: string,
    body: IUpdateTimekeeping,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.patch(`${this.baseUrl}/${timekeepingId}`, body);
  }

  delete(id: string): Promise<IBodyResponse<any>> {
    return this.client.delete(`${this.baseUrl}/${id}`);
  }

  getTeacherTimekeeping(
    query: ITeacherTimeKeepingListQuery,
  ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
    return this.client.get(`${this.baseUrl}/teacher`, {
      params: query,
    });
  }

  getTimekeepingOfTeacher(
    query: ITimeKeepingListQuery,
    teacherId: string,
  ): Promise<IBodyResponse<ITimeKeeping[]>> {
    return this.client.get(`${this.baseUrl}/teacher/${teacherId}`, {
      params: query,
    });
  }
}

export const timekeepingApiService = new TimeKeepingApiService(
  {
    baseUrl: '/timekeeping',
  },
  axiosInstance,
);
