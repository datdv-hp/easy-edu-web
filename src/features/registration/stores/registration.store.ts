import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import type { ICommonListQuery, IOrderDirection } from '@/common/interfaces';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { convertToRegistrationList } from '../helpers';
import { IRegistrationListItem } from '../interfaces';
import { RegistrationApi } from '../services';
import { RegistrationStatus } from '../constants';

type IRegisterListQuery = ICommonListQuery & { statuses?: RegistrationStatus[] };

export const useRegistrationStore = defineStore('registration', () => {
  const _isFetching = ref<boolean>(false);
  const _list = ref<IRegistrationListItem[]>([]);
  const _total = ref(0);
  const _listQuery = reactive<IRegisterListQuery>({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    keyword: undefined,
    orderDirection: undefined,
    orderBy: undefined,
  });
  const _selectedIds = reactive(new Set<string>());

  // API

  async function getList(queryString = _listQuery) {
    setIsFetching(true);
    let response = await RegistrationApi._getList<Record<string, unknown>>(queryString);
    if (!response.success) {
      setIsFetching(false);
      return response;
    }
    setTotal(response.data?.totalItems);
    if (_listQuery.page && _listQuery.page <= totalPages.value) {
      const newList = convertToRegistrationList(response.data?.items);
      setList(newList);
      setIsFetching(false);
      return response;
    }
    setPage(totalPages.value);
    response = await RegistrationApi._getList(queryString);
    if (response.success) {
      const newList = convertToRegistrationList(response.data?.items);
      setList(newList);
      setTotal(response.data?.totalItems);
    }
    setIsFetching(false);
    return response;
  }

  // Getter
  const isFetching = computed(() => _isFetching.value);
  const list = computed(() => _list.value);
  const listQuery = computed(() => _listQuery);
  const total = computed(() => _total.value);
  const selectedIds = computed(() => _selectedIds);
  const isSelectedId = computed(() => (id: string) => _selectedIds.has(id));
  const isEmptySelected = computed(() => _selectedIds.size === 0);
  const isAllSelected = computed(() => _selectedIds.size === list.value.length);
  const totalPages = computed(
    () => Math.ceil(_total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  // Setter
  function setList(list: IRegistrationListItem[]) {
    _list.value = list;
  }
  function setIsFetching(isFetching: boolean) {
    _isFetching.value = isFetching;
  }
  function setOrder(orderBy: string, orderDirection: IOrderDirection) {
    _listQuery.orderBy = orderBy;
    _listQuery.orderDirection = orderDirection;
  }
  function setQuery(_query: IRegisterListQuery) {
    const query = { ..._listQuery, ..._query };
    Object.assign(_listQuery, query);
  }
  function setPage(page: number) {
    _listQuery.page = page;
  }
  function setKeyword(keyword?: string) {
    _listQuery.keyword = keyword;
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

  return {
    // API
    getList,
    // Setter
    setList,
    setIsFetching,
    setOrder,
    setQuery,
    setPage,
    setKeyword,
    setTotal,
    toggleSelectedId,
    unSelectAll,
    selectAll,
    toggleSelectAll,
    // Getter
    isFetching,
    list,
    listQuery,
    total,
    selectedIds,
    isSelectedId,
    isEmptySelected,
    isAllSelected,
    totalPages,
  };
});
