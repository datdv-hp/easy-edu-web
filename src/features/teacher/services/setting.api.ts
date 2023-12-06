import { ApiService } from '@/plugins/axios/api';
import axiosService from '../../../plugins/axios';
import { IBodyResponse } from '@/common/interfaces';
import {
  getCreateSettingTimekeepingForm,
  getUpdateSettingTimekeepingForm,
} from '../helpers';

class SettingApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this._update(id, getUpdateSettingTimekeepingForm(params));
  }

  create(params: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this._create(getCreateSettingTimekeepingForm(params));
  }

  get(): Promise<IBodyResponse<any>> {
    return this.client.get(this.baseUrl);
  }
}
export const settingApiService = new SettingApiService(
  { baseUrl: '/general-setting/time-keeping' },
  axiosService,
);
