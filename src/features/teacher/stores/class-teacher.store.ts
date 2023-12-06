import type {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
  IOrderDirection,
} from '@/common/interfaces';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { transfromClassListByTeacher } from '../helpers';
import type { ITeacherClass } from '../interfaces';
import { teacherApiService } from '../services/teacher.api';
import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import { reactive } from 'vue';
import { computed } from 'vue';

export const useClassByTeacherStore = defineStore('class-teacher', () => {
  const classListByTeacher = ref<ITeacherClass[]>([]);
  const totalClasses = ref<number>(0);
  const classByTeacherListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
  });
  const isFetching = ref<boolean>(false);

  async function getClassListByTeacher(
    id: string,
    queryString = classByTeacherListQuery,
  ) {
    isFetching.value = true;
    const response: IBodyResponse<IGetListResponse<ITeacherClass>> =
      await teacherApiService.getClassListByTeacherId(id, queryString);
    if (response.success) {
      classListByTeacher.value = transfromClassListByTeacher(response.data?.items);
      totalClasses.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }

  const totalPages = computed(() =>
    Math.ceil(totalClasses.value / DEFAULT_LIMIT_FOR_PAGINATION),
  );

  function setPage(page: number) {
    classByTeacherListQuery.page = page;
  }
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
      classByTeacherListQuery.orderBy = orderByArray.join(',');
      classByTeacherListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      classByTeacherListQuery.orderBy = 'createdAt';
      classByTeacherListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  return {
    classListByTeacher,
    totalClasses,
    classByTeacherListQuery,
    isFetching,
    totalPages,
    getClassListByTeacher,
    setPage,
    setOrder,
  };
});
