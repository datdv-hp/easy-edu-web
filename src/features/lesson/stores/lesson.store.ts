import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderByDefault,
  OrderDirection,
} from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import type {
  IBodyResponse,
  IGetListResponse,
  IOption,
  IOrderDirection,
} from '@/common/interfaces';
import { classroomApiService } from '@/features/classroom/services/classroom.api';
import { commonApiService } from '@/features/common/services/common.api';
import { courseApiService } from '@/features/courses/services/courses.api';
import { studentApiService } from '@/features/student/services/student.api';
import { teacherApiService } from '@/features/teacher/services/teacher.api';
import { compact, uniq } from 'lodash';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { LessonStatus } from '../constants';
import {
  checkActiveDateTime,
  convertToLesson,
  convertToLessonInfo,
  transformLesson,
} from '../helpers';
import type {
  ILessonDetail,
  ILessonInfo,
  ILessonListQuery,
  ILessonPreviewTime,
  IListLessonItem,
} from '../interfaces';
import { lessonApiService } from '../lesson.api';
import { useLessonDialog } from './lesson-dialog.store';

export const useLessonStore = defineStore('lesson', () => {
  const dialogStore = useLessonDialog();
  const list = ref<IListLessonItem[]>([]);
  const detail = ref<ILessonDetail>();
  // info
  const lessonInfo = ref<ILessonInfo>();
  //
  const total = ref<number>(0);
  const isFetching = ref<boolean>(false);
  const tab = ref(null);
  const selectedIds = ref<Record<string, boolean>>({});
  const coursesOptions = ref<IOption[]>([]);
  const classroomOptions = ref<IOption[]>([]);
  const subjectOptions = ref<IOption[]>([]);
  const teacherOptions = ref<IOption[]>([]);
  const studentOptions = ref<IOption[]>([]);
  const syllabusOptions = ref<IOption[]>([]);
  const lectureOptions = ref<IOption[]>([]);
  const selectedClassroomId = ref<string | undefined>(undefined);
  const selectedSubjectId = ref<string | undefined>(undefined);
  const createdLessons = ref<number>(0);
  const totalLessons = ref<number>(0);
  const previewTimes = ref<ILessonPreviewTime[]>([]);
  const errorPreviewTimeIndexes = ref<number[]>([]);
  const removedPreviewTimeIndexes = ref<number[]>([]);
  const lessonName = ref<string>();

  const lessonListQuery = ref({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    keyword: '',
    orderDirection: OrderDirection.DESC,
    orderBy: OrderByDefault.CREATED_AT,
  } as ILessonListQuery);
  function setInputSearch(search: string | undefined) {
    lessonListQuery.value.keyword = search;
  }
  async function getList(queryString = lessonListQuery.value) {
    isFetching.value = true;
    let response: IBodyResponse<IGetListResponse<ILessonDetail>> =
      await lessonApiService.getList(queryString);
    if (!response.success) {
      isFetching.value = false;
      return response;
    }
    total.value = response.data?.totalItems;
    if (lessonListQuery.value.page && lessonListQuery.value.page <= totalPages.value) {
      list.value = transformLesson(response.data?.items);
      selectedIds.value = {};
      isFetching.value = false;
      return response;
    }
    setPage(totalPages.value);
    response = await lessonApiService.getList(queryString);
    if (response.success) {
      selectedIds.value = {};
      list.value = transformLesson(response.data?.items);
      total.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }

  async function getDetailInfo(id: string) {
    isFetching.value = true;
    const response: IBodyResponse<Record<string, unknown>> =
      await lessonApiService.detailInfo(id);
    if (response.success) {
      lessonInfo.value = convertToLessonInfo(response.data);
    }
    isFetching.value = false;
    return response;
  }

  async function update(id: string, params: Record<string, unknown>) {
    const response = await lessonApiService.update(id, params);
    if (response.success) {
      lessonInfo.value = convertToLessonInfo(response.data);
    }
    return response;
  }

  async function deleteLesson(id: string): Promise<IBodyResponse<any>> {
    const response: IBodyResponse<any> = await lessonApiService._delete(id);
    return response;
  }
  const setQuery = (query?: ILessonListQuery) => {
    if (!query) return;
    lessonListQuery.value = { ...lessonListQuery.value, ...query };
  };

  const setCourseIdQuery = (courseIds?: string[]) => {
    lessonListQuery.value.courseIds = courseIds;
  };

  const setLessonStatusQuery = (lessonStatus?: LessonStatus[]) => {
    lessonListQuery.value.statuses = lessonStatus;
  };

  const setClassroomIdQuery = (classroomIds?: string[]) => {
    lessonListQuery.value.classroomIds = classroomIds;
  };

  const setPage = (page: number) => {
    lessonListQuery.value.page = page;
  };

  const setKeyword = (keyword?: string) => {
    lessonListQuery.value.keyword = keyword;
  };

  const setOrder = (order: Record<string, IOrderDirection>) => {
    const orderBy = Object.keys(order)?.[0];
    if (orderBy && order[orderBy]) {
      lessonListQuery.value.orderBy = orderBy;
      lessonListQuery.value.orderDirection = order[orderBy];
    } else {
      lessonListQuery.value.orderBy = 'createdAt';
      lessonListQuery.value.orderDirection = OrderDirection.DESC;
    }
  };

  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

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
    return lessonApiService.bulkDelete(selectedIdsList.value);
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

  async function getDetail(id: string) {
    isFetching.value = true;
    const response: IBodyResponse<Record<string, unknown>> =
      await lessonApiService._getDetail(id);
    if (response.success) {
      detail.value = convertToLesson(response.data);
    }
    isFetching.value = false;
    return response;
  }

  async function getCoursesOptions() {
    const res = await courseApiService.getDropDown();
    if (res.success) {
      coursesOptions.value = convertToOptions(res.data);
    } else {
      coursesOptions.value = [];
    }
  }

  async function getClassroomOptions() {
    const res = await classroomApiService.getDropDown();
    if (res.success) {
      classroomOptions.value = convertToOptions(res.data, true);
    } else {
      classroomOptions.value = [];
    }
  }

  async function getSubjectOptions() {
    const res = await commonApiService._getSubjectDropdown({
      classroomId: selectedClassroomId.value,
    });
    if (res.success) {
      subjectOptions.value = convertToOptions(res.data, true);
    } else {
      subjectOptions.value = [];
    }
  }

  async function getStudentOptions(classroomId = selectedClassroomId.value) {
    if (!classroomId) return;
    const res = await studentApiService.getDropDownByClassroom(classroomId);
    if (res.success) {
      studentOptions.value = convertToOptions(res.data, true);
    } else {
      studentOptions.value = [];
    }
    return res;
  }

  async function getTeacherOptions() {
    const res = await teacherApiService.getDropDown();
    if (res.success) {
      teacherOptions.value = convertToOptions(res.data, true);
    } else {
      teacherOptions.value = [];
    }
  }

  async function getSyllabusOptions(classroomId = selectedClassroomId.value) {
    if (!classroomId) return;
    const res = await commonApiService.getSyllabusDropdownByClassroomId(classroomId);
    if (res.success) {
      syllabusOptions.value = convertToOptions(res.data);
    } else {
      syllabusOptions.value = [];
    }
  }

  async function getLectureOptions(syllabusId: string) {
    if (!syllabusId) return;
    const res = await commonApiService.getLectureDropdownBySyllabusId(syllabusId);
    if (res.success) {
      lectureOptions.value = convertToOptions(res.data);
    } else {
      lectureOptions.value = [];
    }
  }

  function setSelectedClassroomId(id?: string) {
    selectedClassroomId.value = id;
  }

  function setSelectedSubjectId(id?: string) {
    selectedSubjectId.value = id;
  }

  function resetSelected() {
    selectedClassroomId.value = undefined;
    selectedSubjectId.value = undefined;
  }

  function setCreatedLessons(number: number) {
    createdLessons.value = number;
  }

  function setTotalLessons(number: number) {
    totalLessons.value = number;
  }

  const isAbleToUpdate = computed(() => {
    if (!dialogStore.currentId) return true;
    if (detail.value?.date && detail.value?.startTime) {
      return checkActiveDateTime(detail.value.date, detail.value.startTime);
    }
    return false;
  });

  const studentOptionsObj = computed(() => {
    return Object.fromEntries(
      studentOptions.value.map((option) => [option.value, option.title]),
    );
  });

  function resetDetailPage() {
    lessonInfo.value = undefined;
  }

  function setErrorOverlapPreviewTimes(
    errorItems: ILessonPreviewTime[],
    errorMessage: string,
  ) {
    const indexes = errorItems.map((item) => item.index);
    errorPreviewTimeIndexes.value = uniq(compact(indexes));
    // set error message
    previewTimes.value?.forEach((item) => {
      item.error = indexes?.includes(item.index || 0) ? errorMessage : undefined;
    });
  }

  function removedPreviewTime(index: number) {
    if (removedPreviewTimeIndexes.value?.includes(index)) {
      removedPreviewTimeIndexes.value = removedPreviewTimeIndexes.value.filter(
        (removedIndex) => removedIndex !== index,
      );
    } else {
      removedPreviewTimeIndexes.value.push(index);
    }
  }

  function resetRemovedPreviewTimeIndexes() {
    previewTimes.value = [];
    errorPreviewTimeIndexes.value = [];
    removedPreviewTimeIndexes.value = [];
  }

  function getPreviewTimesToSubmit() {
    return previewTimes.value.filter(
      (_, index) => !removedPreviewTimeIndexes.value.includes(index),
    );
  }
  return {
    list,
    lessonListQuery,
    total,
    isFetching,
    setInputSearch,
    getList,
    update,
    deleteLesson,
    setCourseIdQuery,
    setClassroomIdQuery,
    setLessonStatusQuery,
    setPage,
    setQuery,
    setKeyword,
    setOrder,
    totalPages,
    setSelectedIds,
    showDelete,
    selectedIdsList,
    removeSelectedItems,
    isEmptySelected,
    isAllSelected,
    selectAll,
    unSelectAll,
    toggleSelectAll,
    selectedIds,
    getDetail,
    getDetailInfo,
    detail,
    lessonInfo,
    tab,
    getTeacherOptions,
    getCoursesOptions,
    getClassroomOptions,
    getSubjectOptions,
    getStudentOptions,
    getSyllabusOptions,
    getLectureOptions,
    lectureOptions,
    syllabusOptions,
    studentOptions,
    coursesOptions,
    classroomOptions,
    subjectOptions,
    teacherOptions,
    setSelectedClassroomId,
    setSelectedSubjectId,
    resetSelected,
    selectedClassroomId,
    selectedSubjectId,
    isAbleToUpdate,
    createdLessons,
    totalLessons,
    setCreatedLessons,
    setTotalLessons,
    studentOptionsObj,
    previewTimes,
    errorPreviewTimeIndexes,
    removedPreviewTimeIndexes,
    resetRemovedPreviewTimeIndexes,
    getPreviewTimesToSubmit,
    removedPreviewTime,
    resetDetailPage,
    lessonName,
    setErrorOverlapPreviewTimes,
  };
});
