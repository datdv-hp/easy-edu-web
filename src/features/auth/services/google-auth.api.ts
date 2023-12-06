import axiosService from '@/plugins/axios';
import { ApiService } from '@/plugins/axios/api';
import { IGoogleLoginLinkParams } from '../interfaces';
import { IBodyResponse } from '@/common/interfaces';

class GoogleAuthApiService extends ApiService {
  async getGoogleLoginLink(params: IGoogleLoginLinkParams) {
    const getLoginLinkUrl = `${this.baseUrl}/google-login-link`;
    return this.client.get(getLoginLinkUrl, { params });
  }

  async getGoogleLoginEmail(params: {
    code: string;
    redirectUri: string;
  }): Promise<IBodyResponse<Record<string, unknown>>> {
    const getLoginLinkUrl = `${this.baseUrl}/google-login-email`;
    return this.client.get(getLoginLinkUrl, { params });
  }
}
export const googleAuthApi = new GoogleAuthApiService(
  { baseUrl: '/google' },
  axiosService,
);
