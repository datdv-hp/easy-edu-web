import { defineStore } from 'pinia';
import type { ISubject } from '../interfaces';
import type {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
  IOption,
  IOrderDirection,
} from '@/common/interfaces';
import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import { computed, reactive, ref } from 'vue';
import { subjectApiService } from '../services/subject.api';
import { convertToSubject, transformSubject } from '../helpers';
import { convertToOptions } from '@/common/helpers';

export const useSubjectStore = defineStore('subject', () => {
  const list = ref<ISubject[]>([]);
  const detail = ref<ISubject>();
  const isFetching = ref<boolean>(false);
  const selectedIds = ref<Record<string, boolean>>({});
  const total = ref<number>(0);
  const subjectListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    keyword: '',
    orderBy: 'createdAt',
    orderDirection: OrderDirection.DESC,
  });

  const subjectDropdownList = ref<IOption[]>([]);

  function setInputSearch(search: string | undefined) {
    subjectListQuery.keyword = search;
  }

  async function getList() {
    isFetching.value = true;
    let response: IBodyResponse<IGetListResponse<ISubject>> =
      await subjectApiService._getList(subjectListQuery);
    if (!response.success) {
      isFetching.value = false;
      return response;
    }
    total.value = response.data?.totalItems;
    if (subjectListQuery.page && subjectListQuery.page <= totalPages.value) {
      selectedIds.value = {};
      list.value = transformSubject(response.data?.items);
      isFetching.value = false;
      return response;
    }
    setPage(totalPages.value);
    response = await subjectApiService._getList(subjectListQuery);
    if (response.success) {
      selectedIds.value = {};
      list.value = transformSubject(response.data?.items);
      total.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }

  async function getDetail(id: string) {
    isFetching.value = true;
    const response: IBodyResponse<IGetListResponse<any>> =
      await subjectApiService._getDetail(id);
    if (response.success) {
      detail.value = convertToSubject(response.data as any);
    }
    isFetching.value = false;
    return response;
  }

  const setQuery = (_query: ICommonListQuery) => {
    const query = { ...subjectListQuery, ..._query };
    Object.assign(subjectListQuery, query);
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
      subjectListQuery.orderBy = orderByArray.join(',');
      subjectListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      subjectListQuery.orderBy = 'createdAt';
      subjectListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  const setPage = (page: number) => {
    subjectListQuery.page = page;
  };

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
    return subjectApiService.bulkDelete(selectedIdsList.value);
  }

  const isEmptySelected = computed(() => {
    return !selectedIdsList.value.length;
  });

  const isAllSelected = computed(() => {
    return list.value.length && selectedIdsList.value.length === list.value.length;
  });

  function selectAll() {
    list.value.forEach((subject) => {
      selectedIds.value[subject.id] = true;
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

  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  async function getDropdown() {
    const res = await subjectApiService.getDropDown({});
    if (res.success) {
      subjectDropdownList.value = convertToOptions(res.data);
    } else {
      subjectDropdownList.value = [];
    }
    return res;
  }

  return {
    setInputSearch,
    list,
    total,
    subjectListQuery,
    showDelete,
    getList,
    setPage,
    setOrder,
    setSelectedIds,
    removeSelectedItems,
    isFetching,
    selectedIds,
    selectAll,
    isAllSelected,
    isEmptySelected,
    unSelectAll,
    selectedIdsList,
    toggleSelectAll,
    totalPages,
    getDetail,
    subjectDropdownList,
    getDropdown,
    setQuery,
  };
});
