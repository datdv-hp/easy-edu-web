import { defineStore } from 'pinia';
import type {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
  IOrderDirection,
} from '@/common/interfaces';
import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import { computed, reactive, ref } from 'vue';
import { CourseOrderBy } from '@/features/courses/contants';
import { IEvaluationType } from '../interfaces/setting-evaluation.interfaces';
import { settingEvaluationClassifiedApiService } from '../services/settingEvaluationClassified.api';
import { convertToEvaluationTypeFormData } from '../helpers/setting-evaluation.helpers';

export const useSettingEvaluationStore = defineStore('setting-evaluation', () => {
  const list = ref<IEvaluationType[]>([]);
  const isFetching = ref<boolean>(false);
  const selectedIds = ref<string[]>([]);
  const total = ref<number>(0);
  const evaluationTypeListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderBy: CourseOrderBy.CREATED_AT,
    orderDirection: OrderDirection.DESC,
  });

  function setInputSearch(search: string | undefined) {
    evaluationTypeListQuery.keyword = search;
  }

  async function getList() {
    isFetching.value = true;
    const response: IBodyResponse<IGetListResponse<IEvaluationType>> =
      await settingEvaluationClassifiedApiService.getAllEvaluationClassified(
        evaluationTypeListQuery,
      );
    if (!response.success) {
      isFetching.value = false;
      return response;
    }
    total.value = response.data?.totalItems;
    list.value = convertToEvaluationTypeFormData(response.data?.items as any[]);
    isFetching.value = false;
    return response;
  }

  const setQuery = (_query: ICommonListQuery) => {
    const query = { ...evaluationTypeListQuery, ..._query };
    Object.assign(evaluationTypeListQuery, query);
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
      evaluationTypeListQuery.orderBy = orderByArray.join(',');
      evaluationTypeListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      evaluationTypeListQuery.orderBy = CourseOrderBy.CREATED_AT;
      evaluationTypeListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  const setPage = (page: number) => {
    evaluationTypeListQuery.page = page;
  };

  const showDelete = computed(() => {
    return selectedIds.value.length > 0;
  });

  function removeSelectedItems() {
    return settingEvaluationClassifiedApiService.bulkDelete(selectedIds.value);
  }

  const isEmptySelected = computed(() => {
    return !selectedIds.value.length;
  });

  const isAllSelected = computed(() => {
    return list.value.length && selectedIds.value.length === list.value.length;
  });

  function selectAll() {
    list.value.forEach((item) => {
      selectedIds.value.push(item.id);
    });
  }

  function unSelectAll() {
    selectedIds.value = [];
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

  return {
    list,
    selectedIds,
    showDelete,
    isEmptySelected,
    isAllSelected,
    totalPages,
    evaluationTypeListQuery,
    isFetching,
    total,
    setPage,
    setInputSearch,
    getList,
    setQuery,
    setOrder,
    removeSelectedItems,
    selectAll,
    unSelectAll,
    toggleSelectAll,
  };
});
