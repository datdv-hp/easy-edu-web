import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  RoleType,
} from '@/common/constants';
import { ICommonListQuery } from '@/common/interfaces';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { convertToRole } from '../helpers/authorization.helpers';
import { IDefaultFeature, IRoleInfo } from '../interfaces/authorization.interfaces';
import { authorizationApiService } from '../services/authorization.api';
import { isUndefined } from 'lodash';

export const useAuthorizationStore = defineStore('authorization', () => {
  const list = ref<IRoleInfo[]>([]);
  const total = ref(0);
  const isCreating = ref(false);
  const isFetching = ref(false);
  const isSubmitting = ref(false);
  const roleListQuery = ref<ICommonListQuery>({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
  });
  const selectedId = ref<string>();
  const permissions = ref<IDefaultFeature[]>([]);

  const detail = ref<IRoleInfo>();
  const currentRoleType = ref<RoleType>();
  const openedRoleTypes = ref<RoleType[]>([]);
  const isDefaultRole = computed(() => detail.value?.isDefault);

  function setDetail(id?: string) {
    if (!list.value.length) return;
    if (!id) {
      selectedId.value = list.value[0].id;
      detail.value = list.value[0];
      return;
    }
    const roleInfo = list.value.find((item) => item.id === id);
    if (roleInfo) {
      detail.value = roleInfo;
    }
  }
  // API service
  async function getList(isReset = true, queryParams = roleListQuery.value) {
    isFetching.value = true;
    if (isReset) {
      roleListQuery.value.page = DEFAULT_FIRST_PAGE;
    }
    const res = await authorizationApiService.getList(queryParams);
    if (!res.success) {
      isFetching.value = false;
      return res;
    }
    const roles = res.data.items.map((params) => convertToRole(params));
    if (isReset) {
      list.value = roles;
    } else {
      list.value.push(...roles);
    }
    setDetail(selectedId.value);
    if (detail.value?.type && !openedRoleTypes.value.includes(detail.value?.type)) {
      openedRoleTypes.value.push(detail.value.type);
    }
    total.value = res.data?.totalItems || 0;
    isFetching.value = false;
    return res;
  }

  async function getDefaultFeatures() {
    const res = await authorizationApiService.getDefaultFeatures();
    if (res.success) {
      permissions.value = res.data as unknown as IDefaultFeature[];
    }
    return res;
  }

  async function createRole(params: Record<string, unknown>) {
    isSubmitting.value = true;
    const res = await authorizationApiService.create(params);
    isSubmitting.value = false;
    return res;
  }
  async function updateRole(
    params: Record<string, unknown>,
    id = selectedId.value as string,
  ) {
    isSubmitting.value = true;
    const res = await authorizationApiService.update(id, params);
    isSubmitting.value = false;
    return res;
  }
  async function deleteRole(id = selectedId.value as string) {
    const res = await authorizationApiService.delete(id);
    return res;
  }
  // API service end

  const defaultPermissionKeys = computed(() => {
    return (
      permissions.value.find((item) => item.type === currentRoleType.value) ||
      ({} as IDefaultFeature)
    );
  });

  const defaultFeatures = computed(() => {
    const _permissions = {} as Record<string, any>;
    const _defaultPermissionKeys = defaultPermissionKeys.value.keys;
    const groupKeys = Object.keys(_defaultPermissionKeys || {});
    groupKeys.forEach((groupKey) => {
      _permissions[groupKey] = Object.fromEntries(
        _defaultPermissionKeys[groupKey]?.map((key) => [key, false]),
      );
    });
    if (currentRoleType.value === RoleType.MANAGER) {
      if (!isUndefined(_permissions?.course?.view)) {
        _permissions.course.view = true;
      }
    } else {
      if (!isUndefined(_permissions?.course?.viewPersonal)) {
        _permissions.course.viewPersonal = true;
      }
    }
    return _permissions;
  });

  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  const isEmptyRoleList = computed(() => !total.value);

  function setPage(page?: number) {
    if (!page) {
      roleListQuery.value.page = DEFAULT_FIRST_PAGE;
      return;
    }
    roleListQuery.value.page = page;
  }
  function setKeyword(keyword?: string) {
    if (!keyword) {
      roleListQuery.value.keyword = undefined;
      return;
    }
    roleListQuery.value.keyword = keyword;
  }

  function setQuery(_query: ICommonListQuery) {
    if (!_query) return;
    const query = { ...roleListQuery.value, ..._query };
    Object.assign(roleListQuery.value, query);
  }

  function setIsCreating(_isCreating: boolean) {
    isCreating.value = _isCreating;
  }
  function setIsFetching(_isFetching: boolean) {
    isFetching.value = _isFetching;
  }

  function setSelectedId(id?: string) {
    selectedId.value = id;
  }

  function setCurrentRoleType(type?: RoleType) {
    currentRoleType.value = type;
  }

  return {
    list,
    getList,
    defaultFeatures,
    getDefaultFeatures,
    roleListQuery,
    total,
    totalPages,
    setPage,
    setKeyword,
    setQuery,
    detail,
    setSelectedId,
    isCreating,
    setIsCreating,
    isSubmitting,
    createRole,
    updateRole,
    selectedId,
    deleteRole,
    isFetching,
    setIsFetching,
    isEmptyRoleList,
    setDetail,
    isDefaultRole,
    defaultPermissionKeys,
    currentRoleType,
    setCurrentRoleType,
    openedRoleTypes,
  };
});
