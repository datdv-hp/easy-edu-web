import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import type {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
  IOrderDirection,
} from '@/common/interfaces';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { CourseOrderBy } from '../contants';
import { convertToCourseList } from '../helpers';
import type { ICourseListItem } from '../interfaces';
import { courseApiService } from '../services/courses.api';

type ICourseListQuery = ICommonListQuery & {
  courseFormIds?: string[];
};

export const useCoursesStore = defineStore('courses', () => {
  const list = ref<ICourseListItem[]>([]);
  const isFetching = ref<boolean>(false);
  const selectedIds = ref<Record<string, boolean>>({});
  const total = ref<number>(0);
  const courseListQuery: ICourseListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    courseFormIds: undefined,
    orderBy: CourseOrderBy.CREATED_AT,
    orderDirection: OrderDirection.DESC,
  });

  function setInputSearch(search: string | undefined) {
    courseListQuery.keyword = search;
  }

  async function getList() {
    isFetching.value = true;
    let response: IBodyResponse<IGetListResponse<Record<string, unknown>>> =
      await courseApiService._getList(courseListQuery);
    if (!response.success) {
      isFetching.value = false;
      return response;
    }
    total.value = response.data?.totalItems;
    if (courseListQuery.page && courseListQuery.page <= totalPages.value) {
      selectedIds.value = {};
      list.value = convertToCourseList(response.data?.items);
      isFetching.value = false;
      return response;
    }
    setPage(totalPages.value);
    response = await courseApiService._getList(courseListQuery);
    if (response.success) {
      selectedIds.value = {};
      list.value = convertToCourseList(response.data?.items);
      total.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }

  const setQuery = (_query: ICourseListQuery) => {
    const query = { ...courseListQuery, ..._query };
    Object.assign(courseListQuery, query);
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
      courseListQuery.orderBy = orderByArray.join(',');
      courseListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      courseListQuery.orderBy = CourseOrderBy.CREATED_AT;
      courseListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  const setPage = (page: number) => {
    courseListQuery.page = page;
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
    return courseApiService.bulkDelete(selectedIdsList.value);
  }

  const isEmptySelected = computed(() => {
    return !selectedIdsList.value.length;
  });

  const isAllSelected = computed(() => {
    return list.value.length && selectedIdsList.value.length === list.value.length;
  });

  function selectAll() {
    list.value.forEach((student) => {
      selectedIds.value[student.id] = true;
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

  return {
    setInputSearch,
    list,
    total,
    courseListQuery,
    showDelete,
    setOrder,
    getList,
    setPage,
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
    setQuery,
  };
});
