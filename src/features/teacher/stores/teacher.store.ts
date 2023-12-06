import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  RoleType,
} from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import type {
  IBodyResponse,
  ICommonListQuery,
  IGetListResponse,
  IOption,
  IOrderDirection,
} from '@/common/interfaces';
import { userApiService } from '@/features/auth/services/user.api';
import { commonApiService } from '@/features/common/services/common.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { TeacherTab } from '../constants';
import { convertToTeacher, convertToTeacherList } from '../helpers';
import type {
  IDeleteTeacherResponse,
  ITeacherListItem,
  ITeacherProfileData,
} from '../interfaces';
import { teacherApiService } from '../services/teacher.api';

type ITeacherListQuery = ICommonListQuery;

export const useTeacherStore = defineStore('teacher', () => {
  const _isFetching = ref<boolean>(false);
  const _list = ref<ITeacherListItem[]>([]);
  const _total = ref(0);
  const _profile = ref<ITeacherProfileData>();
  const _tab = ref<TeacherTab>(TeacherTab.basic_info);
  const _listQuery = reactive<ITeacherListQuery>({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    keyword: undefined,
    orderDirection: undefined,
    orderBy: undefined,
  });
  const _subjectOptions = ref<IOption[]>([]);
  const _roleOptions = ref<IOption[]>([]);
  const _selectedIds = reactive(new Set<string>());

  // API

  async function getList(queryString = _listQuery) {
    setIsFetching(true);
    let response = await teacherApiService._getList<Record<string, unknown>>(queryString);
    if (!response.success) {
      setIsFetching(false);
      return response;
    }
    setTotal(response.data?.totalItems);
    if (_listQuery.page && _listQuery.page <= totalPages.value) {
      const newList = convertToTeacherList(response.data?.items);
      setList(newList);
      setIsFetching(false);
      return response;
    }
    setPage(totalPages.value);
    response = await teacherApiService._getList(queryString);
    if (response.success) {
      const newList = convertToTeacherList(response.data?.items);
      setList(newList);
      setTotal(response.data?.totalItems);
    }
    setIsFetching(false);
    return response;
  }

  async function getProfile(id: string) {
    setIsFetching(true);
    const response: IBodyResponse<IGetListResponse<ITeacherProfileData>> =
      await teacherApiService._getDetail(id);
    if (response.success) {
      const profile = convertToTeacher(response.data as any);
      setProfile(profile);
    }
    setIsFetching(false);
    return response;
  }
  async function deleteTeacher(
    id: string,
  ): Promise<IBodyResponse<IDeleteTeacherResponse>> {
    const response: IBodyResponse<IDeleteTeacherResponse> =
      await teacherApiService._delete(id);
    return response;
  }

  async function resendEmail(id = profile?.value?.id as string) {
    if (!id) return;
    const response = await userApiService.resendVerifyEmail(id);
    return response;
  }

  function removeSelectedItems() {
    return teacherApiService.bulkDelete(Array.from(_selectedIds));
  }

  function deleteTeacherById(id: string) {
    return teacherApiService.delete(id);
  }

  async function getSubjectOptions() {
    const res = await commonApiService._getSubjectDropdown();
    if (res.success) {
      const options = convertToOptions(res.data);
      setSubjectOptions(options);
    }
    return res;
  }

  async function getRoleOptions() {
    const res = await commonApiService._getRoleDropdown(RoleType.TEACHER);
    if (res.success) {
      const options = convertToOptions(res.data);
      setRoleOptions(options);
    }
    return res;
  }

  // Getter
  const isFetching = computed(() => _isFetching.value);
  const list = computed(() => _list.value);
  const profile = computed(() => _profile.value);
  const listQuery = computed(() => _listQuery);
  const total = computed(() => _total.value);
  const subjectOptions = computed(() => _subjectOptions.value);
  const roleOptions = computed(() => _roleOptions.value);
  const tab = computed(() => _tab.value);
  const selectedIds = computed(() => _selectedIds);
  const isSelectedId = computed(() => (id: string) => _selectedIds.has(id));
  const isEmptySelected = computed(() => _selectedIds.size === 0);
  const isAllSelected = computed(() => _selectedIds.size === list.value.length);
  const totalPages = computed(
    () => Math.ceil(_total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  // Setter
  function setList(list: ITeacherListItem[]) {
    _list.value = list;
  }
  function setIsFetching(isFetching: boolean) {
    _isFetching.value = isFetching;
  }
  function setOrder(orderBy: string, orderDirection: IOrderDirection) {
    _listQuery.orderBy = orderBy;
    _listQuery.orderDirection = orderDirection;
  }
  function setQuery(_query: ITeacherListQuery) {
    const query = { ..._listQuery, ..._query };
    Object.assign(_listQuery, query);
  }
  function setPage(page: number) {
    _listQuery.page = page;
  }
  function setKeyword(keyword?: string) {
    _listQuery.keyword = keyword;
  }
  function setTab(tab: TeacherTab) {
    _tab.value = tab;
  }
  function setTotal(total: number) {
    _total.value = total;
  }
  function toggleSelectedId(id: string) {
    if (_selectedIds.has(id)) {
      _selectedIds.delete(id);
    } else {
      _selectedIds.add(id);
    }
  }
  function unSelectAll() {
    _selectedIds.clear();
  }
  function selectAll() {
    _list.value.forEach((questionSet) => {
      _selectedIds.add(questionSet.id);
    });
  }
  function toggleSelectAll() {
    if (!isEmptySelected.value) {
      unSelectAll();
      return;
    }
    selectAll();
  }
  function setProfile(profile?: ITeacherProfileData) {
    _profile.value = profile;
  }
  function setSubjectOptions(options: IOption[]) {
    _subjectOptions.value = options;
  }
  function setRoleOptions(options: IOption[]) {
    _roleOptions.value = options;
  }

  return {
    // API
    getList,
    getProfile,
    deleteTeacher,
    resendEmail,
    removeSelectedItems,
    deleteTeacherById,
    getSubjectOptions,
    getRoleOptions,
    // Setter
    setList,
    setIsFetching,
    setOrder,
    setQuery,
    setPage,
    setKeyword,
    setTotal,
    setTab,
    toggleSelectedId,
    unSelectAll,
    selectAll,
    toggleSelectAll,
    setProfile,
    setSubjectOptions,
    setRoleOptions,
    // Getter
    isFetching,
    list,
    profile,
    listQuery,
    total,
    subjectOptions,
    roleOptions,
    tab,
    selectedIds,
    isSelectedId,
    isEmptySelected,
    isAllSelected,
    totalPages,
  };
});
