import { defineStore } from 'pinia';
import type {
  IBodyResponse,
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
import { CourseOrderBy } from '@/features/courses/contants';
import { courseApiService } from '@/features/courses/services/courses.api';
import { IEvaluationItem, IEvaluationItemQuery } from '../interfaces/setting-evaluation.interfaces';
import { convertToOptions } from '@/common/helpers';
import { settingEvaluationApiService } from '../services/settingEvaluation.api';

export const useSettingEvaluationItemStore = defineStore(
  'setting-evaluation-item',
  () => {
    const list = ref<IEvaluationItem[]>([]);
    const isFetching = ref<boolean>(false);
    const selectedIds = ref<string[]>([]);
    const total = ref<number>(0);
    const coursesOptions = ref<IOption[]>([]);
    const evaluationItemQuery: IEvaluationItemQuery = reactive({
      page: DEFAULT_FIRST_PAGE,
      limit: DEFAULT_LIMIT_FOR_PAGINATION,
      orderBy: CourseOrderBy.CREATED_AT,
      orderDirection: OrderDirection.DESC,
    });

    function setInputSearch(search: string | undefined) {
      evaluationItemQuery.keyword = search;
    }

    const totalPages = computed(
      () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
    );

    async function getList() {
      isFetching.value = true;
      const response: IBodyResponse<IGetListResponse<IEvaluationItem>> =
        await settingEvaluationApiService.getAllEvaluation(evaluationItemQuery);
      if (!response.success) {
        isFetching.value = false;
        return response;
      }
      total.value = response.data?.totalItems;
      list.value = response.data?.items;
      isFetching.value = false;
      return response;
    }

    const setQuery = (_query: IEvaluationItemQuery) => {
      const query = { ...evaluationItemQuery, ..._query };
      Object.assign(evaluationItemQuery, query);
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
        evaluationItemQuery.orderBy = orderByArray.join(',');
        evaluationItemQuery.orderDirection = orderDirectionArray.join(',');
      } else {
        evaluationItemQuery.orderBy = CourseOrderBy.CREATED_AT;
        evaluationItemQuery.orderDirection = OrderDirection.DESC;
      }
    };

    const setPage = (page: number) => {
      evaluationItemQuery.page = page;
    };

    const showDelete = computed(() => {
      return selectedIds.value.length > 0;
    });

    function removeSelectedItems() {
      return settingEvaluationApiService.bulkDelete(selectedIds.value);
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

    async function getCoursesOptions() {
      const res = await courseApiService.getDropDown();
      if (res.success) {
        coursesOptions.value = convertToOptions(res.data);
      } else {
        coursesOptions.value = [];
      }
    }

    return {
      list,
      isFetching,
      selectedIds,
      showDelete,
      isEmptySelected,
      isAllSelected,
      evaluationItemQuery,
      totalPages,
      coursesOptions,
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
      getCoursesOptions,
    };
  },
);
