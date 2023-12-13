import { IBodyResponse } from '@/common/interfaces';
import axiosInstance, { ApiService } from '@/plugins/axios';
import { convertToRegisterForm } from '../helpers';
import { RegistrationStatus } from '../constants';

class RegistrationApiService extends ApiService {
  register(data: any): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.post(this.baseUrl, convertToRegisterForm(data));
  }

  switchStatus(
    id: string,
    status: RegistrationStatus,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.patch(`${this.baseUrl}/${id}`, { status });
  }
}

export const RegistrationApi = new RegistrationApiService(
  { baseUrl: '/registration' },
  axiosInstance,
);
