import type { IBodyResponse } from '@/common/interfaces';
import axiosInstance from '@/plugins/axios';
import { ApiService } from '@/plugins/axios/api';
import {
  getUpdateManagerProfileFormData,
  getUpdateStudentProfileFormData,
  getUpdateTeacherProfileFormData,
} from '../helpers';
import type { IBodyLogin, ILoginResponse } from '../interfaces';

class AuthApiService extends ApiService {
  login(body: IBodyLogin): Promise<IBodyResponse<ILoginResponse>> {
    return this.client.post(`${this.baseUrl}/login`, body);
  }
  logout(): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.post(`${this.baseUrl}/logout`);
  }

  _getOwnProfile<R>(): Promise<IBodyResponse<R>> {
    return this.client.get('/user/my-profile');
  }

  _updateManagerProfile<R>(params: Record<string, unknown>): Promise<IBodyResponse<R>> {
    return this.client.patch(
      '/user/my-profile-manager',
      getUpdateManagerProfileFormData(params),
    );
  }
  _updateTeacherProfile<R>(params: Record<string, unknown>): Promise<IBodyResponse<R>> {
    return this.client.patch(
      '/user/my-profile-teacher',
      getUpdateTeacherProfileFormData(params),
    );
  }
  _updateStudentProfile<R>(params: Record<string, unknown>): Promise<IBodyResponse<R>> {
    return this.client.patch(
      '/user/my-profile-student',
      getUpdateStudentProfileFormData(params),
    );
  }
}

export const authApi = new AuthApiService({ baseUrl: '/auth' }, axiosInstance);
