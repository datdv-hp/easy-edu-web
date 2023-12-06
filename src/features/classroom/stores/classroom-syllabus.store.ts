import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderByDefault,
  OrderDirection,
} from '@/common/constants';
import { ICommonListQuery } from '@/common/interfaces';
import { ISyllabusListItem } from '@/features/syllabus/interfaces';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import { classroomApiService } from '../services';
import { convertToSyllabusList } from '@/features/syllabus/helpers';

export const useClassroomSyllabusStore = defineStore('classroom-syllabus', () => {
  const list = ref<ISyllabusListItem[]>([]);
  const total = ref<number>(0);
  const isFetching = ref<boolean>(false);
  const layout = ref<'table' | 'grid'>('grid');
  const classroomSyllabusListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderDirection: OrderDirection.DESC,
    orderBy: OrderByDefault.CREATED_AT,
  });

  // API
  async function getSyllabusList(classroomId: string) {
    isFetching.value = true;
    let res = await classroomApiService.getClassroomSyllabusList(
      classroomId,
      classroomSyllabusListQuery,
    );
    if (!res.success) {
      isFetching.value = false;
      return res;
    }
    total.value = res.data.totalItems;
    if (
      classroomSyllabusListQuery.page &&
      classroomSyllabusListQuery.page <= totalPages.value
    ) {
      list.value = convertToSyllabusList(res.data.items);
      isFetching.value = false;
      return res;
    }
    setPage(totalPages.value);
    res = await classroomApiService.getClassroomSyllabusList(
      classroomId,
      classroomSyllabusListQuery,
    );
    if (res.success) {
      total.value = res.data.totalItems;
      list.value = convertToSyllabusList(res.data.items);
    }
    isFetching.value = false;
    return res;
  }
  // API end

  function setKeyword(keyword: string) {
    classroomSyllabusListQuery.keyword = keyword;
  }

  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  const isTableLayout = computed(() => layout.value === 'table');
  function setPage(page: number) {
    classroomSyllabusListQuery.page = page;
  }

  function toggleLayout() {
    layout.value = layout.value === 'grid' ? 'table' : 'grid';
  }

  return {
    list,
    total,
    isFetching,
    classroomSyllabusListQuery,
    totalPages,
    setPage,
    getSyllabusList,
    layout,
    toggleLayout,
    isTableLayout,
    setKeyword,
  };
});
