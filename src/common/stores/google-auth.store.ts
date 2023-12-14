import { IBodyResponse } from '@/common/interfaces';
import {
  IGoogleLoginLinkParams,
  IGoogleLoginLinkResponse,
} from '@/features/auth/interfaces';
import { googleAuthApi } from '@/features/auth/services';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { GOOGLE_AUTH_SERVICE_KEY, localStorageGoogleAuthService } from '../storages';
import { useLocalStorage } from '@vueuse/core';

export const useGoogleAuthStore = defineStore('googleAuthStore', () => {
  const googleCode = useLocalStorage(
    GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE,
    localStorageGoogleAuthService.getGoogleLoginCode(),
  );
  const googleEmail = ref(localStorageGoogleAuthService.getGoogleLoginEmail());
  const _googleLoginLink = ref<string | undefined>(undefined);
  const generateGoogleLoginLink = async (params: IGoogleLoginLinkParams) => {
    const response = (await googleAuthApi.getGoogleLoginLink(
      params,
    )) as IBodyResponse<IGoogleLoginLinkResponse>;
    if (response?.success) {
      setGoogleLoginLink(response.data?.link);
    }
  };
  function setGoogleLoginLink(link: string | undefined) {
    _googleLoginLink.value = link;
  }
  function getGoogleEmail() {
    googleEmail.value = localStorageGoogleAuthService.getGoogleLoginEmail();
  }
  const googleLoginLink = computed(() => _googleLoginLink.value);
  return {
    generateGoogleLoginLink,
    googleLoginLink,
    setGoogleLoginLink,
    googleCode,
    googleEmail,
    getGoogleEmail,
  };
});
