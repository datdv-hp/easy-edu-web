import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse } from '@/common/interfaces';
import {
  ICreateLeaveRequest,
  IHandleLeaveRequestBody,
  ILessonLeave,
} from '../interfaces';
import { convertToCreateTimeKeepingBody } from '../helpers';

class ScheduleTrackingApiService extends ApiService {
  _detailUrl(id: string | number) {
    return `${this.baseUrl}/schedule/${id}`;
  }
  _leaveUrl() {
    return `${this.baseUrl}/request-leave`;
  }
  _handleLeaveUrl(id: string | number) {
    return this._leaveUrl() + '/' + id;
  }

  /**
   * @param id Lesson ID
   */
  detail(id: number | string): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.get(this._detailUrl(id));
  }

  createLeaveRequest(data: ICreateLeaveRequest): Promise<IBodyResponse<ILessonLeave>> {
    return this.client.post(this._leaveUrl(), data);
  }

  deleteLeaveRequest(id: string): Promise<IBodyResponse<ILessonLeave>> {
    return this.client.delete(this._leaveUrl() + `/${id}`);
  }

  /**
   * @param id Leave request ID
   * @param data
   */
  handleLeaveRequest(
    id: string,
    data: IHandleLeaveRequestBody,
  ): Promise<IBodyResponse<ILessonLeave>> {
    return this.client.patch(this._handleLeaveUrl(id), data);
  }

  timekeeping(params: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this.client.patch('/timekeeping', convertToCreateTimeKeepingBody(params));
  }

  timekeepings(params: Record<string, unknown>[]): Promise<IBodyResponse<unknown[]>> {
    return this.client.patch(
      '/timekeeping/bulk-update',
      params.map((param) => convertToCreateTimeKeepingBody(param)),
    );
  }
}

export const scheduleTrackingApi = new ScheduleTrackingApiService(
  { baseUrl: '/lesson' },
  axiosService,
);
