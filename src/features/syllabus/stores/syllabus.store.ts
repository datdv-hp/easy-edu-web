import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import { ICommonListQuery, IOption, ITableSorter } from '@/common/interfaces';
import { classroomApiService } from '@/features/classroom/services';
import { commonApiService } from '@/features/common/services/common.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { convertToSyllabusList } from '../helpers';
import { ISyllabusListItem } from '../interfaces';
import { syllabusApiService } from '../services/syllabus.api';

export const useSyllabusStore = defineStore('syllabus-store', () => {
  const list = ref<ISyllabusListItem[]>([]);
  const isFetching = ref<boolean>(false);
  const selectedIds = ref<Record<string, boolean>>({});
  const total = ref<number>(0);
  const layout = ref<'table' | 'grid'>('grid');
  const syllabusListQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderBy: undefined,
    orderDirection: OrderDirection.DESC,
  });
  const subjectOptions = ref<IOption[]>([]);

  const lectureErrorIndexes = ref<number[]>([]);

  // API
  async function getList(queryParams = syllabusListQuery) {
    isFetching.value = true;
    let res = await syllabusApiService._getList<Record<string, unknown>>(queryParams);
    if (!res.success) {
      isFetching.value = false;
      return res;
    }
    total.value = res.data?.totalItems;
    if (syllabusListQuery.page && syllabusListQuery.page <= totalPages.value) {
      selectedIds.value = {};
      list.value = convertToSyllabusList(res.data?.items);
      isFetching.value = false;
      return res;
    }
    setPage(totalPages.value);
    res = await syllabusApiService._getList<Record<string, unknown>>(queryParams);
    if (res.success) {
      total.value = res.data.totalItems;
      list.value = convertToSyllabusList(res.data.items);
    }
    isFetching.value = false;
    return res;
  }

  async function create(params: Record<string, unknown>) {
    const res = await syllabusApiService.create(params);
    return res;
  }

  async function getSubjectDropdown() {
    const res = await commonApiService._getSubjectDropdown();
    if (res.success) {
      subjectOptions.value = convertToOptions(res.data);
    }
    return res;
  }

  async function removeSelectedItems() {
    return await syllabusApiService.bulkDelete(selectedIdsList.value);
  }

  async function checkAssignedSyllabusesToClassroom() {
    return await classroomApiService.checkSyllabuses(selectedIdsList.value);
  }

  // API end

  // Getters
  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  const showDelete = computed(() => {
    return selectedIdsList.value.length > 0;
  });

  const selectedIdsList = computed(() => {
    return Object.keys(selectedIds.value).filter((id) => selectedIds.value[id]);
  });

  const isEmptySelected = computed(() => {
    return !selectedIdsList.value.length;
  });

  const isAllSelected = computed(() => {
    return list.value.length && selectedIdsList.value.length === list.value.length;
  });

  const isTableLayout = computed(() => layout.value === 'table');
  // Getters end

  // Setter
  const setQuery = (_query: ICommonListQuery) => {
    const query = { ...syllabusListQuery, ..._query };
    Object.assign(syllabusListQuery, query);
  };

  const setPage = (page: number) => {
    syllabusListQuery.page = page;
  };

  const setOrder = (params: ITableSorter) => {
    const orderBy = params.field;
    const orderDirection = params.direction;
    if (orderBy && orderDirection) {
      setQuery({ orderBy, orderDirection });
    } else {
      syllabusListQuery.orderBy = undefined;
      syllabusListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  function setKeyword(keyword?: string) {
    syllabusListQuery.keyword = keyword;
  }

  function setIsFetching(value: boolean) {
    isFetching.value = value;
  }

  function setSelectedIds(id: string) {
    selectedIds.value[id] = !selectedIds.value[id];
  }

  function selectAll() {
    list.value.forEach((syllabus) => {
      selectedIds.value[syllabus.id] = true;
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

  function toggleLayout() {
    layout.value = layout.value === 'grid' ? 'table' : 'grid';
  }

  function setLectureErrorIndexes(errorIndexes: number[]) {
    lectureErrorIndexes.value = errorIndexes;
  }

  // Setter end
  return {
    list,
    isFetching,
    selectedIds,
    syllabusListQuery,
    total,
    getList,
    create,
    totalPages,
    selectedIdsList,
    isEmptySelected,
    isAllSelected,
    showDelete,
    setIsFetching,
    setQuery,
    setPage,
    setKeyword,
    setSelectedIds,
    selectAll,
    unSelectAll,
    toggleSelectAll,
    layout,
    toggleLayout,
    getSubjectDropdown,
    subjectOptions,
    setOrder,
    isTableLayout,
    removeSelectedItems,
    checkAssignedSyllabusesToClassroom,
    lectureErrorIndexes,
    setLectureErrorIndexes,
  };
});
