import type {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
} from '@/common/interfaces';
import { defineStore } from 'pinia';
import type { IClassroom } from '../interfaces';
import { computed, reactive, ref } from 'vue';
import { convertToClassroom, transformClassroom } from '../helpers';
import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  Degree,
} from '@/common/constants';
import { useI18n } from 'vue-i18n';
import { classroomApiService } from '../services/classroom.api';

export const useAttendanceStore = defineStore('classroom-attendance', () => {
  const list = ref<IClassroom[]>([]);
  const detail = ref<IClassroom>();
  const total = ref<number>(0);
  const isFetching = ref<boolean>(false);
  const { t } = useI18n();

  const userListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    keyword: '',
  });

  function setInputSearch(search: string) {
    userListQuery.keyword = search;
  }

  async function getList(queryString = userListQuery) {
    isFetching.value = true;
    const response: IBodyResponse<IGetListResponse<IClassroom>> =
      await classroomApiService._getList(queryString);
    if (response.success) {
      list.value = transformClassroom(response.data?.items);
      total.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }

  async function deleteManager(id: string): Promise<IBodyResponse<any>> {
    const response: IBodyResponse<any> = await classroomApiService._delete(id);
    return response;
  }

  const setPage = (page: number) => {
    userListQuery.page = page;
  };

  const educationalBackgroundOptions = computed(() => {
    const options = Object.values(Degree).map((_background) => ({
      title: t(`common.degree.${_background.toLowerCase()}`),
      value: _background,
    }));
    return options;
  });

  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  async function getDetail(id: string) {
    isFetching.value = true;
    const response = await classroomApiService.getMoreDetail(id);
    if (response.success) {
      detail.value = convertToClassroom(response.data);
    }
    isFetching.value = false;
    return response;
  }

  return {
    list,
    userListQuery,
    total,
    isFetching,
    educationalBackgroundOptions,
    setInputSearch,
    getList,
    deleteManager,
    setPage,
    totalPages,
    getDetail,
    detail,
  };
});
