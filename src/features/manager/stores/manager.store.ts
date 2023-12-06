import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
  RoleType,
} from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import type {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
  IOption,
  IOrderDirection,
} from '@/common/interfaces';
import { userApiService } from '@/features/auth/services/user.api';
import { useUserStore } from '@/features/auth/stores';
import { commonApiService } from '@/features/common/services/common.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { DEFAULT_MANAGER_ORDERBY } from '../constants';
import { convertToManager, transformManager } from '../helpers';
import type { IManager, IManagerProfileDetail } from '../interfaces';
import { managerApiService } from '../manager.api';

type IManagerListQuery = ICommonListQuery & {
  isTeacher?: boolean;
};

export const useManagerStore = defineStore('manager', () => {
  const list = ref<IManager[]>([]);
  const total = ref<number>(0);
  const isFetching = ref<boolean>(false);
  const profile = ref<IManagerProfileDetail>();
  const subjects = ref<IOption[]>([]);
  const roleOptions = ref<IOption[]>([]);
  const tab = ref(null);
  const selectedIds = ref<Record<string, boolean>>({});
  const managerListQuery: IManagerListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderBy: DEFAULT_MANAGER_ORDERBY,
    orderDirection: OrderDirection.DESC,
  });
  const userStore = useUserStore();

  function setInputSearch(search: string | undefined) {
    managerListQuery.keyword = search;
  }
  async function getList(queryString = managerListQuery) {
    isFetching.value = true;
    let response: IBodyResponse<IGetListResponse<IManager>> =
      await managerApiService._getList(queryString);
    if (!response.success) {
      isFetching.value = false;
      return response;
    }

    total.value = response.data?.totalItems;
    if (managerListQuery.page && managerListQuery.page <= totalPages.value) {
      selectedIds.value = {};
      list.value = transformManager(response.data?.items);
      isFetching.value = false;
      return response;
    }

    setPage(totalPages.value);
    response = await managerApiService._getList(queryString);
    if (response.success) {
      selectedIds.value = {};
      list.value = transformManager(response.data?.items);
      total.value = response.data?.totalItems;
    }

    isFetching.value = false;
    return response;
  }

  async function deleteManager(id: string): Promise<IBodyResponse<any>> {
    const response: IBodyResponse<any> = await managerApiService._delete(id);
    return response;
  }

  async function resendEmail(id = profile?.value?.id as string) {
    if (!id) return;
    const response = await userApiService.resendVerifyEmail(id);
    return response;
  }

  async function getRoleDropdown() {
    const res = await commonApiService._getRoleDropdown(RoleType.MANAGER);
    if (res.success) {
      roleOptions.value = convertToOptions(res.data);
    }
    return res;
  }
  const setQuery = (_query: IManagerListQuery) => {
    const query = { ...managerListQuery, ..._query };
    Object.assign(managerListQuery, query);
  };

  const setOrder = (orders: Record<string, IOrderDirection>) => {
    const orderByArray: string[] = [];
    const orderDirectionArray: OrderDirection[] = [];
    Object.keys(orders).forEach((key) => {
      if (orders[key]) {
        orderByArray.push(key);
        orderDirectionArray.push(orders[key] as OrderDirection);
      }
    });
    if (
      orderByArray.length &&
      orderDirectionArray.length &&
      orderByArray.length === orderDirectionArray.length
    ) {
      managerListQuery.orderBy = orderByArray.join(',');
      managerListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      managerListQuery.orderBy = 'createdAt';
      managerListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  const setPage = (page: number) => {
    managerListQuery.page = page;
  };

  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || DEFAULT_FIRST_PAGE,
  );

  function setSelectedIds(id: string) {
    selectedIds.value[id] = !selectedIds.value[id];
  }

  const showDelete = computed(() => {
    return selectedIdsList.value.length > 0;
  });

  const selectedIdsList = computed(() => {
    return Object.keys(selectedIds.value).filter((id) => selectedIds.value[id]);
  });

  function removeSelectedItems() {
    return managerApiService.bulkDelete(selectedIdsList.value);
  }

  const isEmptySelected = computed(() => {
    return !selectedIdsList.value.length;
  });

  const isAllSelected = computed(() => {
    return list.value.length && selectedIdsList.value.length === list.value.length;
  });

  function selectAll() {
    const currentUserId = userStore.currentUserId;
    list.value.forEach((manager) => {
      if (manager.id !== currentUserId) {
        selectedIds.value[manager.id] = true;
      }
    });
  }

  function unSelectAll() {
    selectedIds.value = {};
  }

  function toggleSelectAll() {
    if (isEmptySelected.value) {
      selectAll();
      return;
    }
    unSelectAll();
  }

  async function getProfile(id: string) {
    isFetching.value = true;
    const response = await managerApiService.moreDetail(id);
    if (response.success) {
      profile.value = convertToManager(response.data as any);
    }
    isFetching.value = false;
    return response;
  }

  function updateProfileValue(values: IManagerProfileDetail) {
    profile.value = values;
  }

  async function getSubjectOptions() {
    const res = await commonApiService._getSubjectDropdown();
    if (res.success) {
      subjects.value = convertToOptions(res.data);
    } else {
      subjects.value = [];
    }
  }

  function resetDetailPage() {
    profile.value = undefined;
  }

  return {
    list,
    managerListQuery,
    total,
    isFetching,
    setInputSearch,
    getList,
    deleteManager,
    setOrder,
    setPage,
    totalPages,
    setSelectedIds,
    showDelete,
    selectedIdsList,
    removeSelectedItems,
    isEmptySelected,
    isAllSelected,
    selectAll,
    unSelectAll,
    toggleSelectAll,
    selectedIds,
    getProfile,
    profile,
    tab,
    updateProfileValue,
    getSubjectOptions,
    subjects,
    resendEmail,
    setQuery,
    resetDetailPage,
    getRoleDropdown,
    roleOptions,
  };
});
