import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse } from '@/common/interfaces';
import { ITimeKeepingSettingResponse } from '../interfaces/setting-timekeeping.interfaces';

class SettingTimekeepingApiService extends ApiService {
  getSettingTimekeeping(): Promise<IBodyResponse<ITimeKeepingSettingResponse>> {
    return this.client.get(`${this.baseUrl}`);
  }

  updateSettingTimekeeping(
    id: string,
    body: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this.client.patch(`${this.baseUrl}/${id}`, body);
  }
}

export const settingTimekeepingApiService = new SettingTimekeepingApiService(
  { baseUrl: '/general-setting/timekeeping' },
  axiosService,
);
