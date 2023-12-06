import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
  RoleType,
} from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import type {
  IBodyResponse,
  IGetListResponse,
  IOption,
  IOrderDirection,
} from '@/common/interfaces';
import { userApiService } from '@/features/auth/services/user.api';
import { commonApiService } from '@/features/common/services/common.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { convertToStudent, transferStudent } from '../helpers';
import type { IStudent, IStudentListQuery, IStudentProfileData } from '../interfaces';
import { studentApiService } from '../services/student.api';

export const useStudentStore = defineStore('student', () => {
  const list = ref<IStudent[]>([]);
  const courses = ref<IOption[]>([]);
  const isFetching = ref<boolean>(false);
  const profile = ref<IStudentProfileData>();
  const subjectOptions = ref<IOption[][]>([[]]);
  const subjects = ref<IOption[]>([]);

  const tab = ref(null);
  const selectedIds = ref<Record<string, boolean>>({});
  const total = ref<number>(0);
  const studentListQuery: IStudentListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    orderBy: 'createdAt',
    orderDirection: OrderDirection.DESC,
  });
  const roleOptions = ref<IOption[]>([]);

  function setInputSearch(search: string | undefined) {
    studentListQuery.keyword = search;
  }

  async function getList() {
    isFetching.value = true;
    let response: IBodyResponse<IGetListResponse<IStudent>> =
      await studentApiService._getList(studentListQuery);
    if (!response.success) {
      isFetching.value = false;
      return response;
    }
    total.value = response.data?.totalItems;
    if (studentListQuery.page && studentListQuery.page <= totalPages.value) {
      selectedIds.value = {};
      list.value = transferStudent(response.data?.items);
      isFetching.value = false;
      return response;
    }
    setPage(totalPages.value);
    response = await studentApiService._getList(studentListQuery);
    if (response.success) {
      selectedIds.value = {};
      list.value = transferStudent(response.data?.items);
      total.value = response.data?.totalItems;
    }
    isFetching.value = false;
    return response;
  }
  async function getProfile(id: string) {
    isFetching.value = true;
    const response: IBodyResponse<IGetListResponse<IStudentProfileData>> =
      await studentApiService._getDetail(id);
    if (response.success) {
      profile.value = convertToStudent(response.data as any);
    }
    isFetching.value = false;
    return response;
  }

  async function resendEmail(id = profile?.value?.id as string) {
    if (!id) return;
    const response = await userApiService.resendVerifyEmail(id);
    return response;
  }

  async function getRoleDropdown() {
    const res = await commonApiService._getRoleDropdown(RoleType.STUDENT);
    if (res.success) {
      roleOptions.value = convertToOptions(res.data);
    }
    return res;
  }

  const setQuery = (_query: IStudentListQuery) => {
    const query = { ...studentListQuery, ..._query };
    Object.assign(studentListQuery, query);
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
      studentListQuery.orderBy = orderByArray.join(',');
      studentListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      studentListQuery.orderBy = 'createdAt';
      studentListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  const setPage = (page: number) => {
    studentListQuery.page = page;
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
    return studentApiService.bulkDelete(selectedIdsList.value);
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

  async function getCourseOptions() {
    const res = await commonApiService._getCourseDropdown();
    if (res.success) {
      courses.value = convertToOptions(res.data, true);
    } else {
      courses.value = [];
    }
  }

  async function getSubjectOptions() {
    const res = await commonApiService._getSubjectDropdown();
    if (res.success) {
      subjects.value = convertToOptions(res.data, true);
    } else {
      subjects.value = [];
    }
  }

  function subjectsByCourse(id?: string) {
    if (!id) return [];
    const course = courses.value.find((course) => course.value === id);
    if (!course) return [];
    return subjects.value.filter(
      (option) => course.other.subjectIds?.includes(option.value as string),
    );
  }

  async function deleteStudent(id: string): Promise<IBodyResponse<any>> {
    const response: IBodyResponse<any> = await studentApiService._delete(id);
    return response;
  }

  function resetDetailPage() {
    tab.value = null;
    profile.value = {} as IStudent;
  }

  return {
    setInputSearch,
    profile,
    courses,
    tab,
    studentListQuery,
    getProfile,
    list,
    total,
    showDelete,
    getList,
    setOrder,
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
    getCourseOptions,
    subjectsByCourse,
    subjectOptions,
    getSubjectOptions,
    deleteStudent,
    resendEmail,
    resetDetailPage,
    setQuery,
    getRoleDropdown,
    roleOptions,
  };
});
