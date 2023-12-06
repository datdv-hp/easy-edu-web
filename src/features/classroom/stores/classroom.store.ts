import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import type {
  IBodyResponse,
  IGetListResponse,
  IOption,
  IOrderDirection,
} from '@/common/interfaces';
import { IClassroomListQuery } from '@/features/classroom/interfaces';
import { commonApiService } from '@/features/common/services/common.api';
import { studentApiService } from '@/features/student/services/student.api';
import { teacherApiService } from '@/features/teacher/services/teacher.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { convertToClassroom, getClassroomDetail, transformClassroom } from '../helpers';
import type { IClassroom } from '../interfaces';
import { classroomApiService } from '../services/classroom.api';

export const useClassroomStore = defineStore('classroom', () => {
  const list = ref<IClassroom[]>([]);
  const detail = ref<IClassroom>();
  const total = ref<number>(0);
  const isFetching = ref<boolean>(false);
  const coursesOptions = ref<IOption[]>([]);
  const studentOptions = ref<IOption[]>([]);
  const teacherOptions = ref<IOption[]>([]);
  const syllabusOptions = ref<IOption[]>([]);
  const tab = ref(null);
  const selectedIds = ref<Record<string, boolean>>({});
  const classroomListQuery: IClassroomListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    keyword: undefined,
    orderDirection: undefined,
    status: undefined,
    courseId: undefined,
    orderBy: undefined,
  });
  const classroomDropDownList = ref<IOption[]>([]);
  function setInputSearch(search: string | undefined) {
    classroomListQuery.keyword = search;
  }
  async function getList(queryString = classroomListQuery) {
    isFetching.value = true;
    let response: IBodyResponse<IGetListResponse<IClassroom>> =
      await classroomApiService._getList(queryString);
    if (!response.success) {
      isFetching.value = false;
      return response;
    }
    total.value = response.data?.totalItems;
    if (classroomListQuery.page && classroomListQuery.page <= totalPages.value) {
      list.value = transformClassroom(response.data?.items);
      isFetching.value = false;
      return response;
    }
    setPage(totalPages.value);
    response = await classroomApiService._getList(queryString);
    if (response.success) {
      list.value = transformClassroom(response.data?.items);
      total.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }

  async function deleteClassroom(id: string): Promise<IBodyResponse<any>> {
    const response: IBodyResponse<any> = await classroomApiService._delete(id);
    return response;
  }

  const setQuery = (_query?: IClassroomListQuery) => {
    if (!_query) return;
    const query = { ...classroomListQuery, ..._query };
    Object.assign(classroomListQuery, { ...query });
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
      classroomListQuery.orderBy = orderByArray.join(',');
      classroomListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      classroomListQuery.orderBy = 'createdAt';
      classroomListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  const setPage = (page: number) => {
    classroomListQuery.page = page;
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

  async function removeSelectedItems() {
    return await classroomApiService.bulkDelete(selectedIdsList.value);
  }

  const isAllSelected = computed(() => {
    return list.value.length && selectedIdsList.value.length === list.value.length;
  });

  function selectAll() {
    list.value.forEach((student) => {
      selectedIds.value[student.id] = true;
    });
  }

  const isEmptySelected = computed(() => {
    return !selectedIdsList.value.length;
  });

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

  async function getClassroomInfo(id: string) {
    isFetching.value = true;
    const response = await classroomApiService.getMoreDetail(id);
    if (response.success) {
      detail.value = convertToClassroom(response.data);
    }
    isFetching.value = false;

    return response;
  }

  async function getBasicClassroomDetail(id: string) {
    isFetching.value = true;
    const response =
      await classroomApiService._getDetail<IBodyResponse<Record<string, unknown>>>(id);
    isFetching.value = false;
    return response;
  }

  async function getCoursesOptions() {
    const res = await commonApiService._getCourseDropdown();
    if (res.success) {
      coursesOptions.value = convertToOptions(res.data, true);
    } else {
      coursesOptions.value = [];
    }
  }

  async function getTeachersOptions() {
    const res = await teacherApiService.getDropDown();
    if (res.success) {
      teacherOptions.value = convertToOptions(res.data, true);
    } else {
      teacherOptions.value = [];
    }
  }

  async function getStudentOptions(courseId: string) {
    const res = await studentApiService.getDropDownByCourse(courseId);
    if (res.success) {
      studentOptions.value = convertToOptions(res.data);
    } else {
      studentOptions.value = [];
    }
  }

  async function getSyllabusOptions() {
    const res = await commonApiService._getSyllabusDropdown();
    if (!res.success) {
      syllabusOptions.value = [];
      return;
    }
    syllabusOptions.value = convertToOptions(res.data, true);
  }

  async function getDropDown() {
    const res = await classroomApiService.getDropDown();
    if (res.success) {
      classroomDropDownList.value = convertToOptions(res.data);
    } else {
      classroomDropDownList.value = [];
    }
  }

  function updateDetail(data: IClassroom) {
    detail.value = getClassroomDetail(data as unknown as Record<string, unknown>);
  }

  return {
    list,
    classroomListQuery,
    total,
    isFetching,
    setInputSearch,
    getList,
    deleteClassroom,
    setOrder,
    setPage,
    totalPages,
    setSelectedIds,
    showDelete,
    selectedIdsList,
    removeSelectedItems,
    isAllSelected,
    isEmptySelected,
    selectAll,
    unSelectAll,
    toggleSelectAll,
    selectedIds,
    getDetail: getClassroomInfo,
    detail,
    tab,
    getStudentOptions,
    getCoursesOptions,
    getTeachersOptions,
    coursesOptions,
    studentOptions,
    teacherOptions,
    classroomDropDownList,
    getDropDown,
    updateDetail,
    setQuery,
    syllabusOptions,
    getSyllabusOptions,
    getBasicClassroomDetail,
  };
});
