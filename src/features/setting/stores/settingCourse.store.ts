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
import { ICourseType } from '../interfaces/setting-course.interfaces';
import { IEvaluationType } from '../interfaces/setting-evaluation.interfaces';
import { convertToCourseTypeFormData } from '../helpers/setting-course.helpers';
import { settingCourseApiService } from '../services/settingCourse.api';

export const useSettingCourseStore = defineStore('setting-course', () => {
  const list = ref<IEvaluationType[]>([]);
  const isFetching = ref<boolean>(false);
  const selectedIds = ref<string[]>([]);
  const total = ref<number>(0);
  const courseTypeListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderBy: CourseOrderBy.CREATED_AT,
    orderDirection: OrderDirection.DESC,
  });

  function setInputSearch(search: string | undefined) {
    courseTypeListQuery.keyword = search;
  }

  async function getList() {
    isFetching.value = true;
    const response: IBodyResponse<IGetListResponse<ICourseType>> =
      await settingCourseApiService.getAllCourseType(courseTypeListQuery);
    if (!response.success) {
      isFetching.value = false;
      return response;
    }
    total.value = response.data?.totalItems;
    list.value = convertToCourseTypeFormData(response.data?.items as any[]);
    isFetching.value = false;
    return response;
  }

  const setQuery = (_query: ICommonListQuery) => {
    const query = { ...courseTypeListQuery, ..._query };
    Object.assign(courseTypeListQuery, query);
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
      courseTypeListQuery.orderBy = orderByArray.join(',');
      courseTypeListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      courseTypeListQuery.orderBy = CourseOrderBy.CREATED_AT;
      courseTypeListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  const setPage = (page: number) => {
    courseTypeListQuery.page = page;
  };

  const showDelete = computed(() => {
    return selectedIds.value.length > 0;
  });

  function removeSelectedItems() {
    return settingCourseApiService.bulkDelete(selectedIds.value);
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
    courseTypeListQuery,
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
