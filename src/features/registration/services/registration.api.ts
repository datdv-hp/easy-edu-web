import { IBodyResponse } from '@/common/interfaces';
import axiosInstance, { ApiService } from '@/plugins/axios';
import { convertToRegisterForm } from '../helpers';

class RegistrationApiService extends ApiService {
  register(data: any): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.post(this.baseUrl, convertToRegisterForm(data));
  }
}

export const RegistrationApi = new RegistrationApiService(
  { baseUrl: '/registration' },
  axiosInstance,
);