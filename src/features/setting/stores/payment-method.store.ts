import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import { IBodyResponse, IOption, IOrderDirection } from '@/common/interfaces';
import { commonApiService } from '@/features/common/services/common.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import {
    convertToPaymentMethodDetail,
    convertToPaymentMethodList,
} from '../helpers/payment-method.helpers';
import {
    IPaymentMethodDetail,
    IPaymentMethodListItem,
    IPaymentMethodListQuery,
} from '../interfaces/payment-method.interfaces';
import { paymentMethodService } from '../services';

export const usePaymentMethodStore = defineStore('payment-method', () => {
    const _list = ref<IPaymentMethodListItem[]>([]);
    const _total = ref(0);
    const _detail = ref<IPaymentMethodDetail>();
    const _isFetching = ref(false);
    const _selectedIds = reactive(new Set<string>());
    const _listQuery = ref<IPaymentMethodListQuery>({
        page: DEFAULT_FIRST_PAGE,
        limit: DEFAULT_LIMIT_FOR_PAGINATION,
        keyword: undefined,
        orderDirection: undefined,
        orderBy: undefined,
    });
    const _courseOptions = ref<IOption[]>([]);

    // API
    async function getList(query = _listQuery.value) {
        setIsFetching(true);
        const _getList = async () => await paymentMethodService.getList(query);
        let res = await _getList(); // TODO: Call Get List API
        if (!res.success) {
            setIsFetching(false);
            return res;
        }
        unSelectAll();
        setTotal(res.data.totalItems);
        if (listQuery.value.page && listQuery.value.page <= totalPages.value) {
            const newList = convertToPaymentMethodList(res.data.items);
            setList(newList);
            setIsFetching(false);
            return res;
        }
        setPage(totalPages.value);
        res = await _getList();
        if (!res.success) {
            const newList = convertToPaymentMethodList(res.data.items);
            setList(newList);
            setTotal(res.data.totalItems);
        }
        setIsFetching(false);
        return res;
    }

    async function getDetail(id?: string) {
        if (!id) return;
        const res = await paymentMethodService._getDetail<
            IBodyResponse<Record<string, unknown>>
        >(id);
        if (res.success) {
            const method = convertToPaymentMethodDetail(res.data);
            setDetail(method);
        }
        return res;
    }

    async function removeSelectedItems() {
        return await paymentMethodService.bulkDelete([...selectedIds.value]);
    }

    async function deletePaymentMethod(id: string) {
        return await paymentMethodService._delete<IBodyResponse<Record<string, unknown>>>(
            id,
        );
    }

    async function create(data: Record<string, unknown>) {
        const res = await paymentMethodService.create(data);
        return res;
    }
    async function update(id: string, data: Record<string, unknown>) {
        const res = await paymentMethodService.update(id, data);
        return res;
    }

    async function getCourseOptions() {
        const res = await commonApiService._getCourseDropdown();
        if (res.success) {
            const courseOptions = convertToOptions(res.data);
            setCourseOptions(courseOptions);
        }
        return res;
    }

    // Getter
    const list = computed(() => _list.value);
    const total = computed(() => _total.value);
    const detail = computed(() => _detail.value);
    const isFetching = computed(() => _isFetching.value);
    const listQuery = computed(() => _listQuery.value);
    const totalPages = computed(
        () => Math.ceil(_total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
    );
    const selectedIds = computed(() => _selectedIds);
    const isSelectedId = computed(() => (id: string) => _selectedIds.has(id));
    const isEmptySelected = computed(() => _selectedIds.size === 0);
    const isAllSelected = computed(() => _selectedIds.size === list.value.length);
    const courseOptions = computed(() => _courseOptions.value);

    // Setter
    function setList(value: IPaymentMethodListItem[]) {
        _list.value = value;
    }
    function setTotal(value: number) {
        _total.value = value;
    }
    function setDetail(value?: IPaymentMethodDetail) {
        _detail.value = value;
    }
    function setIsFetching(value: boolean) {
        _isFetching.value = value;
    }
    function setPage(page: number | string) {
        _listQuery.value.page = +page;
    }
    function setKeyword(keyword?: string) {
        _listQuery.value.keyword = keyword;
    }
    function setOrder(orderBy: string, orderDirection: IOrderDirection) {
        _listQuery.value.orderBy = orderBy;
        _listQuery.value.orderDirection = orderDirection;
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
    function setCourseOptions(options: IOption[]) {
        _courseOptions.value = options;
    }

    return {
        // Getter
        list,
        total,
        detail,
        isFetching,
        totalPages,
        listQuery,
        selectedIds,
        isSelectedId,
        isEmptySelected,
        isAllSelected,
        courseOptions,
        // Setter
        setPage,
        setKeyword,
        setOrder,
        setIsFetching,
        setDetail,
        setTotal,
        setList,
        toggleSelectedId,
        unSelectAll,
        selectAll,
        toggleSelectAll,
        // API
        create,
        update,
        getList,
        getDetail,
        removeSelectedItems,
        deletePaymentMethod,
        getCourseOptions,
    };
});