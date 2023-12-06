import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import { ICommonListQuery } from '@/common/interfaces';
import { classroomApiService } from '@/features/classroom/services';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import {
  convertToSyllabusDetail,
  convertToSyllabusLectureList,
  convertToUpdateHistoryList,
} from '../helpers';
import {
  ISyllabusDetail,
  ISyllabusEditHistory,
  ISyllabusLectureListItem,
} from '../interfaces';
import { lectureApiService, syllabusApiService } from '../services';

export const useSyllabusDetail = defineStore('syllabus-detail', () => {
  const detail = ref<ISyllabusDetail>();
  const lectureList = ref<ISyllabusLectureListItem[]>([]);
  const isFetching = reactive({
    info: false,
    lectureList: false,
    updateHistories: false,
  });
  const totalLectures = ref(0);
  const selectedLectureIds = ref<Record<string, boolean>>({});
  const lectureListQuery = reactive<ICommonListQuery>({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderDirection: OrderDirection.DESC,
    orderBy: 'createdAt',
  });
  const historyList = ref<ISyllabusEditHistory[]>([]);
  const totalHistoryRecords = ref(0);
  const historyListQuery = reactive<ICommonListQuery>({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderDirection: OrderDirection.DESC,
    orderBy: 'createdAt',
  });

  async function getBasicInfo(id: string) {
    setIsFetching('info', true);
    const res = await syllabusApiService.getDetail(id);
    if (res.success) {
      detail.value = convertToSyllabusDetail(res.data);
    }
    setIsFetching('info', false);
    return res;
  }

  async function getLectureList(syllabusId: string, query = lectureListQuery) {
    setIsFetching('lectureList', true);
    let res = await syllabusApiService.getLectureList(syllabusId, query);
    if (!res.success) {
      setIsFetching('lectureList', false);
      return res;
    }
    totalLectures.value = res.data.totalItems;
    if (query.page && query.page <= totalLecturePages.value) {
      lectureList.value = convertToSyllabusLectureList(
        res.data.items as Record<string, unknown>[],
      );
      setIsFetching('lectureList', false);
      return res;
    }
    setLecturePage(totalLecturePages.value);
    res = await syllabusApiService.getLectureList(syllabusId, query);
    if (res.success) {
      lectureList.value = convertToSyllabusLectureList(
        res.data.items as Record<string, unknown>[],
      );
      totalLectures.value = res.data.totalItems;
    }
    setIsFetching('lectureList', false);
    return res;
  }

  async function deleteSyllabus(id: string) {
    const res = await syllabusApiService.delete(id);
    return res;
  }

  async function updateSyllabus(id: string, params: Record<string, unknown>) {
    const res = await syllabusApiService.update(id, params);
    return res;
  }

  async function checkAssignedSyllabus(id: string) {
    return await classroomApiService.checkSyllabuses([id]);
  }

  async function updateLectures(syllabusId: string, params: Record<string, unknown>) {
    const res = await lectureApiService.update(syllabusId, params);
    return res;
  }
  async function createLectures(syllabusId: string, params: Record<string, unknown>) {
    const res = await lectureApiService.create(syllabusId, params);
    return res;
  }
  async function deleteLectures(lectureIds: string[]) {
    const res = await lectureApiService.bulkDelete(lectureIds);
    return res;
  }

  async function getUpdateHistoryList(syllabusId: string, query = historyListQuery) {
    setIsFetching('updateHistories', true);
    let res = await syllabusApiService.getUpdateHistoryList(syllabusId, query);
    if (!res.success) {
      setIsFetching('updateHistories', false);
      return res;
    }
    totalHistoryRecords.value = res.data.totalItems;
    if (query.page && query.page <= totalHistoryPages.value) {
      historyList.value = convertToUpdateHistoryList(
        res.data.items as Record<string, unknown>[],
      );
      setIsFetching('updateHistories', false);
      return res;
    }
    setHistoryPage(totalHistoryPages.value);
    res = await syllabusApiService.getUpdateHistoryList(syllabusId, query);
    if (res.success) {
      historyList.value = convertToUpdateHistoryList(
        res.data.items as Record<string, unknown>[],
      );
      totalHistoryRecords.value = res.data.totalItems;
    }
    setIsFetching('updateHistories', false);
    return res;
  }

  // Getters
  const totalLecturePages = computed(
    () => Math.ceil(totalLectures.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  const totalHistoryPages = computed(
    () => Math.ceil(totalHistoryRecords.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  const selectedLectureIdList = computed(() => {
    return Object.keys(selectedLectureIds.value).filter(
      (id) => selectedLectureIds.value[id],
    );
  });
  const isEmptyLectureSelected = computed(() => {
    return !selectedLectureIdList.value.length;
  });

  const isAllLecturesSelected = computed(() => {
    return (
      lectureList.value.length &&
      selectedLectureIdList.value.length === lectureList.value.length
    );
  });
  const isShowLectureActions = computed(() => selectedLectureIdList.value.length > 0);

  // Getters end

  // Setters
  function setLectureQuery(_query: ICommonListQuery) {
    const query = { ...lectureListQuery, ..._query };
    Object.assign(lectureListQuery, query);
  }

  function setLecturePage(page: number) {
    lectureListQuery.page = page;
  }

  function setHistoryPage(page: number) {
    historyListQuery.page = page;
  }

  function setSelectLectureId(id: string) {
    selectedLectureIds.value[id] = !selectedLectureIds.value[id];
  }

  function selectAllLectures() {
    lectureList.value.forEach((syllabus) => {
      selectedLectureIds.value[syllabus.id] = true;
    });
  }

  function unSelectAllLectures() {
    selectedLectureIds.value = {};
  }

  function toggleSelectAllLectures() {
    if (isEmptyLectureSelected.value) {
      selectAllLectures();
      return;
    }
    unSelectAllLectures();
  }

  function resetDetail() {
    detail.value = undefined;
    lectureList.value = [];
    historyList.value = [];
  }

  function setIsFetching(
    content: 'info' | 'lectureList' | 'updateHistories',
    value: boolean,
  ) {
    isFetching[content] = value;
  }
  // Setters end

  return {
    lectureList,
    detail,
    getBasicInfo,
    resetDetail,
    getLectureList,
    isFetching,
    setIsFetching,
    totalLectures,
    totalLecturePages,
    lectureListQuery,
    setLectureQuery,
    setLecturePage,
    selectedLectureIds,
    isShowLectureActions,
    isEmptyLectureSelected,
    isAllLecturesSelected,
    selectedLectureIdList,
    setSelectLectureId,
    toggleSelectAllLectures,
    unSelectAllLectures,
    selectAllLectures,
    historyList,
    historyListQuery,
    getUpdateHistoryList,
    totalHistoryRecords,
    setHistoryPage,
    totalHistoryPages,
    updateLectures,
    createLectures,
    deleteLectures,
    deleteSyllabus,
    checkAssignedSyllabus,
    updateSyllabus,
  };
});
