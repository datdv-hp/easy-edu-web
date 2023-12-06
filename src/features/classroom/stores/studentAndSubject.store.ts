import { classroomApiService } from '@/features/classroom/services/classroom.api';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { TClassroomListStudent } from '../interfaces';
import { chunk, orderBy } from 'lodash';
import { DEFAULT_LIMIT_FOR_PAGINATION, OrderDirection } from '@/common/constants';

export const useStudentAndSubjectStore = defineStore('student-subject', () => {
  const list = ref<TClassroomListStudent[]>([]);
  const listStudentOnPage = ref<TClassroomListStudent[]>([]);
  const total = ref<number>(0);
  const isFetching = ref<boolean>(false);
  const currPage = ref(1);
  const loading = ref<boolean>(false);

  const getListStudentAndSubject = async (id: number | string) => {
    loading.value = true;
    const res = await classroomApiService.getStudentAndSubject(id);
    if (res.success) {
      const users = orderBy(res.data?.users || [], ['code'], [OrderDirection.DESC]);
      list.value = users;
      listStudentOnPage.value = chunk(users, DEFAULT_LIMIT_FOR_PAGINATION)[
        currPage.value - 1
      ] as TClassroomListStudent[];
      total.value = users.length;
    } else {
      list.value = [];
    }
    loading.value = false;
    return res;
  };

  const setPage = (page: number) => {
    currPage.value = page;
    listStudentOnPage.value = chunk(list.value, DEFAULT_LIMIT_FOR_PAGINATION)[
      currPage.value - 1
    ] as TClassroomListStudent[];
  };
  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  return {
    list,
    total,
    isFetching,
    setPage,
    totalPages,
    currPage,
    getListStudentAndSubject,
    listStudentOnPage,
    loading,
  };
});
