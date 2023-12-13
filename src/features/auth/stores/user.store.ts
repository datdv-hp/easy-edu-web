import { ProfileType, Role } from '@/common/constants';
import { IUserRole, type IBodyResponse } from '@/common/interfaces';
import localStorageAuthService from '@/common/storages/authStorage';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { convertToActiveAccountBody, convertToUser } from '../helpers';
import type {
  IMaster,
  IUserChangePassword,
  IUserProfile,
  IUserUpdatePassword,
} from '../interfaces';
import { authApi } from '../services/auth.api';
import { userApiService } from '../services/user.api';

export const useUserStore = defineStore('userStore', () => {
  const userRole = ref<IUserRole>();
  const isFetching = ref(false);
  const isShowDialogChangePassword = ref(false);
  const profile = ref(localStorageAuthService.getLoginUser());

  const isMaster = computed(() => {
    return (profile.value as IMaster)?.userRole === Role.MASTER;
  });

  async function getProfile() {
    isFetching.value = true;
    const response: IBodyResponse<IUserProfile> = await authApi._getOwnProfile();
    if (response.success) {
      const _profile = convertToUser(response.data);
      const _userRole = response.data?.features as IUserRole;
      profile.value = _profile;
      userRole.value = _userRole;
      localStorageAuthService.setLoginUser(_profile, _userRole);
    }
    isFetching.value = false;
    return response;
  }

  const updateProfile = async (values: any) => {
    if (isMaster.value) {
      return;
    }
    isFetching.value = true;
    let response: IBodyResponse<IUserProfile>;
    switch (profile.value?.type) {
      case ProfileType.STUDENT:
        response = await authApi._updateStudentProfile({
          ...values,
          type: profile.value?.type,
        });
        break;

      case ProfileType.TEACHER:
        response = await authApi._updateTeacherProfile({
          ...values,
          type: profile.value?.type,
        });
        break;

      default:
        response = await authApi._updateManagerProfile({
          ...values,
          type: profile.value?.type,
        });
        break;
    }
    isFetching.value = false;
    return response;
  };

  const activeAccount = async (data: Record<string, string | boolean>) => {
    const response = await userApiService.activeAccount(convertToActiveAccountBody(data));
    return response;
  };

  const updatePassword = async (data: IUserUpdatePassword) => {
    const response = await userApiService.updatePassword(data);
    return response;
  };

  const forgotPassword = async (email: string) => {
    const response = await userApiService.forgotPassword(email);
    return response;
  };

  const changePassword = async (body: IUserChangePassword) => {
    const response = await userApiService.changePassword(body);
    return response;
  };

  const currentUserId = computed(() => {
    return profile.value?.id;
  });

  return {
    updateProfile,
    getProfile,
    isFetching,
    profile,
    userRole,
    isMaster,
    activeAccount,
    updatePassword,
    forgotPassword,
    changePassword,
    currentUserId,
    isShowDialogChangePassword,
  };
});
