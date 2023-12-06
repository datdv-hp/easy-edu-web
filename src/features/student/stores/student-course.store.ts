import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
  IOrderDirection,
} from '@/common/interfaces';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { studentApiService } from '../services/student.api';
import { IStudentCourse } from '../interfaces';
import { mapStudentCourseList } from '../helpers';

export const useStudentCourse = defineStore('student-course', () => {
  const isFetching = ref<boolean>(false);
  const studentCourseList = ref<IStudentCourse[]>([]);
  const totalCourses = ref<number>(0);
  const studentCourseListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
  });
  async function getStudentCourseList(id: string, queryString = studentCourseListQuery) {
    isFetching.value = true;
    const response: IBodyResponse<IGetListResponse<IStudentCourse>> =
      await studentApiService.getCourseListByStudentId(id, queryString);
    if (response.success) {
      studentCourseList.value = mapStudentCourseList(response.data?.items);
      totalCourses.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }

  const totalPages = computed(() =>
    Math.ceil(totalCourses.value / DEFAULT_LIMIT_FOR_PAGINATION),
  );

  function setPage(page: number) {
    studentCourseListQuery.page = page;
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
      studentCourseListQuery.orderBy = orderByArray.join(',');
      studentCourseListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      studentCourseListQuery.orderBy = 'createdAt';
      studentCourseListQuery.orderDirection = OrderDirection.DESC;
    }
  };
  return {
    isFetching,
    totalPages,
    studentCourseList,
    studentCourseListQuery,
    totalCourses,
    setPage,
    setOrder,
    getStudentCourseList,
  };
});
